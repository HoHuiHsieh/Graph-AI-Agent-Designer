"use server";
/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Node, Edge } from "reactflow";
import LangGraph from "./langgraph";
import { CredentialType } from "../../types/credential";


const graph = new LangGraph();

/**
 * Add nodes to the graph
 * @param nodes
 */
export async function addNodes(nodes: Node[]): Promise<void> {
  await graph.addNodes(nodes);
}

/**
 * Add edges to the graph
 * @param edges
 */
export async function addEdges(edges: Edge[]): Promise<void> {
  await graph.addEdges(edges);
}

/**
 * Add credentials to the graph
 * @param credentials
 */
export async function addCredentials(credentials: CredentialType): Promise<void> {
  await graph.addCredentials(credentials);
}

/**
 * Clear the graph
 */
export async function clearGraph(): Promise<void> {
  await graph.clearGraph();
}

/**
 * Get the graph
 * @returns
 */
export async function getGraph(): Promise<{ nodes: Node[]; edges: Edge[], credentials: CredentialType }> {
  return graph.getGraph();
}

/**
 * Get workflows
 * @returns 
 */
export async function getWorkflows(): Promise<Map<string, { nodes: Node[]; edges: Edge[], credentials: CredentialType, subflows?: string[] }>> {
  return graph.getWorkflows();
}

/**
 * Clear the graph memory
 * @param id 
 */
export async function cleanMemory(id: string): Promise<void> {
  await graph.cleanMemory(id);
}

/**
 * Run the workflow
 * @param userPrompt 
 * @param workflowId 
 */
export async function* stream(
  userPrompt: string,
  workflowId: string,
): AsyncGenerator<string, void, unknown> {
  const stream = await graph.stream(userPrompt, workflowId);
  for await (const chunk of stream) {
    if (chunk && typeof chunk === "object") {
      for (const [_, values] of Object.entries(chunk)) {
        if (values) {
          // console.log(values);
          yield JSON.stringify(values);
        }
      }
    }
  }
}

/**
 * Abort the string
 * @param workflowId 
 */
export async function abortStream(workflowId?: string) {
  return graph.abortController.abort();
}
