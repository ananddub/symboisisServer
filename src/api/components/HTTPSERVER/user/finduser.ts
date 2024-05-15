import { curSession, sqlQueryStatus } from "../../../../services/sqlfunctoin";

export const searchStd = async (req: any, res: any) => {
  if (req.query.class === "all" || req.query.class === "null") {
    res.status(400).send("Invalid Request");
    return;
  }
  console.log(req.query);
  const clas = req.query.class !== "null" ? `class="${req.query.class}"` : "";
  const sec = req.query.sec !== "null" ? `and section="${req.query.sec}"` : "";
  const roll = req.query.roll !== "null" ? `and roll="${req.query.roll}"` : "";
  const query = `SELECT admno,name,class,roll,fname,section FROM tbl_admission where   ${clas} ${sec} ${roll} and session="${curSession()}" and active=1  ORDER BY roll `;
  const data = await sqlQueryStatus(query);
  if (data.status === true) {
    // await pdfHTML(data.data);
    res.status(200).send(data.data);
  } else {
    res.status(404).send("Invalid Request");
  }
};
