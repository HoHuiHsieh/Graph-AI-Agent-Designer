/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import RAGCheckOutputNode from "./node"
import RAGCheckOutputForm from "./form"
import RAGCheckOutputDraggable from "./draggable";


export default class RAGCheckOutput {
    static label = "RAG Output Checking";
    static title = "RAG Output Checking";
    static node = RAGCheckOutputNode;
    static form = RAGCheckOutputForm;
    static draggable = RAGCheckOutputDraggable;
}
