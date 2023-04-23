import jwt from "jsonwebtoken";

export const generateToken = (user, keyToken, expiresIn) => jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
    },
        keyToken,
        { expiresIn }
    );