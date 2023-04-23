import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { error_500 } from "~/constant/error-handle";
import { generateToken } from "~/utilities/generateToken";

import Session from "../session/session.model";
import User from "../user/user.model";

class AuthService {
    async register(input) {
        try {
            const { name, password, email, phone, cardID, address, note, date_of_birth, active } = input;
            if (!name || !password || !email || !cardID) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ... !name ? [{
                            fieldError: "name",
                            message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : [],
                        ... !password ? [{
                            fieldError: "password",
                            message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : [],
                        ...!email ? [{
                            fieldError: "email",
                            message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : [],
                        ...!cardID ? [{
                            fieldError: "cardID",
                            message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : []
                    ]
                };
            }
            const [isEmailExist, isCardIDExist] = await Promise.all([
                await User.findOne({ where: { email } }).exec(),
                ... !cardID ? [await User.findOne({ where: { cardID } }).exec()] : [],
            ]);
            if (isEmailExist || isCardIDExist) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ...isEmailExist ? [{
                            fieldError: "email",
                            message: "Email đã tồn tại trong hệ thống!"
                        }] : [],
                        ...isCardIDExist ? [{
                            fieldError: "cardID",
                            message: "CMT đã tồn tại trong hệ thống!"
                        }] : [],
                    ]
                };
            }
            const hashPassword = bcrypt.hashSync(password, 15);
            const user = new User({
                created_at: Date.now(),
                name,
                email,
                password: hashPassword,
                ...address && { address },
                ...phone && { phone },
                ...cardID && { cardID },
                ...note && { note },
                ...date_of_birth && { date_of_birth },
                active
            });
            const response = await user.save();
            const result = { ...response }._doc;
            delete result.password;
            return {
                code: 200,
                result,
            };
        } catch (error) {
            return error_500();
        }
    }

    async login(input, res) {
        try {
            const { email, password } = input;
            if (!input.email || !input.password) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ... !input.email ? [{
                            fieldError: "input.email",
                            message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : [],
                        ... !input.password ? [{
                            fieldError: "input.password",
                            message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : []
                    ]
                };
            }
            const user = await User.findOne({ email });
            if (user) {
                const isPasswordValid = bcrypt.compareSync(password, user.password);
                if (!isPasswordValid) {
                    return {
                        code: 400,
                        isValidate: true,
                        errors: [
                            ... !password ? [{
                                fieldError: "password",
                                message: "Mật khẩu không chính xác!"
                            }] : []
                        ]
                    };
                }
                const accessToken = generateToken(user, process.env.JWT_ACCESS_KEY, process.env.JWT_EXPIRE);
                const refreshToken = generateToken(user, process.env.JWT_REFRESH_KEY, process.env.JWT_EXPIRE);
                const result = { ...user }._doc;
                const session = new Session({
                    created_at: Date.now(),
                    token: refreshToken,
                    userId: user.id,
                });
                await session.save();
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                });
                delete result.password;
                return {
                    code: 200,
                    result: {
                        ...result,
                        accessToken,
                    },
                };
            }
            return {
                code: 400,
                message: "Email đăng nhập không tồn tại!",
                type: "email"
            };
        } catch (error) {
            return error_500();
        }
    }

    async logout(req, res) {
        try {
            const token = req.cookies?.refreshToken;
            if (token) {
                res.clearCookie("refreshToken");
                await Session.findOneAndRemove({ token });
            }
            return {
                code: 200,
                message: "Đã đăng xuất!",
            };
        } catch (error) {
            return error_500();
        }
    }

    async refreshToken(req, res) {
        try {
            const token = req.cookies?.refreshToken;
            if (!token) {
                return {
                    code: 401,
                    isValidate: true,
                    errors: [
                        ... !token ? [{
                            fieldError: "token",
                            message: "Bạn chưa được xác thực!"
                        }] : []
                    ]
                };
            }
            const refreshToken = await Session.findOne({ token });
            if (!refreshToken) {
                return {
                    code: 401,
                    message: "Refresh token không hợp lệ!",
                };
            }
            if (token && refreshToken) {
                const decodedUser = jwt.verify(token, process.env.JWT_REFRESH_KEY);
                await Session.findOneAndRemove({ token });
                const newAccessToken = generateToken(decodedUser, process.env.JWT_ACCESS_KEY, process.env.JWT_EXPIRE);
                const newRefreshToken = generateToken(decodedUser, process.env.JWT_REFRESH_KEY, process.env.JWT_EXPIRE);
                const session = new Session({
                    created_at: Date.now(),
                    token: newRefreshToken,
                    userId: decodedUser.id,
                });
                await session.save();
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                });
                return {
                    code: 200,
                    result: {
                        accessToken: newAccessToken
                    }
                };
            }
            return {
                code: 400,
                message: "Bạn chưa được xác thực hoặc refresh token không hợp lệ!",
            };
        } catch (error) {
            return error_500();
        }
    }

}

export default new AuthService();