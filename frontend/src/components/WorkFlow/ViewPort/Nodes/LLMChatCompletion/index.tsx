/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import LLMChatCompletionNode from "./node"
import LLMChatCompletionForm from "./form"
import LLMChatCompletionDraggable from "./draggable";


export default class LLMChatCompletion {
    static label = "LLM Chat Completion";
    static title = "LLM Chat Completion";
    static node = LLMChatCompletionNode;
    static form = LLMChatCompletionForm;
    static draggable = LLMChatCompletionDraggable;
}
