/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import MemorySystForm from "./form";
import MemorySystNode from "./node"
import MemorySystDraggable from "./draggable";


export default class MemorySyst {
    static label = "Short Memory";
    static title = "Short Memory";
    static node = MemorySystNode;
    static form = MemorySystForm;
    static draggable = MemorySystDraggable;
}
