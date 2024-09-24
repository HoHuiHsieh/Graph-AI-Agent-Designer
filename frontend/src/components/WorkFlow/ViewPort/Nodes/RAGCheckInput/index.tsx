/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import RAGCheckInputNode from "./node"
import RAGCheckInputForm from "./form"
import RAGCheckInputDraggable from "./draggable";


export default class RAGCheckInput {
    static label = "RAG Prompt Checking";
    static title = "RAG Prompt Checking";
    static node = RAGCheckInputNode;
    static form = RAGCheckInputForm;
    static draggable = RAGCheckInputDraggable;
}
