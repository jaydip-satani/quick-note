import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    verified: boolean;
    otp: number;
    profilePhoto: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    otp: { type: Number, required: true, default: 0 },
    profilePhoto: { type: String, default: '' },
}, {
    timestamps: true
}
);
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);