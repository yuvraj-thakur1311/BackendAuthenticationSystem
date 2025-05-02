
const jwt = require("jsonwebtoken");
const client = require("../Blacklist");

exports.isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized User Access..",
        });
    }

    const isBlacklisted = await client.get(token);
    if (isBlacklisted) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized User Access with blacklisted token..",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token expired..",
        });
    }
};
