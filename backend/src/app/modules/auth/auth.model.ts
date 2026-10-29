import { Schema, model } from 'mongoose'
import { IUser } from './auth.interface'

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['super_admin', 'admin'],
            default: 'admin'
        }
    },
    {
        timestamps: true
    }
)

export const User = model<IUser>('User', userSchema)