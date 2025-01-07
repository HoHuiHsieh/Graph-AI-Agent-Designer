/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import {
    lightGreen, green, blue, amber, brown, cyan, grey, indigo,
    lime, orange, pink, purple, teal, yellow, blueGrey, lightBlue,
} from "@mui/material/colors";


/**
 * 
 * @param id 
 * @returns 
 */
export function str2color(id: string): string {
    const xorBytes = (buffer: Buffer) => {
        let result = 0;
        for (let index = 0; index < buffer.length; index++) {
            result ^= buffer[index] & 0x0F;
            if (index < buffer.length - 1) {
                result ^= buffer[index + 1] >> 4;
            }
        }
        return result
    }
    const colors = [
        green[100],
        blue[100],
        amber[100],
        brown[100],
        cyan[100],
        grey[100],
        indigo[100],
        lime[100],
        orange[100],
        pink[100],
        purple[100],
        teal[100],
        yellow[100],
        blueGrey[100],
        lightBlue[100],
        lightGreen[100],
    ]
    let hexBuffer = Buffer.from(id, "utf8");
    let index = xorBytes(hexBuffer);
    return colors[index]

}