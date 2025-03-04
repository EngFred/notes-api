
import User from "../models/user.js"
import cloudinary from "../config/cloudinary.js";
import Note from '../models/note.js';
import mongoose from "mongoose";

export const updateUser = async (req, res) => {

    const { username, bio } = req.body;

    try {

        if( !req.body ) {
            return res.status(400).json({ error: "Provide some field for update!" });
        }
        
        // Find the user by ID
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }


        let profilePicture = user.profilePicture;

        if (req.file) {
            try {
                // Upload to Cloudinary using upload_stream
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "profile_pictures", resource_type: 'image' },
                        async (error, result) => {
                            if (error) {
                                console.error("Cloudinary upload error:", error);
                                return res.status(500).json({ error: "Error uploading profile picture!" });
                            }
        
                            profilePicture = result.secure_url; 
        
                            // Now create user and send response
                            await updateUserAndRespond(res, username, profilePicture, bio, user);
                        }
                    );
        
                uploadStream.end(req.file.buffer);
                return; // Prevent duplicate responses
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                return res.status(500).json({ error: "Error uploading profile picture." });
            }
        } else {
            // If no image is uploaded, create user immediately
            await updateUserAndRespond(res, username, profilePicture, bio, user);
        }

    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Error updating user!" });
    }

}

async function updateUserAndRespond(res, username, profilePicture, bio, user) {
    try{
        
        user.username = username ?? user.username;
        user.profilePicture = profilePicture
        user.bio = bio ?? user.bio

        const updatedUser = await user.save()

        res.status(201).json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            bio: updatedUser.bio,
        });
    } catch (error){
        console.error("User update error error:", error);
        res.status(500).json({error: "Error updating user."})
    }
}

//delete user
export const deleteUser = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find the user by ID
        const user = await User.findById(req.user._id).session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ error: "User not found!" });
        }

        // Delete all notes associated with the user
        await Note.deleteMany({ userId: req.user._id }).session(session);

        // Delete the user
        await User.findByIdAndDelete(req.user._id).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.status(200).json({ message: "User account and all associated notes deleted successfully!" });
    } catch (error) {
        console.error("Error deleting user account:", error);
        await session.abortTransaction();
        res.status(500).json({ error: "Error deleting user account!" });
    } finally {
        session.endSession();
    }
};

// Get user profile information
export const getUserProfile = async (req, res) => {
    try {

        const user = req.user;

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            joinDate: user.joinDate,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Error fetching user profile!" });
    }
};
