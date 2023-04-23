import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		mongoose.set("strictQuery", false);
		await mongoose.connect(process.env.MONGO_URI);
		// eslint-disable-next-line no-console
		console.log("MongoDB connected!");
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error.message);
		process.exit(1);
	}
};