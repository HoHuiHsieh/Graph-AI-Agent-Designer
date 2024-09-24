/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import LLMCheckOutputNode from "./node"
import LLMCheckOutputForm from "./form"
import LLMCheckOutputDraggable from "./draggable";


export default class LLMCheckOutput {
    static label = "LLM Output Checking";
    static title = "LLM Output Checking";
    static node = LLMCheckOutputNode;
    static form = LLMCheckOutputForm;
    static draggable = LLMCheckOutputDraggable;
}
