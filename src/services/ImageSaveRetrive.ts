const fs = require("fs");
const path = require("path");
import { IMAGEADD } from "./variables";
export const ImageSave = (name: string, data: string) => {
  try {
    fs.writeFileSync(`${IMAGEADD}/${name}`, data);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
export function getImage(admno: string): string {
  try {
    const imagePath = path.join(__dirname, `${IMAGEADD}/${admno}`);
    const image = fs.readFileSync(imagePath, "base64");
    return image;
  } catch (e) {
    // const image = fs.readFileSync('uploads/profile.png', "base64");
    return "";
  }
}

export const imageExist = (admno: string) => {
  const imagePath = path.join(__dirname, `${IMAGEADD}/${admno}`);
  return fs.existsSync(imagePath);
};
