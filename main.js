import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import notesRoutes from "./routes/notesRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
const app = express()
const port = process.env.PORT || 8080


//middle ware
app.use(express.urlencoded({extended: true}))
app.use(json())
app.use(cors())

//dbConnection
connectDb()

//routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/user", userRoutes);

//notFound
app.use((req, res) => {
    res.status(404).json({ error: "Not Found!" });
});

app.listen(port, () => {
    console.debug(`Server currently running on port ${port}!!`)
})