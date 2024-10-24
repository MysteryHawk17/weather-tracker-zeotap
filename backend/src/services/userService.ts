import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import { Notification } from "../models/Notification";

export class UserService {
  async registerUser(data: {
    name: string;
    email: string;
    password: string;
    location: Schema.Types.ObjectId;
    preferredTemperatureUnit: string;
    thresholds: {
      maxTemperature: number;
      minTemperature: number;
      condition: string;
    };
    notificationSettings: {
      email: boolean
    };
  }) {
    const {
      name,
      email,
      password,
      location,
      preferredTemperatureUnit,
      thresholds,
      notificationSettings,
    } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }
    if (
      preferredTemperatureUnit !== "Celsius" &&
      preferredTemperatureUnit !== "Fahrenheit"
    ) {
      throw new Error("Invalid temperature unit");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      location,
      preferredTemperatureUnit,
      thresholds,
      notificationSettings,
    });
    if (notificationSettings.email) {
      user.notificationContact.email = email;
    }

    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return { userId: user._id, token };
  }

  async loginUser(data: { email: string; password: string }) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return { token };
  }

  async updateUserPreferences(
    userId: Schema.Types.ObjectId,
    data: {
      location: string;
      preferredTemperatureUnit: string;
      thresholds: object;
      notificationSettings: { emall: boolean; sms: boolean };
    }
  ) {
    const {
      location,
      preferredTemperatureUnit,
      thresholds,
      notificationSettings,
    } = data;
    if (
      preferredTemperatureUnit !== "Celsius" &&
      preferredTemperatureUnit !== "Fahrenheit"
    ) {
      throw new Error("Invalid temperature unit");
    }
    const updatedData = {
      location,
      preferredTemperatureUnit,
      thresholds,
      notificationSettings,
      updatedAt: new Date(),
    };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }
    console.log("UPDATED USER", updatedUser);
    return updatedUser;
  }

  async getUserProfile(userId: Schema.Types.ObjectId) {
    const user = await User.findById(userId).populate("location");
    if (!user) {
      throw new Error("User not found");
    }

    return {
      name: user.name,
      email: user.email,
      location: user.location,
      preferredTemperatureUnit: user.preferredTemperatureUnit,
      thresholds: user.thresholds,
      notificationSettings: user.notificationSettings,
    };
  }

  async getAllAlerts(userId: Schema.Types.ObjectId) {
    const alerts = await Notification.find({ userId: userId });
    if (!alerts) {
      throw new Error("User not found");
    }
    return alerts;
  }
}
