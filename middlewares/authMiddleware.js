import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async ( req, res, next ) => {
    let token;
    if( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(404).json({ error: "User not found!" });
            }
            req.user = user;
            next()
        } catch (error) {
            res.status(401).json({ error: "Not authorized, token failed!"});
        }
    }

    if(!token) {
        res.status(401).json({ error: "Not authorized, no token!" })
    }
}

export default protect