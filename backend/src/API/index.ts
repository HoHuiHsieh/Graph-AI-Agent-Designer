/**
 * add support for multiple LLM models and sources
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import {
    chat_models as openai_chat_models,
    embeddings as openai_embedding_models,
    asr_models as openai_asr_models,
    tts_models as openai_tts_models,
} from "./openai"


/** LLM model list */
export const modelList = {
    chat_completion: openai_chat_models,
    tool_use: openai_chat_models,
    embedding: openai_embedding_models,
    asr: openai_asr_models,
    tts: openai_tts_models,
}

