/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import RAGSimpleInstNode from "./node"
import RAGSimpleInstForm from "./form"
import RAGSimpleInstDraggable from "./draggable";


export default class RAGSimpleInst {
    static label = "Simple RAG";
    static title = "Simple RAG";
    static node = RAGSimpleInstNode;
    static form = RAGSimpleInstForm;
    static draggable = RAGSimpleInstDraggable;
}
