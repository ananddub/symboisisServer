const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/std");
  },
  filename: async (req: Request, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const empstorage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/emp");
  },
  filename: async (req: Request, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const documents = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "Document/");
  },
  filename: async (req: Request, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

export const multerDocumentupload = multer({ storage: documents });

export const multerImageupload = multer({ storage: storage });
export const multerEmpimageupload = multer({ storage: empstorage });
