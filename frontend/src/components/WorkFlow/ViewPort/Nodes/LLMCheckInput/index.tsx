/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import LLMCheckInputNode from "./node"
import LLMCheckInputForm from "./form"
import LLMCheckInputDraggable from "./draggable";


export default class LLMCheckInput {
    static label = "LLM Prompt Checking";
    static title = "LLM Prompt Checking";
    static node = LLMCheckInputNode;
    static form = LLMCheckInputForm;
    static draggable = LLMCheckInputDraggable;
}
