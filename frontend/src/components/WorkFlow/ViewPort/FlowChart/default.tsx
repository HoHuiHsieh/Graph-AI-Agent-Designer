/**
 * default workflow
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */

export const defaultNodes = [
    {
        id: "1",
        type: "EntryPoint",
        position: { x: -320, y: 300 },
        data: {},
    },
    {
        id: "2",
        type: "LLMChatCompletion",
        position: { x: 0, y: 300 },
        data: {},
    },
    {
        id: "3",
        type: "ChatRoom",
        position: { x: 300, y: 300 },
        data: {},
    },
    {
        id: "4",
        type: "TextfieldSyst",
        position: { x: -320, y: 150 },
        data: {},
    },
]


export const defaultEdges = [
    { id: "e1-2", source: "1", sourceHandle: "prompt", target: "2", targetHandle: "prompt" },
    { id: "e2-3", source: "2", sourceHandle: "prompt", target: "3", targetHandle: "prompt" },
    { id: "e4-2", source: "4", sourceHandle: "system", target: "2", targetHandle: "system" },
]