import { getImage } from "../../../../services/ImageSaveRetrive";
import { curSession, sqlQuery } from "../../../../services/sqlfunctoin";

const path = require("path");
const fs = require("fs");
async function details(admno: string, session: string) {
  const [
    admission,
    transportFee,
    stdTransDetail,
    hostelFee,
    stdFeeMaster,
    monthFee,
    stdMonthFeeDetail,
  ]: any = await Promise.all([
    sqlQuery(
      `select * from tbl_admission where admno='${admno}' AND session= '${session}' AND active=1;`
    ),
    sqlQuery(
      `select * from tbl_transportfee where admno='${admno}' AND session= '${session}';`
    ),
    sqlQuery(`select * from tbl_stdtransdetail WHERE admno='${admno}';`),
    sqlQuery(
      `select * from tbl_hostelfee WHERE admno='${admno}' AND session= '${session}';`
    ),
    sqlQuery(
      `select * from tbl_stdfeemaster where admno='${admno}' AND session= '${session}'`
    ),
    sqlQuery(
      `select * from tbl_monthfee where admno='${admno}' AND session= '${session}' `
    ),
    sqlQuery(
      `SELECT * FROM tbl_stdmonthfeedetail WHERE admno = "${admno}" ORDER BY pdate DESC`
    ),
  ]);
  const [latefinedate, examfee, miscfee, monthlyfeesetup]: any =
    await Promise.all([
      sqlQuery(`SELECT * FROM tbl_latefinedate;`),
      sqlQuery(
        `SELECT * FROM tbl_examfee WHERE class="${admission[0].class}";`
      ),
      sqlQuery(
        `SELECT * FROM tbl_miscfee WHERE class="${admission[0].class}";`
      ),
      sqlQuery(
        `SELECT * FROM tbl_monthlyfeesetup WHERE class="${admission[0].class}";`
      ),
    ]);
  console.log(examfee, miscfee, stdTransDetail);
  const objects = {
    tbl_admission: admission[0],
    tbl_transfee: transportFee[0],
    tbl_stdtransdetail: stdTransDetail[0],
    tbl_hostelfee: hostelFee[0],
    tbl_monthfee: monthFee[0],
    tbl_stdmonthfeedetail: stdMonthFeeDetail[0],
    tbl_latefinedate: latefinedate[0],
    tbl_examfee: examfee[0],
    tbl_miscfee: miscfee[0],
    tbl_stdfeemaster: stdFeeMaster[0],
    tbl_monthlyfeesetup: monthlyfeesetup[0],
  };
  return objects;
}

export const paymentDetails = async (req: any, res: any) => {
  try {
    const admno = req.query?.admno;
    const data = await details(`${admno}`, `${curSession()}`);
    try {
      const image = getImage(`${admno}.jpg`);
      res.contentType("content/json");
      res
        .status(200)
        .send({ status: true, data: data, image: image === "" ? null : image });
    } catch (err) {
      res.status(200).send({ status: data, data: data, image: null });
    }
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};
