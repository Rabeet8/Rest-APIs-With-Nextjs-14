import User from "@/app/modals/user";
import connect from "../../../lib/db";
import mongoose, { Types } from "mongoose";
import Category from "@/app/modals/category";
import Blog from "@/app/modals/blogs";

export const GET = async (request: Request) => {
    try{
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
    
        const categoryId = searchParams.get("categoryId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new Response(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new Response(
                JSON.stringify({ message: "Invalid category ID" }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if(!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }
        const category = await Category.findById(categoryId);
        if(!category) {
            return new Response(
                JSON.stringify({ message: "Category not found" }),
                { status: 404 }
            );
        }

        const filter: any = { user: new Types.ObjectId(userId), category: new Types.ObjectId(categoryId) };

        const blogs = await Blog.find(filter);

        return new Response(JSON.stringify(blogs), { status: 200 });

    } catch(error:any){
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

    try{
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const categoryId = searchParams.get("categoryId");

        if(!userId || !Types.ObjectId.isValid(userId)) {
            return new Response(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 }
            );
        }
        if(!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new Response(
                JSON.stringify({ message: "Invalid category ID" }),
                { status: 400 }
            );
        }

        await connect();

        const user = await User.findById(userId);
        if(!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }
        const category = await Category.findById(categoryId);
        if(!category) {
            return new Response(
                JSON.stringify({ message: "Category not found" }),
                { status: 404 }
            );
        }
        const { title, description } = await request.json();

        const newBlog = await Blog.create({
            title,
            description,
            user: new Types.ObjectId(userId),
            category: new Types.ObjectId(categoryId),
        });

        await newBlog.save();
        return new Response(JSON.stringify(newBlog), { status: 201 });

    }catch(error:any){
        return new Response(
            JSON.stringify({ message: "Failed to create blog", error: error.message }),
            { status: 500 }
        );
    }


}