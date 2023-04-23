import mongoose from "mongoose";

const SpendingGroupSchema = new mongoose.Schema({
    spendings_id: { type: mongoose.Types.ObjectId, ref: "Spending" },
    group_spendings_id: { type: mongoose.Types.ObjectId, ref: "GroupSpending" },
});

const SpendingGroup = mongoose.model("SpendingGroup", SpendingGroupSchema);
export default SpendingGroup;