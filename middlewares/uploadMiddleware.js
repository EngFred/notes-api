import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Multer storage
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload images only.'), false);
    }
};

const upload = multer(
    {
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }
    }
).single("profilePicture");

export default upload