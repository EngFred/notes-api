import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DB_CONNECTION_STRING)
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDb;