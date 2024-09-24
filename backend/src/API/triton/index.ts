/**
 * @author HoHui Hsieh <c95hhh@ncsist.org.tw>
 * @module api/triton
 */
import TaideLX7BChat from "./taide-lx-7b-chat";
import ASR from "./asr";
import TTS from "./tts";

// Taide-LX-7B-Chat service api
export const taide7b = new TaideLX7BChat();

// ASR service api
export const asr = new ASR();

// TTS service api
export const tts = new TTS();