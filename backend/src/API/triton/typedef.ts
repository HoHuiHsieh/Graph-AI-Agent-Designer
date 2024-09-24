/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
export interface Message {
    role: "user" | "assistant" | "system",
    content: string,
}
