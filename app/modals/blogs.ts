import {Schema, model, models} from 'mongoose';

const BlogSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        

    }
)