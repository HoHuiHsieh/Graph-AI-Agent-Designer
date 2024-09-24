/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import PythonCallInstNode from "./node"
import PythonCallInstForm from "./form"
import PythonCallInstDraggable from "./draggable";


export default class PythonCallInst {
    static label = "Call Python Function";
    static title = "Python Functions";
    static node = PythonCallInstNode;
    static form = PythonCallInstForm;
    static draggable = PythonCallInstDraggable;
}
