import nextConnect from "next-connect";
// import multipartFormParser from "./multipart-form-parser";
import multer from "multer";

// Returns a Multer instance that provides several methods for generating
// middleware that process files uploaded in multipart/form-data format.
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/tmp",
    filename: (req, file, cb) => {
      const ext = file.originalname.split(".");
      let name = req.query.user ? `avatar-${req.query.user}` : `avatar`;
      name = `${name}.${ext[ext.length - 1]}`;
      return cb(null, name);
    },
  }),
});

const middleware = nextConnect();

// Returns middleware that processes multiple files sharing the same field name.
const uploadMiddleware = upload.single("files");

// Adds the middleware to Next-Connect
middleware.use(uploadMiddleware);

// middleware.use(multipartFormParser);

export default middleware;
