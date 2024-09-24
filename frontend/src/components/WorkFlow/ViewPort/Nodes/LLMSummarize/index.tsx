/**
 * collect components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import LLMSummarizeNode from "./node"
import LLMSummarizeForm from "./form"
import LLMSummarizeDraggable from "./draggable";


export default class LLMSummarize {
    static label = "LLM Summarize";
    static title = "LLM Summarize";
    static node = LLMSummarizeNode;
    static form = LLMSummarizeForm;
    static draggable = LLMSummarizeDraggable;
}
