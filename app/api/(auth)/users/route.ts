import User from "@/app/modals/user";
import connect from "../../../lib/db";
import mongoose from "mongoose";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await connect();
        }
        await connect();
        const users = await User.find();
        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({ message: "Failed to fetch data", error: error.message }),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify({ message: "An unknown error occurred" }),
            { status: 500 }
        );
    }
};

export const POST = async (request: Request) => {
    try {
        if (mongoose.connection.readyState === 0) {
            await connect();
        }
        const { name, email, password } = await request.json();
        const user = new User({ 
            name: name || "Default Name", 
            email: email || "default@example.com", 
            password: password || "defaultpassword" 
        });
        await user.save();
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({ message: "Failed to create user", error: error.message }),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify({ message: "An unknown error occurred" }),
            { status: 500 }
        );
    }
};

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const {userId, newUsername} = body;

        await connect();
        if(!userId || !newUsername) {
            return new Response(JSON.stringify({ message: "userId and new Username are required" }), { status: 400 });
        }
        if(!Types.ObjectId.isValid(userId)) {
            return new Response(JSON.stringify({ message: "Invalid userId" }), { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { name: newUsername },
            { new: true }
        )

        if (!updatedUser) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(updatedUser), { status: 200 });
    }catch(error:any){
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({ message: "Failed to update user", error: error.message }),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify({ message: "An unknown error occurred" }),
            { status: 500 }
        );
    }

   
}

export const DELETE = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId } = body;

        await connect();
        if(!userId) {
            return new Response(JSON.stringify({ message: "userId is required" }), { status: 400 });
        }
        if(!Types.ObjectId.isValid(userId)) {
            return new Response(JSON.stringify({ message: "Invalid userId" }), { status: 400 });
        }

        const deletedUser = await User.findOneAndDelete({ _id: new ObjectId(userId) });

        if (!deletedUser) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(deletedUser), { status: 200 });
    }catch(error:any){
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({ message: "Failed to delete user", error: error.message }),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify({ message: "An unknown error occurred" }),
            { status: 500 }
        );
    }
}