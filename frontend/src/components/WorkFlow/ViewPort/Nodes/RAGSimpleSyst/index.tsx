/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import RAGSimpleSystNode from "./node"
import RAGSimpleSystForm from "./form"
import RAGSimpleSystDraggable from "./draggable";


export default class RAGSimpleSyst {
    static label = "Simple RAG";
    static title = "Simple RAG";
    static node = RAGSimpleSystNode;
    static form = RAGSimpleSystForm;
    static draggable = RAGSimpleSystDraggable;
}
