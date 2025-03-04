import bcrypt from "bcrypt"
import User from "../models/user.js";
import generateToken from "../utils/generateTokens.js";
import cloudinary from "../config/cloudinary.js";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (req, res) => {
  try {
      const { username, email, password, bio } = req.body;

      // Validation Checks
      if (!username || username.trim().length === 0) {
          return res.status(400).json({ error: "Username is required!" });
      }
      if (!email || !emailRegex.test(email)) {
          return res.status(400).json({ error: "Invalid email format!" });
      }
      if (!password || password.length < 8) {
          return res.status(400).json({ error: "Password must be at least 8 characters long!" });
      }

      // Check if email already exists
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ error: "Email already used!" });

      let profilePicture = ""; // Default empty string

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

                      profilePicture = result.secure_url; // Get Cloudinary URL

                      // Now create user and send response
                      await createUserAndRespond(res, username, email, password, profilePicture, bio);
                  }
              );

              uploadStream.end(req.file.buffer);
              return; // Prevent duplicate responses
          } catch (cloudinaryError) {
              console.error("Cloudinary upload error:", cloudinaryError);
              return res.status(500).json({ error: "Error uploading profile picture." });
          }
      }

      // If no image is uploaded, create user immediately
      await createUserAndRespond(res, username, email, password, profilePicture, bio);
  } catch (error) {
      console.error("Register user error:", error);
      res.status(500).json({ error: "Error registering user!" });
  }
};

async function createUserAndRespond(res, username, email, password, profilePicture, bio) {
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, profilePicture, bio });

        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            token: generateToken(user._id)
        });
    } catch (error){
        console.error("User creation error:", error);
        res.status(500).json({error: "Error creating user."})
    }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    // Normalize email to prevent case sensitivity issues
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return user data
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};
