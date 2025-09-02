import express from 'express';
import {
    postStudentController,
    getStudentController,
    updateStudentController,
    deleteStudentController
} from '../controllers/studentController.js';

const studentRoutes = express.Router();

studentRoutes.post("/students", postStudentController);
studentRoutes.get("/students", getStudentController);
studentRoutes.put("/students/:id", updateStudentController);
studentRoutes.delete("/students/:id", deleteStudentController);

export default studentRoutes;