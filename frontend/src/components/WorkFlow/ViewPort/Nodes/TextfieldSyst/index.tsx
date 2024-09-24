/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import TextfieldSystForm from "./form"
import TextfieldSystNode from "./node"
import TextfieldSystDraggable from "./draggable";


export default class TextfieldSyst {
    static label = "Textfield";
    static title = "System Prompt";
    static node = TextfieldSystNode;
    static form = TextfieldSystForm;
    static draggable = TextfieldSystDraggable;
}
