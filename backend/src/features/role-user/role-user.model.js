import mongoose from "mongoose";

const RoleUserSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: "User" },
    role_id: { type: mongoose.Types.ObjectId, ref: "Role" },
});
const RoleUser = mongoose.model("RoleUser", RoleUserSchema);
export default RoleUser;