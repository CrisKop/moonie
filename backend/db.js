import mongoose from 'mongoose';

export const connectDB = async () => {
   try {
    await mongoose.connect("mongodb+srv://cluster0-mjsvu.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true, user: "CrisKop", pass: "Nosequeponer123!", dbName: 'realtimechat'})
    console.log(">>> Db connected")
   } catch (error) {
    console.log(error);
   }
}