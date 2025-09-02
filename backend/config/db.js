import { MongoClient } from "mongodb";

const URL = "mongodb+srv://mazharbalouch00:OipHqRvmN509vScn@crud.oa6ebhe.mongodb.net/?retryWrites=true&w=majority&appName=crud";

const client = new MongoClient(URL);

const mydatabase = "mydatabase";
let db;

export const connectDB = async () => {
    try {
        await client.connect();
        db = client.db(mydatabase);
        console.log(`Database connected successfully`);
    } catch (error) {
        console.log("error", error);
    }

}

export const dbInstance = () => {
    if (!db) {throw new Error("First connect db");}
    return db;
};