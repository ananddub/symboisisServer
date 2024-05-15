import { getImage } from "../../../../services/ImageSaveRetrive";
import { curSession, sqlQueryStatus } from "../../../../services/sqlfunctoin";
const path = require("path");
const fs = require("fs");
export const basicDetail = async (req: any, res: any) => {
  try {
    const admno = req.query?.admno;
    console.log("admno numer :", admno);
    const query = `SELECT * FROM tbl_admission where session="${curSession()}" and admno="${admno}" and active=1; `;
    const data: any = await sqlQueryStatus(query);
    console.log("basic details :", data);
    try {
      res.contentType("multipart/mixed");
      res.status(200).send({ status: data, image: getImage(`${admno}.jpg`) });
    } catch (err) {
      res.status(200).send({ status: data, image: null });
    }
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};

console.log("done");
