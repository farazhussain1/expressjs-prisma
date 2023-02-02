import { object } from "joi";
import mongoose, { model } from "mongoose";

export const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        profile: {
            number: {
                type: String,
            },
            image: {
                type: String,
            },
            address: {
                country: {
                    type: String,
                    required: true,
                },
                city: {
                    type: String,
                },
                province: {
                    type: String,
                },
                district: {
                    type: String,
                },
            },
        },
    },
    { timestamps: true }
);

export const USER = model("user", userSchema);


