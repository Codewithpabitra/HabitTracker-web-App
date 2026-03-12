import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
// import { sendWelcomeEmail } from "../services/email.service.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";



export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // already hashed the password before saving

    const user = await User.create({
      name,
      email,
      password
    });

    // Send Welcome email
    // await sendWelcomeEmail(email, name);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        name : user.name,
        email : user.email,
        token
      }
    });

  } catch (error) {
    console.error("Error in register user", error);
    // ZOD ERROR
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    next(error);
  }
};



export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "LoggedIn successfully",
      data: {
        name : user.name,
        email : user.email,
        token
      }
    });

  } catch (error) {
    console.error("Error in login user", error);
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    next(error);
  }
};