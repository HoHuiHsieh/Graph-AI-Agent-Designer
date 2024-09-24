/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import ChatRoomNode from "./node";
import ChatRoomForm from "./form";
import ChatRoomDraggable from "./draggable";


export default class ChatRoom {
    static label = "ChatRoom";
    static title = "ChatRoom";
    static node = ChatRoomNode;
    static form = ChatRoomForm;
    static draggable = ChatRoomDraggable;
}
