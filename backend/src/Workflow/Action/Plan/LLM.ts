/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ChatCompletion } from "../../../Models";
import { ChatRoomMessage, ReactFlowNode } from "../../typedef";
import { LLMParameters, StaticNodeAction } from "../typedef";


interface ToolNode extends ReactFlowNode {
    data: {
        name: string,
        description: string,
        properties: {
            name: string,
            type: string,
            description: string,
            required: boolean,
        }[],
    }
}

interface ToolProps extends StaticNodeAction {
    node: ToolNode
}


interface PlanNode extends ReactFlowNode {
    data: {
        model: string,
        parameters: LLMParameters,
        iden_prompt: string,
        plan_prompt: string,
        result?: ChatRoomMessage[]
    }
}


interface PlanProps extends StaticNodeAction {
    node: PlanNode
}

/**
 * 
 * @param tool 
 * @param messages 
 * @param tools 
 * @param props 
 * @returns 
 */
export async function runLLMPlanner(plan: PlanProps, messages: ChatRoomMessage[], tools: ToolProps[], props?: any): Promise<string> {
    const { model, parameters, iden_prompt, plan_prompt } = plan.node.data;

    // check input
    if (!iden_prompt.includes("{{ message }}")) {
        throw new Error("'{{ message }}' is required in Planner reasoning prompt.")
    }
    if (!plan_prompt.includes("{{ methods }}")) {
        throw new Error("'{{ methods }}' is required in Planner task prompt.")
    }
    if (messages[messages.length - 1].role !== "user") {
        throw new Error("The last message should come from the user.")
    }

    // reasoning user's question
    let resMsgs: ChatRoomMessage[] = JSON.parse(JSON.stringify(messages));
    resMsgs[resMsgs.length - 1].content = iden_prompt.replace("{{ message }}", resMsgs[resMsgs.length - 1].content);
    const reason = await ChatCompletion({
        model: model,
        messages: resMsgs,
        parameters: parameters,
    })
    resMsgs.push({ role: "assistant", content: reason });

    // generating tasks
    const toolTip = tools.map((e, index) => {
        const f_name = e.node.data.name || "",
            properties = e.node.data?.properties || [],
            f_prop = properties.map(e => e.name).join(","),
            f_desc = `Description: ${e.node.data?.description || "None"}`,
            f_inpt = properties.length == 0 ? "" : `Args:\n${properties.map(e => `\t\t${e.name}:${e.description}`).join("\n")}`;
        return `${index + 1}. ${f_name.trim()}(${f_prop.trim()})\n\t${f_desc.trim()}\n\t${f_inpt.trim()}\n\t`
    }).join("\n")
    resMsgs.push({ role: "user", content: plan_prompt.replace("{{ methods }}", toolTip) });
    const tasks = await ChatCompletion({
        model: plan.node.data.model,
        messages: resMsgs,
        parameters: plan.node.data.parameters,
    })
    resMsgs.push({ role: "assistant", content: tasks });

    // return plan list
    plan.node.data.result = resMsgs;
    return `${reason}\n\n${tasks}`
}