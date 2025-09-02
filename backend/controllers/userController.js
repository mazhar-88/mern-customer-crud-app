import { MongoClient, ObjectId } from 'mongodb';
import { dbInstance } from "../config/db.js";

const collectionName = "userRoom";

export const registerUser = async (req, res) => {
    let db = dbInstance();
    try {
        const requestObj = {
            email: req.body.email,
            password: req.body.password,
        };

        let result = await db.collection("users").insertOne(requestObj);
        if (result.acknowledged) {
            res.status(201).json({
                message: "User created successfully.",
                id: result.insertedId
            })
        } else {
            res.status(500).json({
                message: "Failed to insert User."
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export const loginUser = async (req, res) => {
    let db = dbInstance();
   try {
           const requestObj = {
               email: "user@gmail.com",
               password: "user12345",
           };
   
           let result = await db.collection("users").find({}).toArray();
           const isLoggedIn = result.some(user => user.email === requestObj.email);
           console.log(isLoggedIn);
   
           if (isLoggedIn) {
               let obj = result.find(user => user.email === requestObj.email);
               // console.log(nnn)
               req.session.userId = obj._id;
               console.log(req.session)
               res.status(200).json({
                   message: "User LoggedIn successfully.",
               })
           } else {
               res.status(500).json({
                   message: "Invalid Credientials"
               })
           }
       } catch (error) {
           console.log(error);
       }

};

export const logoutUser = async (req, res) => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.json({ message: "logged out" });
    res.status(200).json({
        message: "User Logged Out successfully.",
    })
};