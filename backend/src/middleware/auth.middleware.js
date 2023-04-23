import jwt from "jsonwebtoken";

import { error_500 } from "~/constant/error-handle";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (error, decodedUser) => {
                if (error) {
                    return res.status(401).json({
                        message: "Token không hợp lệ!",
                    });
                }
                req.decodedUser = decodedUser;
                next();
            });
        } else {
            return res.status(401).json({
                message: "Bạn chưa được xác thực!",
            });
        }
    } catch (error) {
        return error_500();
    }
};