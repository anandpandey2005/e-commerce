import mongoose from "mongoose";
import {
  User,
  Order,
  Coupon,
  Notification,
  Product,
  Category,
  Cart,
} from "../models/index.model.js";

const databaseConnection = async () => {
  try {
    const connectionUri = `${process.env.DATABASE_URI}${process.env.DATABASE_NAME}`;

    await mongoose.connect(connectionUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export { databaseConnection };
