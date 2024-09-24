/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import LLMFunctionCallNode from "./node"
import LLMFunctionCallForm from "./form"
import LLMFunctionCallDraggable from "./draggable";


export default class LLMFunctionCall {
    static label = "LLM Function Calling";
    static title = "LLM Function Calling";
    static node = LLMFunctionCallNode;
    static form = LLMFunctionCallForm;
    static draggable = LLMFunctionCallDraggable;
}
