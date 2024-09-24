/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import TextFileSystForm from "./form";
import TextFileSystNode from "./node"
import TextFileSystDraggable from "./draggable";


export default class TextFileSyst {
    static label = "Text File";
    static title = "System Prompt";
    static node = TextFileSystNode;
    static form = TextFileSystForm;
    static draggable = TextFileSystDraggable;
}
