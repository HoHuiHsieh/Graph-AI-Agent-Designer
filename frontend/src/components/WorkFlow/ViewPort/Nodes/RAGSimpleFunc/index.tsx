/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import RAGSimpleFuncNode from "./node"
import RAGSimpleFuncForm from "./form"
import RAGSimpleFuncDraggable from "./draggable";


export default class RAGSimpleFunc {
    static label = "RAG Function Calling";
    static title = "RAG Function Calling";
    static node = RAGSimpleFuncNode;
    static form = RAGSimpleFuncForm;
    static draggable = RAGSimpleFuncDraggable;
}
