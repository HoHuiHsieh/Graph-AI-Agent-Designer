/**
 * @author HoHui Hsieh
 */
import ChatRoomAction from "./ChatRoom";
import ChatRoomAPIAction from "./ChatRoomAPI";

import LLMChatCompletionAction from "./LLMChatCompletion";
import LLMFunctionCallAction from "./LLMFunctionCall";
import LLMSummarizeAction from "./LLMSummarize";
import LLMCheckInputAction from "./LLMCheckInput";
import LLMCheckOutputAction from "./LLMCheckOutput";
import LLMCheckFactAction from "./LLMCheckFact";

import PythonRunInstAction from "./PythonRunInst";
import PythonRunSystAction from "./PythonRunSyst";
import PythonCallInstAction from "./PythonCallInst";
import PythonCallSystAction from "./PythonCallSyst";

import RAGSimpleInstAction from "./RAGSimpleInst";
import RAGSimpleSystAction from "./RAGSimpleSyst";
import RAGSimpleFuncAction from "./RAGSimpleFunc";
import RAGCheckInputAction from "./RAGCheckInput";
import RAGCheckOutputAction from "./RAGCheckOutput";

import MemoryInstAction from "./MemoryInst";
import MemorySystAction from "./MemorySyst";


export const actionTypes = {
    ChatRoom: ChatRoomAction,
    ChatRoomAPI: ChatRoomAPIAction,
    LLMChatCompletion: LLMChatCompletionAction,
    LLMFunctionCall: LLMFunctionCallAction,
    LLMSummarize: LLMSummarizeAction,
    LLMCheckInput: LLMCheckInputAction,
    LLMCheckOutput: LLMCheckOutputAction,
    LLMCheckFact: LLMCheckFactAction,
    PythonRunInst: PythonRunInstAction,
    PythonRunSyst: PythonRunSystAction,
    PythonCallInst: PythonCallInstAction,
    PythonCallSyst: PythonCallSystAction,
    RAGSimpleInst: RAGSimpleInstAction,
    RAGSimpleSyst: RAGSimpleSystAction,
    RAGSimpleFunc: RAGSimpleFuncAction,
    RAGCheckInput: RAGCheckInputAction,
    RAGCheckOutput: RAGCheckOutputAction,
    MemorySyst: MemorySystAction,
    MemoryInst: MemoryInstAction,
}
