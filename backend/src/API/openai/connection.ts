/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import OpenAI from "openai";


/** */
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
