import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    // Configure Mongoose to handle `strictQuery` setting explicitly
    mongoose.set('strictQuery', false); // Use false if you want to allow non-schema fields

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,      // Recommended for parsing MongoDB connection string
      useUnifiedTopology: true,  // Recommended for handling MongoDB's new connection management engine
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.underline.green);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
