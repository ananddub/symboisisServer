import { Socket } from "socket.io";
import { dbActive } from "../../../services/socketFun";
import { getImagewithDetail, getStdRegDetail } from "./Notice/Admin/stddetail";
import { adminSendchat, getAdminChat } from "./Notice/Admin/Notice";
import { getChat, getLength, seen } from "./Notice/Notice";
import { rejister } from "./Notice/register";
import { getEmpImageDetail } from "./Image/getImage";
export const socketRoutes = (socket: Socket) => {
  console.log("A user connected");
  socket.on(
    "register",
    (response: { admno: string; class: string; sec: string }) => {
      rejister(socket, response);
    }
  );

  socket.on(
    "seen",
    (response: {
      admno: string;
      name: string;
      message: string;
      messageid: string;
    }): void => {
      seen(socket, response);
    }
  );

  socket.on(
    "getchat",
    async (response: {
      admno: string;
      class: string;
      sec: string;
    }): Promise<void> => {
      await getChat(socket, response);
    }
  );
  socket.on(
    "getAdminChat",
    async (response: { admin: string; pass: string }) => {
      await getAdminChat(socket, response);
    }
  );

  socket.on(
    "getlength",
    async (response: {
      admno: string;
      class: string;
      sec: string;
    }): Promise<void> => {
      await getLength(socket, response);
    }
  );
  // {message: string,to: string[],from:string,class:string,sec:string }
  socket.on("admin", async (response: any): Promise<void> => {
    adminSendchat(socket, response);
  });
  socket.on("getImage", async (response: { class: string }) => {
    getImagewithDetail(socket, response);
  });

  socket.on(
    "getStdRegDetail",
    async (response: {
      class: string;
      sec: string;
      fmob: string;
      wmob: string;
    }) => {
      getStdRegDetail(socket, response);
    }
  );
  socket.on("getEmpImage", async () => {
    getEmpImageDetail(socket);
  });
  socket.on("disconnect", (): void => {
    for (let i = 0; i < dbActive.length; i++) {
      if (dbActive[i].socketid == socket.id) {
        dbActive.splice(i, 1);
      }
    }
    console.log("A user disconnected", dbActive);
  });
};
