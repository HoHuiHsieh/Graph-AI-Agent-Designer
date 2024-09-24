/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import PythonRunSystNode from "./node"
import PythonRunSystForm from "./form"
import PythonRunSystDraggable from "./draggable";


export default class PythonRunSyst {
    static label = "Run Python Script";
    static title = "Python Script";
    static node = PythonRunSystNode;
    static form = PythonRunSystForm;
    static draggable = PythonRunSystDraggable;
}
