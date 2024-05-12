import { Socket } from "socket.io";
import { dbActive, removeDup } from "../../../../services/socketFun";

export const rejister = (
  socket: Socket,
  response: { admno: string; class: string; sec: string }
) => {
  removeDup(dbActive, response.admno);
  if (response.admno !== undefined) {
    dbActive.push({
      admno: response.admno,
      socketid: socket.id,
      class: response.class,
      sec: response.sec,
    });
  }
  console.log("active user", dbActive);
};
