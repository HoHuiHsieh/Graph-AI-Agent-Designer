/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import PythonCallSystNode from "./node"
import PythonCallSystForm from "./form"
import PythonCallSystDraggable from "./draggable";


export default class PythonCallSyst {
    static label = "Call Python Function";
    static title = "Python Functions";
    static node = PythonCallSystNode;
    static form = PythonCallSystForm;
    static draggable = PythonCallSystDraggable;

}
