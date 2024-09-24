/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import TextFileInstForm from "./form"
import TextFileInstNode from "./node"
import TextFileInstDraggable from "./draggable";


export default class TextFileInst {
    static label = "Text File";
    static title = "Instruction";
    static node = TextFileInstNode;
    static form = TextFileInstForm;
    static draggable = TextFileInstDraggable;
}
