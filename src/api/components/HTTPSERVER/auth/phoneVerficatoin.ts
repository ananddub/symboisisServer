import { Request, Response } from "express";
import { getImage } from "../../../../services/ImageSaveRetrive";
import { curSession, sqlQueryStatus } from "../../../../services/sqlfunctoin";
export const phoneVerfication = async (req: Request, res: Response) => {
  try {
    console.log("phoneVerfication called");
    const phone = req.query?.phone;
    const query = `SELECT * FROM tbl_admission where session="${curSession()}" and  active=1 and fmob='${phone}'`;
    const data: {
      status: boolean;
      data: any;
    } = await sqlQueryStatus(query);
    const image: {
      type: string;
      name: string;
      data: string;
    }[] = new Array();
    if (data.status === true)
      for (let value of data.data) {
        try {
          const bimage = getImage(`${value.admno}.jpg`);
          if (bimage === "") throw new Error("image not availabe");
          const obj: {
            type: string;
            name: string;
            data: string;
          } = {
            type: "image/jpg",
            name: `${value.admno}.jpg`,
            data: bimage,
          };
          console.log("sucess");
          image.push(obj);
        } catch (err) {
          const obj = {
            type: "",
            name: "",
            data: "",
          };
          image.push(obj);
        }
      }
    // console.log(data);
    res.status(200).send({ status: data, image: image });
  } catch (err) {
    res.status(400).send({ status: false, image: null });
  }
};
