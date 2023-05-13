import mongoose from 'mongoose'
import config from 'config'
import {UserDocument} from "./user.model";

export interface SessionInput {
    user: UserDocument['_id'];
    valid: boolean;
    userAgent: string;
}

export interface SessionDocument extends SessionInput, mongoose.Document {
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId,ref:'User'},
        valid:{type: Boolean,default: true},
        userAgent:{type: String},
    },
    {
        timestamps: true,
    }
);


const SessionModel = mongoose.model("Session",sessionSchema)

export default SessionModel