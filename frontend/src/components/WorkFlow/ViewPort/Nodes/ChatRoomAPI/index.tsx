/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import ChatRoomAPINode from "./node"
import ChatRoomAPIForm from "./form"
import ChatRoomAPIDraggable from "./draggable";


export default class ChatRoomAPI {
    static label = "Call ChatRoom Function";
    static title = "Call ChatRoom Function";
    static node = ChatRoomAPINode;
    static form = ChatRoomAPIForm;
    static draggable = ChatRoomAPIDraggable;
}
