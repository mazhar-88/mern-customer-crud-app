import { MongoClient } from "mongodb";

const URL = "mongodb+srv://mazharbalouch00:OipHqRvmN509vScn@cluster0.oa6ebhe.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(URL);
let db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(); // default mydatabase from URL
    console.log(`Database connected successfully`);
  } catch (error) {
    console.log("error", error);
  }
};

export const dbInstance = () => {
  if (!db) {
    throw new Error("First connect db");
  }
  return db;
};
