import { Socket } from "socket.io";
import {
  curSession,
  sqlQueryStatus,
} from "../../../../../services/sqlfunctoin";
import { getImage } from "../../../../../services/ImageSaveRetrive";

export const getImagewithDetail = async (
  socket: Socket,
  response: { class: string }
) => {
  try {
    const query = `SELECT admno,name,class,section,roll,fname,ptown,fmob,imagepath FROM tbl_admission WHERE class='${
      response.class
    }' AND session='${curSession()}' AND active=1  ORDER BY roll  ASC;`;
    const data: any = (await sqlQueryStatus(query)).data;
    const image = [];
    for (let x of data) {
      x.imagepath = getImage(`${x.admno}.jpg`);
      image.push(x);
    }
    socket.emit("getImage", image);
  } catch (err) {
    socket.emit("getImage", []);
  }
};

export const getStdRegDetail = async (
  socket: Socket,
  response: { class: string; sec: string; fmob: string; wmob: string }
) => {
  try {
    console.log(response);
    if (response.class === "" || response.class === undefined) {
      socket.emit("getStdRegDetail", []);
      return null;
    }
    const clas =
      response.class !== "" && response.class !== undefined
        ? `class="${response.class}"`
        : "";
    const sec =
      response.sec !== "" && response.sec !== undefined
        ? `and section="${response.sec}"`
        : "";
    const fmob =
      response.fmob !== "" && response.fmob !== undefined
        ? `and fmob="${response.fmob}"`
        : "";
    const wmob =
      response.wmob !== "" && response.fmob !== undefined
        ? `and whatsapp="${response.wmob}"`
        : "";
    const query = `SELECT admno,name,class,section,roll,fname,ptown,fmob,whatsapp FROM tbl_admission where ${clas} ${sec} ${fmob} ${wmob} and session="${curSession()}" and active=1  ORDER BY roll `;
    console.log([clas, sec, fmob, wmob]);
    const data: any = (await sqlQueryStatus(query)).data;
    socket.emit("getStdRegDetail", data === false ? [] : data);
    console.log("");
  } catch {
    socket.emit("getStdRegDetail", []);
  }
};
