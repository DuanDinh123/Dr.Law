import mongoose from "mongoose";

const FundSpendingSchema = new mongoose.Schema({
    funds_id: { type: mongoose.Types.ObjectId, ref: "Fund" },
    spendings_id: { type: mongoose.Types.ObjectId, ref: "Spending" },
});

const FundSpending = mongoose.model("FundsSpending", FundSpendingSchema);
export default FundSpending;