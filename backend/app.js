import express from 'express';
import session from 'express-session';
import cors from 'cors';
import multer from "multer";

import customerRoutes from './routes/customerRoutes.js';

export const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "mysecreteakaye",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "images/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.use("/images", express.static("images"));
app.use("/", upload.single("photo"), customerRoutes);