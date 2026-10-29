import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "./auth.model";
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

export const registerUser = async (req: Request, res: Response) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Please enter mandatory fields" });
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: "User already exists!" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const accessToken = generateAccessToken({
            userId: user._id,
            role: user.role
        })

        const refreshToken = generateRefreshToken({
            userId: user._id,
            role: user.role
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: "User signed up successfully",
            data: user,
            accessToken,
            refreshToken
        })

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });

    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "User not found!"
            })
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "Incorrect password! Try again ..."
            })
            return;
        }

        const accessToken = generateAccessToken({
            userId: user._id,
            role: user.role
        })

        const refreshToken = generateRefreshToken({
            userId: user._id,
            role: user.role
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            message: "Login successfull",
            data: user,
            accessToken,
            refreshToken
        })

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
        });
    }
}

export const logout = async (
    req: Request,
    res: Response
) => {
    try {

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })

    } catch (error) {
        const err = error as Error

        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        })
    }
}

export const refreshAccessToken = async (
    req: Request,
    res: Response
) => {
    try {

        //access refreshToken from cookies
        const refreshToken =
            req.cookies.refreshToken

        //check & validate if refresh tokens exists
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token missing'
            })
        }

        //verify and decode the refreshToken using refresh secret key
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET as string
        ) as jwt.JwtPayload

        //assign/store the decoded refresh token payload to a variable
        const payload = {
            userId: decoded.userId,
            role: decoded.role
        }

        //create a new access token every 15 minute
        const newAccessToken =
            generateAccessToken(payload)

        //store the new/fresh access token in cookies
        res.cookie(
            'accessToken',
            newAccessToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000
            }
        )

        return res.status(200).json({
            success: true,
            message: 'Access token refreshed'
        })

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        })
    }
}

export const verifyUser = async (req: Request, res: Response): Promise<any> => {

    try {

        return res.status(200).json({
            success: true,
            message: "User verified successfully",
            user: req.user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to verify user"
        });

    }
};