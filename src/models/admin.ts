import { Schema, model, models } from "mongoose";

const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Super Admin"],
        default: "Super Admin"
    }
}, { timestamps: true })

const Admin = models.Admin || model("Admin", adminSchema);
export default Admin;