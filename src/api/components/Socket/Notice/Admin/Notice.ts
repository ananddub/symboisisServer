import { Socket } from "socket.io";
import { dbActive } from "../../../../../services/socketFun";
import { io } from "../../../../server";
import { sqlQuery, sqlQueryUpdate } from "../../../../../services/sqlfunctoin";

export const getAdminChat = async (
  socket: Socket,
  response: { admin: string; pass: string }
) => {
  const query = "SELECT  *  FROM tbl_adminannounce ORDER BY messageid DESC";
  const data: any = await sqlQuery(query);
  console.log(data);
  socket.emit("getAdminChat", { data: data.data });
};
export const adminSendchat = async (
  socket: Socket,
  response: any
): Promise<void> => {
  console.log("repsponse :", response);
  if (Array.isArray(response.to) === true && response.to[0] !== "all") {
    let i = 0;
    for (let admno of response.to) {
      const insert = `INSERT INTO tbl_adminannounce (message,\`from\`, \`to\`,name,fname,mclass,msec,mroll) 
            VALUES ('${response.message}','${response.from}','${admno}','${response.name[i]}','${response.fname[i]}','${response.mclass[i]}','${response.msec[i]}','${response.mroll[i]}');`;
      await sqlQueryUpdate(insert);
      i += 1;
    }
    for (let i = 0; i < response.to.length; i++) {
      for (let j = 0; j < dbActive.length; j++) {
        if (dbActive[j].admno === response.to[i]) {
          console.log(j, "passed ", dbActive[j]);
          io.to(dbActive[j].socketid).emit("notice", response.message);
          io.emit("getAdminStatus");
        }
      }
    }
  } else if (response.class !== "") {
    console.log("we entered");
    const insert = `INSERT INTO tbl_adminannounce (message,\`from\`,\`to\`,class,sec) 
                  VALUES ('${response.message}','${response.from}','${response.class}','${response.class}','${response.sec}');`;
    console.log("status :", await sqlQueryUpdate(insert));
    io.emit("notice", "check message");
    io.emit("getAdminStatus");
  } else if (response.to[0] === "all") {
    console.log("emited :", response.message);
    io.emit("notice", { message: response.message });
    io.emit("getAdminStatus");
  }
  socket.disconnect();
};
