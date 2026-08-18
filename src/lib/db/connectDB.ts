import mongoose from "mongoose";

const raw_uri = process.env.MONGODB_URI;

if (!raw_uri) {
    throw new Error("Please provide mongodb uri");
}

// Clean trailing slash from db name (e.g. mongodb://.../vysh/ -> mongodb://.../vysh)
const mongodb_uri = raw_uri.trim().replace(/\/+(\?|$)/, "$1");

export const connectDB = async () => {
    try {
        await mongoose.connect(mongodb_uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(error);
    }
}