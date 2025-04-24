/**
 * @fileoverview 
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatOpenAI, ChatOpenAIFields } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { buildHTTPTool, buildJSTool, buildPostgreSQLTool } from "./tools";
import { AgentNode, CodeToolDataType, DATA_TYPES, HttpToolDataType, PostgreSQLToolDataType } from "../../../types/nodes";
import { CredentialType } from "../../../types/credential";
import { MainStateType } from "../type";
import { handleHandoffs } from "../node/handoff";
import { replacePlaceholders } from "../utils";


/**
 * Builds the inference model based on the provided configuration.
 * @param model The model configuration.
 * @returns An instance of ChatOpenAI.
 * @throws Error if the model type is invalid.
 */
function buildOpenAiInferModel(props: ChatOpenAIFields): ChatOpenAI {
    return new ChatOpenAI(props);
}

/**
 * Builds the tools based on their types.
 * @param tools The list of tool configurations.
 * @returns A list of tools.
 */
function buildTools(tools: AgentNode["data"]["tools"] = []) {
    let toolsList: DynamicStructuredTool<any>[] = [];
    for (const tool of tools) {
        switch (tool.type) {
            case "javascript":
                toolsList.push(buildJSTool(tool as CodeToolDataType));
                break;
            case "postgresql":
                toolsList.push(buildPostgreSQLTool(tool as PostgreSQLToolDataType));
                break;
            case "http":
                toolsList.push(buildHTTPTool(tool as HttpToolDataType));
                break;
            default:
                throw new Error(`Unsupported tool type: ${tool.type}`);
        }
    }
    return toolsList
}

/**
 * Creates a ReAct agent node.
 * @param state The main state.
 * @param data The agent node data.
 * @returns A promise resolving to the created ReAct agent.
 */
export function ReActAgentGraph(
    data: AgentNode["data"],
    credentials: CredentialType,
    memorySaver: MemorySaver
) {
    let { name, type, model, tools, memory, userPrompt, systemPrompt, handoffs } = data;

    // check type
    if (type !== DATA_TYPES.REACT_AGENT) {
        throw new Error(`Invalid agent type: expected "${DATA_TYPES.REACT_AGENT}", received "${type}"`);
    }

    // Build inference model
    let inferModel: ChatOpenAI;
    switch (model.type) {
        case "openai":
            let openAiCredential = credentials.openai.find((cred) => cred.credName === model.credName);
            let chatCompletionProps = {
                model: model.model,
                topP: model.top_p,
                temperature: model.temperature,
                maxCompletionTokens: model.max_completion_tokens,
                frequencyPenalty: model.frequency_penalty,
                presencePenalty: model.presence_penalty,
                apiKey: openAiCredential.apiKey,
                parallelToolCalls: model.parallel_tool_calls,
                configuration: {
                    baseURL: openAiCredential.baseUrl,
                },
            }
            inferModel = buildOpenAiInferModel(chatCompletionProps);
            break;

        default:
            break;
    }

    // Build and bind tools   
    const toolsList = buildTools(tools);

    // return 
    return async (currentState: MainStateType) => {
        // replace placeholders in userPrompt and systemPrompt
        const updatedUserPrompt = replacePlaceholders(userPrompt, currentState);
        const updatedSystemPrompt = replacePlaceholders(systemPrompt, currentState);

        // Prepare react agent
        const workflow = createReactAgent({
            llm: inferModel,
            tools: toolsList,
            checkpointer: memory ? memorySaver : undefined,
            stateModifier: updatedSystemPrompt,
        })

        // Prepare input for the workflow
        const inputMessages = [
            ...currentState.messages,
            new HumanMessage(updatedUserPrompt)
        ];

        // Invoke the workflow and get the output
        const workflowOutput = await workflow.invoke({ messages: inputMessages });

        // Return the updated state
        const updatedState = {
            ...currentState,
            messages: workflowOutput.messages,
        };

        // Process handoffs if any
        return handleHandoffs(handoffs, name, updatedState, credentials)
    }
}