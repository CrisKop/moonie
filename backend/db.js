import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const {user, pass} = process.env

export const connectDB = async () => {
   try {
    await mongoose.connect("mongodb+srv://cluster0-mjsvu.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true, user, pass, dbName: 'realtimechat'})
    console.log(">>> Db connected")
   } catch (error) {
    console.log(error);
   }
}
