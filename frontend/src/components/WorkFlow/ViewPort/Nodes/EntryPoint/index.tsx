/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import EntryPointNode from "./node";
import EntryPointDraggable from "./draggable";


export default class EntryPoint {
    static label = "EntryPoint";
    static title = "Entry Point";
    static node = EntryPointNode;
    static form = () => <></>;
    static draggable = EntryPointDraggable;
}
