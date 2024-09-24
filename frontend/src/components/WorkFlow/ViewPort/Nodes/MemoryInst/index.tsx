/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import MemoryInstForm from "./form";
import MemoryInstNode from "./node"
import MemoryInstDraggable from "./draggable";


export default class MemoryInst {
    static label = "Short Memory";
    static title = "Short Memory";
    static node = MemoryInstNode;
    static form = MemoryInstForm;
    static draggable = MemoryInstDraggable;
}
