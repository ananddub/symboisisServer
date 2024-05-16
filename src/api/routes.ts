import { phoneVerfication } from "./components/HTTPSERVER/auth/phoneVerficatoin";
import {
  imageUpload,
  profileUpdate,
} from "./components/HTTPSERVER/image/imageupload";
import { paymentDetails } from "./components/HTTPSERVER/payment/paymentDetail";
import { dueslist } from "./components/HTTPSERVER/user/dues";
import { searchStd } from "./components/HTTPSERVER/user/finduser";
import { getTotalPhoto } from "./components/HTTPSERVER/user/totalphoto";
import { basicDetail } from "./components/HTTPSERVER/user/userDetail";
import { socketRoutes } from "./components/Socket/routes";
import {
  multerEmpimageupload,
  multerImageupload,
} from "./middleware/multerImageupload";
import { multerDocumentupload } from "./middleware/multerImageupload";
import { app, io } from "./server";
const path = require("path");

app.put("/imageupload", multerImageupload.single("image"), imageUpload);
app.post("/empimageupload", multerEmpimageupload.single("image"), imageUpload);

app.put("/profileupdate", multerImageupload.single("image"), profileUpdate);
app.get("/phoneVerfication", phoneVerfication);
app.get("/paymentDetails", paymentDetails);
app.get("/BasicDetails", basicDetail);
app.get("/searchstd", searchStd);
app.get("/dues", dueslist);
app.get("/totalphoto", getTotalPhoto);
app.post(
  "/documents",
  multerDocumentupload.single("document"),
  (req: any, res: any) => {
    console.log("called", req.param);
    console.log("saved : ", req.file);
    res.status(200).send("success");
  }
);
app.get("/", (req: any, res: any) => {
  res.sendFile("../../dist/index.html");
});

io.on("connection", socketRoutes);

export const server = () => {
  console.log("server started");
};
