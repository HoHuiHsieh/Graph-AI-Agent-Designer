/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import PythonRunInstNode from "./node"
import PythonRunInstForm from "./form"
import PythonRunInstDraggable from "./draggable";


export default class PythonRunInst {
    static label = "Run Python Script";
    static title = "Python Script";
    static node = PythonRunInstNode;
    static form = PythonRunInstForm;
    static draggable = PythonRunInstDraggable;
}
