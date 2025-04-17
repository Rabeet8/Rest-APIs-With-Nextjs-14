import User from "@/app/modals/user";
import connect from "../../../lib/db";
import mongoose, { Types } from "mongoose";
import Category from "@/app/modals/category";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new Response(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }

        if (mongoose.connection.readyState === 0) {
            await connect();
        }

        const user = await User.findById(userId);
        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        const categories = await Category.find({ user: new Types.ObjectId(userId) });
        return new Response(JSON.stringify(categories), { status: 200 });

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
}

export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const body = await request.json();
        const { title } = body;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new Response(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }

        if (mongoose.connection.readyState === 0) {
            await connect();
        }

        const user = await User.findById(userId);
        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        if (!title) {
            return new Response(
                JSON.stringify({ message: "Title is required" }),
                { status: 400 }
            );
        }

        const category = new Category({
            title,
            user: new Types.ObjectId(userId)
        });

        await category.save();
        return new Response(JSON.stringify(category), { status: 201 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({ message: "Failed to create category", error: error.message }),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify({ message: "An unknown error occurred" }),
            { status: 500 }
        );
    }
}