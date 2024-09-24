/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import LLMCheckFactNode from "./node"
import LLMCheckFactForm from "./form"
import LLMCheckFactDraggable from "./draggable";


export default class LLMCheckFact {
    static label = "LLM Fact Checking";
    static title = "LLM Fact Checking";
    static node = LLMCheckFactNode;
    static form = LLMCheckFactForm;
    static draggable = LLMCheckFactDraggable;
}
