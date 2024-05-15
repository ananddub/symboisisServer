import { Socket } from "socket.io";
import {
  sqlQueryStatus,
  sqlQueryUpdate,
} from "../../../../services/sqlfunctoin";

export const seen = (
  socket: Socket,
  response: {
    admno: string;
    name: string;
    message: string;
    messageid: string;
  }
): void => {
  const insert = `INSERT INTO tbl_stdannounce (admno,name,messaged,messageid) 
                VALUES ('${response.admno}','${response.name}','${response.message}','${response.messageid}');`;
  sqlQueryUpdate(insert);
};

export const getChat = async (
  socket: Socket,
  response: {
    admno: string;
    class: string;
    sec: string;
  }
): Promise<void> => {
  const admno = `SELECT  a.messageid, a.message, a.to, a.from, a.date , a.time  FROM tbl_adminannounce a
            LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid
            WHERE (a.to = '${response.admno}' OR a.to = 'all' or a.class='${response.class}' 
                            AND (a.sec='all' or a.sec='${response.sec}')) ORDER BY a.messageid DESC;`;

  const usersel = `SELECT  a.messageid, a.message, a.to, a.from, a.date , a.time  FROM tbl_adminannounce a
                    LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid
                    WHERE (a.to = '${response.admno}' OR a.to = 'all' or a.class='${response.class}' 
                    AND (a.sec='all' or a.sec='${response.sec}')) 
                    AND u.messageid IS NULL ORDER BY a.messageid DESC;`;
  try {
    const [seen, unseen] = await Promise.all([
      sqlQueryStatus(admno),
      sqlQueryStatus(usersel),
    ]);
    console.log(seen, unseen);
    socket.emit("getchat", {
      seen: seen.data,
      unseen: unseen.data,
    });
  } catch (err) {
    console.log(err);
    socket.emit("getchat", { seen: null, unseen: null });
  }
};

export const getLength = async (
  socket: Socket,
  response: {
    admno: string;
    class: string;
    sec: string;
  }
): Promise<void> => {
  const usersel = `SELECT  COUNT(a.messageid) as c FROM tbl_adminannounce a
                    LEFT JOIN tbl_stdannounce u ON a.messageid = u.messageid
                    WHERE (a.to = '${response.admno}' OR a.to = 'all' or a.class='${response.class}' AND (a.sec='all' or a.sec='${response.sec}')) 
                    AND u.messageid IS NULL ORDER BY a.messageid DESC;`;
  const [unseen]: any = await Promise.all([sqlQueryStatus(usersel)]);
  console.log("length :", unseen?.data[0]?.c);
  socket.emit("getlength", { unseen: unseen?.data[0]?.c });
};
