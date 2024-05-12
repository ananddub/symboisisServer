import { Request, Response } from "express";
import { curSession, sqlQueryUpdate } from "../../../../services/sqlfunctoin";
export const imageUpload = async (req: Request, res: Response) => {
  try {
    const { admno, imagename } = req.body;
    console.log("uploaded sucess fully ", req.body);
    res.status(200).send({ status: "success" });
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};
export const profileUpdate = async (req: Request, res: Response) => {
  try {
    const { admno, imagename, name, fname, mname, pdist } = req.body;
    const update = `UPDATE tbl_admission SET 
                    name  = '${name}',
                    fname = '${fname}',
                    mname = '${mname}', 
                    pdist = '${pdist}'
                    WHERE admno = '${admno}' AND active = 1 AND session = '${curSession()}';`;

    const data = await sqlQueryUpdate(update);
    console.clear();
    console.log([name, fname, mname, pdist, admno]);
    // console.log("parsed data:", data);
    console.log("updated sucess fully ", data, imagename, typeof imagename);
    res.status(200).send(data);
  } catch (err: any) {
    res.status(400).send(err.message);
  }
};
