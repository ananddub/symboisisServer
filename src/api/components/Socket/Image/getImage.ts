import { Socket } from "socket.io";
import { sqlQuerys } from "../../../../services/sqlfunctoin";
import { getEmpImage } from "../../../../services/ImageSaveRetrive";
export const getEmpImageDetail = async (socket: Socket) => {
  const query =
    "select empid,name,mob,fname,gender,designation,town from tbl_employeesetting Where active=1 ORDER BY name";
  const data: any = await sqlQuerys(query);
  for (let x of data) {
    x.imagepath = getEmpImage(`${x.empid}.jpg`);
  }
  socket.emit("getEmpImage", data);
};
