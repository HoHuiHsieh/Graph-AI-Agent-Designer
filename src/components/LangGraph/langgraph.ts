/**
 * @fileoverview This file contains the LangGraph class which is responsible for managing nodes and edges in a graph,
 * and running the graph workflow using the StateGraph from @langchain/langgraph.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { StateGraph, START, END, MemorySaver, CompiledStateGraph } from "@langchain/langgraph";
import type { Node, Edge } from "reactflow";
import { MainStateAnnotation } from "./type";
import { JavaScriptNode, PostgreSQLNodeType, HttpNode, SubflowNode } from "./node";
import { CleanMemoryGraph, ReActAgentGraph } from "./prebuild";
import { CredentialType } from "../../types/credential";
import { DATA_TYPES, NODE_TYPES } from "../../types/nodes";
import events from 'events';

events.EventEmitter.defaultMaxListeners = 50;

/**
 * Class LangGraph
 */
export default class LangGraph {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  credentials: CredentialType;
  memorySaver: MemorySaver | undefined;
  abortController: AbortController;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.credentials = {
      openai: [],
      postgresql: [],
    };
    this.memorySaver = new MemorySaver();
    this.abortController = new AbortController();
  }

  /**
   * Add nodes to the graph
   * @param data
   */
  async addNodes(data: Node[]): Promise<void> {
    await Promise.all(data.map((node) => {
      const nodeId = node.id;
      if (!this.nodes.has(nodeId)) {
        this.nodes.set(nodeId, node);
      }
    }));
  }

  /**
   * Add edges to the graph
   * @param data
   */
  async addEdges(data: Edge[]): Promise<void> {
    await Promise.all(data.map((edge) => {
      const sourceId = edge.source,
        targetId = edge.target;
      if (this.nodes.has(sourceId) && this.nodes.has(targetId)) {
        const edgeId = edge.id || `${sourceId}-${targetId}`;
        this.edges.set(edgeId, edge);
      }
    }));
  }

  /**
   * Add credentials to the graph
   * @param data - Credentials to add for node connections
   */
  async addCredentials(data: CredentialType): Promise<void> {
    // Store the credentials for use in node connections
    this.credentials.openai = [...this.credentials.openai, ...(data.openai || [])];
    this.credentials.postgresql = [...this.credentials.postgresql, ...(data.postgresql || [])];
  }

  /**
   * Get the graph
   * @returns
   */
  getGraph(): { nodes: Node[]; edges: Edge[], credentials: CredentialType } {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
      credentials: this.credentials,
    };
  }

  /**
   * Clear the graph
   */
  clearGraph(): void {
    this.nodes.clear();
    this.edges.clear();
    this.credentials.openai = [];
    this.credentials.postgresql = [];
  }

  /**
   * Clear the memory in MemorySaver
   * @param workflowId
   */
  cleanMemory(workflowId: string) {
    const graph = CleanMemoryGraph(this.memorySaver);
    return graph.stream({ messages: [] },
      {
        configurable: { thread_id: workflowId },
        streamMode: "values"
      });
  }

  /**
   * 
   * @param user_prompt 
   * @returns 
   */
  async stream(user_prompt: string, workflowId: string) {
    // Create a new AbortController for this stream
    this.abortController = new AbortController();

    // Get workflows
    const workflows = this.getWorkflows();

    // Compile the workflow
    const graphs = LangGraph.compileWorkflow(workflows, this.credentials, this.memorySaver);
    const graph = graphs.get(workflowId);

    // Return the stream generator
    let inputs: typeof MainStateAnnotation.State = {
      json: { Chat: { input: user_prompt } },
      messages: []
    };

    // Return the stream
    return graph.stream(inputs, {
      configurable: { thread_id: workflowId },
      streamMode: "updates",
      subgraphs: true,
      recursionLimit: 10,
      signal: this.abortController.signal,
    });
  }

  /**
   * Group the connected nodes and edges between the following 2 node types:
   * - node.data.type === "start"
   * - node.data.type === "end"
   * @returns Map of workflow IDs to their nodes, edges, and subflows
   */
  getWorkflows(): Map<string, { nodes: Node[], edges: Edge[], credentials: CredentialType, subflows?: string[] }> {
    // Initialize the workflows map
    const workflows: Map<string, { nodes: Node[], edges: Edge[], credentials: CredentialType, subflows?: string[] }> = new Map();

    // Find all start nodes to identify workflows
    const startNodes = Array.from(this.nodes.values()).filter(node => node.data.type === "start" || node.data.type === "chat");

    for (const startNode of startNodes) {
      // Traverse the graph starting from the current start node
      const { workflowNodes, workflowEdges } = this.traverseFromNode(startNode.id);

      // Process node relationships
      const { processedNodes, processedEdges } = this.collectComponents(
        workflowNodes,
        workflowEdges
      );

      // Store the workflow in the map
      workflows.set(startNode.id, {
        nodes: processedNodes,
        edges: processedEdges,
        credentials: this.credentials,
      });
    }

    return workflows;
  }

  /**
   * Traverse the graph starting from a specific node
   * @param startNodeId - ID of the node to start traversal from
   * @returns Sets of visited node IDs and edge IDs
   */
  private traverseFromNode(startNodeId: string): { workflowNodes: Map<string, Node>, workflowEdges: Map<string, Edge> } {
    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    const workflowNodes = new Map<string, Node>();
    const workflowEdges = new Map<string, Edge>();
    const stack = [startNodeId];

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!;
      if (!visitedNodes.has(currentNodeId)) {
        visitedNodes.add(currentNodeId);

        // Add the current node to the workflowNodes map
        const currentNode = this.nodes.get(currentNodeId);
        if (currentNode) {
          workflowNodes.set(currentNodeId, currentNode);
        }

        // Find all outgoing edges from the current node
        for (const edge of this.edges.values()) {
          if (edge.source === currentNodeId && !visitedEdges.has(edge.id)) {
            visitedEdges.add(edge.id);

            // Add the edge to the workflowEdges map
            workflowEdges.set(edge.id, edge);

            // Push the target node to the stack for further traversal
            stack.push(edge.target);
          }
        }
      }
    }

    return { workflowNodes, workflowEdges };
  }

  /**
   * Process workflow components to merge data and filter nodes.
   * Node data of types: model, tool, and workflow are merged into the source node.
   * @param nodes - All nodes in the workflow
   * @param edges - All edges in the workflow
   * @returns Processed nodes, edges, and identified subflows
   */
  private collectComponents(nodes: Map<string, Node>, edges: Map<string, Edge>): {
    processedNodes: Node[],
    processedEdges: Edge[],
  } {
    // Iterate through the nodes 
    for (const [nodeId, node] of nodes.entries()) {

      // filter out nodes connected to current node
      const connectedEdges = Array.from(edges.values()).filter(edge => edge.source === nodeId);

      // Iterate through the target nodes of the edges
      for (const edge of connectedEdges) {
        // Merge data from model and tool nodes
        const targetNode = nodes.get(edge.target);
        if (targetNode) {
          switch (targetNode.type) {
            case NODE_TYPES.MODEL:
              node.data = { ...node.data, model: { ...targetNode.data } };
              // Remove the model node and its edges
              nodes.delete(edge.target);
              edges.delete(edge.id);
              break;
            case NODE_TYPES.TOOL:
              if (!node.data.tools) {
                node.data.tools = [];
              }
              node.data = { ...node.data, tools: [...node.data.tools, { ...targetNode.data }] };
              // Remove the tool node and its edges
              nodes.delete(edge.target);
              edges.delete(edge.id);
              break;
            default:
              break;
          }
        }
      }
      // set node data
      nodes.set(nodeId, node);
    }
    return {
      processedNodes: Array.from(nodes.values()),
      processedEdges: Array.from(edges.values()),
    };
  }

  /**
   * Compile the workflows into a state graph.
   * This function processes the workflows and compiles them into a state graph.
   * @param workflows 
   * @param memorySaver 
   * @returns 
   */
  static compileWorkflow(
    workflows: Map<string, { nodes: Node[], edges: Edge[] }>,
    credentials: CredentialType,
    memorySaver?: MemorySaver,
  ) {
    const visitedWorkflows = new Set<string>();
    const compiledWorkflows = new Map<string, CompiledStateGraph<any, any>>();

    // Iterate until all workflows are processed
    while (visitedWorkflows.size <= workflows.size) {
      // Find the next workflow that can be compiled
      const nextWorkflow = this.findNextWorkflow(workflows, visitedWorkflows);
      if (!nextWorkflow) break;

      // Create a new StateGraph for the workflow
      const graph = new StateGraph(MainStateAnnotation);

      // Add nodes and edges to the graph
      this.addNodesToGraph(graph, nextWorkflow, compiledWorkflows, credentials, memorySaver);
      this.addEdgesToGraph(graph, nextWorkflow);

      // Extract the thread ID and compile the graph
      const threadId = this.getThreadId(nextWorkflow);
      const compiledGraph = graph.compile({ checkpointer: memorySaver });

      // Store the compiled graph and mark the workflow as visited
      compiledWorkflows.set(threadId, compiledGraph);
      visitedWorkflows.add(threadId);
      workflows.delete(threadId);
    }

    return compiledWorkflows;
  }

  /**
   * Find the next workflow to compile.
   * This function looks for a workflow where all dependent workflows are already compiled.
   * @param workflows 
   * @param visitedWorkflows 
   * @returns 
   */
  private static findNextWorkflow(
    workflows: Map<string, { nodes: Node[], edges: Edge[] }>,
    visitedWorkflows: Set<string>
  ) {
    // Find a workflow where all dependent workflows are already compiled
    return Array.from(workflows.values()).find(workflow =>
      workflow.nodes.every(node =>
        node.data.type !== DATA_TYPES.SUBFLOW || visitedWorkflows.has(node.data.workflowId)
      )
    );
  }

  /**
   * Add nodes to the graph based on their type.
   * This function handles different node types such as react, javascript, postgresql, http, and workflow.
   * @param graph 
   * @param workflow 
   * @param compiledWorkflows 
   */
  private static addNodesToGraph(
    graph: StateGraph<any>,
    workflow: { nodes: Node[], edges: Edge[] },
    compiledWorkflows: Map<string, CompiledStateGraph<any, any>>,
    credentials: CredentialType,
    memorySaver?: MemorySaver
  ) {
    for (const node of workflow.nodes) {
      let nodeActor: any;

      // Determine the actor for the node based on its type
      switch (node.data.type) {
        case DATA_TYPES.REACT_AGENT:
          nodeActor = ReActAgentGraph(node.data, credentials, memorySaver);
          break;
        case DATA_TYPES.JAVASCRIPT:
          nodeActor = JavaScriptNode(node.data, credentials);
          break;
        case DATA_TYPES.POSTGRESQL:
          nodeActor = PostgreSQLNodeType(node.data, credentials);
          break;
        case DATA_TYPES.HTTP:
          nodeActor = HttpNode(node.data, credentials);
          break;
        case DATA_TYPES.SUBFLOW:
          const workflowId = node.data.workflowId;
          let subflow = compiledWorkflows.get(workflowId);
          if (!subflow) {
            throw new Error(`Workflow ${workflowId} not compiled yet`);
          }
          nodeActor = SubflowNode(node.data, subflow, credentials);
          break;
        default:
          // do nothing
          break;
      }

      // Add node to the graph if it has an actor
      if (nodeActor) {
        // Get outgoers for the node
        const outgoers = workflow.edges.filter(edge => edge.source === node.id);

        // If the node has multiple outgoers, add node with ends
        // Otherwise, add the node without ends
        if (outgoers.length > 1) {
          const ends = outgoers.map(edge => {
            let targetNode = workflow.nodes.find(n => n.id === edge.target);
            if (targetNode) {
              switch (targetNode.data.type) {
                case DATA_TYPES.END:
                  return "__end__";
                case DATA_TYPES.START:
                  return "__start__";
                default:
                  return targetNode.data.name;
              }
            }
          });
          // Add the node with ends
          graph.addNode(node.data.name, nodeActor, { ends });
        } else {
          // Add the node without ends
          graph.addNode(node.data.name, nodeActor);
        }
      }
    }
  }

  /**
   * Add edges to the graph based on the node types.
   * This function handles edges between start, end, and other nodes.
   * @param graph 
   * @param workflow 
   */
  private static addEdgesToGraph(
    graph: StateGraph<any>,
    workflow: { nodes: Node[], edges: Edge[] }
  ) {
    for (const edge of workflow.edges) {
      const sourceNode = workflow.nodes.find(n => n.id === edge.source);
      const targetNode = workflow.nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) {
        throw new Error(`Invalid edge: ${edge.id}`);
      }

      // Count outgoers for the source node.
      // If the source node has multiple outgoers, skip adding edges.
      // Handoff mechanism will handle the decision. 
      const outgoers = workflow.edges.filter(e => e.source === sourceNode.id);
      if (outgoers.length > 1) {
        continue;
      }

      // Add edges based on node types
      if (sourceNode.data.type === DATA_TYPES.START || sourceNode.data.type === DATA_TYPES.CHAT) {
        graph.addEdge(START, targetNode.data.name as "__end__");
        continue;
      }
      if (targetNode.data.type === DATA_TYPES.END) {
        graph.addEdge(sourceNode.data.name as "__start__", END);
        continue;
      }
      graph.addEdge(sourceNode.data.name as "__start__", targetNode.data.name as "__end__");
    }
  }

  /**
   * Get the thread ID from the start node.
   * This function assumes that the start node is the entry point for the workflow.
   * @param workflow 
   * @returns 
   */
  private static getThreadId(workflow: { nodes: Node[], edges: Edge[] }): string {
    // Extract the thread ID from the start node
    const startNode = workflow.nodes.find(node => node.data.type === DATA_TYPES.START || node.data.type === DATA_TYPES.CHAT);
    if (!startNode) {
      throw new Error("No start node found");
    }
    return startNode.id;
  }

}
