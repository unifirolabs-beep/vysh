"use server"

import { cookies } from "next/headers";
import { connectDB } from "@/lib/db/connectDB";
import bcrypt from "bcryptjs";
import Admin from "@/models/admin";

export async function loginAdmin (email: string, password: string) {

   try {
      const db = await connectDB();
      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin) {
         return { success: false, message: "Admin not found" };
      }
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
         return { success: false, message: "Invalid password" };
      }
      const cookieStore = await cookies();

    cookieStore.set("vysh_auth_token", crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });

    cookieStore.set("vysh_user_role", admin.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return {
      success: true,
      user: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  } catch (error) {
    console.error("Admin login error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();

  cookieStore.delete("vysh_auth_token");
  cookieStore.delete("vysh_user_role");

  return {
    success: true,
  };
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();

  const authToken = cookieStore.get("vysh_auth_token")?.value;

  if (!authToken) {
    return null;
  }

  // For your current MVP, retrieve the admin.
  await connectDB();

  const admin = await Admin.findOne({
    role: "Super Admin",
  }).select("_id name email role");

  if (!admin) {
    return null;
  }

  return {
    id: admin._id.toString(),
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
}