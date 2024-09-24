/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import TextfieldInstForm from "./form"
import TextfieldInstNode from "./node"
import TextfieldInstDraggable from "./draggable";


export default class TextfieldInst {
    static label = "Textfield";
    static title = "Instruction";
    static node = TextfieldInstNode;
    static form = TextfieldInstForm;
    static draggable = TextfieldInstDraggable;
}
