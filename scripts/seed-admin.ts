import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../src/models/admin";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI as string);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD is not defined in .env.local");
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "Super Admin",
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();