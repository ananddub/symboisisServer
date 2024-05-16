const fs = require("fs");
const path = require("path");
import { EMPIMGADD, IMAGEADD } from "./variables";
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

export function getEmpImage(admno: string): string {
  try {
    const imagePath = path.join(__dirname, `${EMPIMGADD}/${admno}`);
    const image = fs.readFileSync(imagePath, "base64");
    console.log(admno);
    return image;
  } catch (e: any) {
    // console.log(e.message);
    // const image = fs.readFileSync('uploads/profile.png', "base64");
    return "";
  }
}
export const imageExist = (admno: string) => {
  const imagePath = path.join(__dirname, `${IMAGEADD}/${admno}`);
  return fs.existsSync(imagePath);
};
