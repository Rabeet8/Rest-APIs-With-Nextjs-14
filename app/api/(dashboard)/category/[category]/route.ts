import User from "@/app/modals/user";
import connect from "../../../../lib/db";
import mongoose, { Types } from "mongoose";
import Category from "@/app/modals/category";

export const PATCH = async (request: Request, context: {params: any}) =>{
    const categoryId = context.params.category;
    try{
        const body = await request.json();
        const {title} = body;

        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId || !mongoose.isValidObjectId(userId)){
            return new Response("Invalid User ID", { status: 400 });
        }
        if(!categoryId || !mongoose.isValidObjectId(categoryId)){
            return new Response("Invalid Category ID", { status: 400 });
        }
        await connect();
        const user = await User.findById(userId);
        if(!user){
            return new Response("User not found", { status: 404 });
        }
        const category = await Category.findOne({_id: categoryId, userId: userId});

        if(!category){
            return new Response("Category not found", { status: 404 });
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {title: title}, {new: true});

        return new Response(JSON.stringify(updatedCategory), { status: 200 });

    }catch(err:any){
        console.log(err);
        return new Response("Error in updating category" + err.message, { status: 500 });
    }
}

export const DELETE = async (request: Request, context: {params: any}) =>{      
const categoryId = context.params.category;
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId || !mongoose.isValidObjectId(userId)){
            return new Response("Invalid User ID", { status: 400 });
        }
        if(!categoryId || !mongoose.isValidObjectId(categoryId)){
            return new Response("Invalid Category ID", { status: 400 });
        }
        await connect();
        const user = await User.findById(userId);
        if(!user){
            return new Response("User not found", { status: 404 });
        }
        const category = await Category.findOne({_id: categoryId, userId: userId});

        if(!category){
            return new Response("Category not found", { status: 404 });
        }

        await Category.findByIdAndDelete(categoryId);

        return new Response("Category deleted successfully", { status: 200 });
    }catch(err: any){
        return new Response("Error in deleting category" + err.message, { status: 500 });
    }
}