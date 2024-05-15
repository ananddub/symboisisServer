const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/");
  },
  filename: async (req: Request, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});
export const multerImageupload = multer({ storage: storage });

const documents = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "Document/");
  },
  filename: async (req: Request, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

export const multerDocumentupload = multer({ storage: documents });
