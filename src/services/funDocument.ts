import { DOCADD, IMAGEADD } from "./variables";
const fs = require("fs");
const path = require("path");
export function getDoc(filename: string): string {
  try {
    const imagePath = path.join(__dirname, `${DOCADD}/${filename}`);
    const image = fs.readFileSync(imagePath, "base64");
    return image;
  } catch (e) {
    // const image = fs.readFileSync('uploads/profile.png', "base64");
    return "";
  }
}
