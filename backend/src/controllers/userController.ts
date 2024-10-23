import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { Schema } from "mongoose";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.updatePreferences = this.updatePreferences.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getallAlerts = this.getallAlerts.bind(this);
  }

  async register(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        password,
        location,
        preferredTemperatureUnit,
        thresholds,
        notificationSettings,
      } = req.body;

      const { userId, token } = await this.userService.registerUser({
        name,
        email,
        password,
        location,
        preferredTemperatureUnit,
        thresholds,
        notificationSettings,
      });

      res.status(201).json({
        message: "User registered successfully",
        userId,
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token } = await this.userService.loginUser({ email, password });

      res.json({
        message: "Login successful",
        token,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async updatePreferences(req: Request, res: Response) {
    try {
      const userId = req?.user?._id;
      const {
        location,
        preferredTemperatureUnit,
        thresholds,
        notificationSettings,
        notificationContact,
      } = req.body;
      if (!userId) {
        throw new Error("User id required");
      }
      const updatedUser = await this.userService.updateUserPreferences(userId, {
        location,
        preferredTemperatureUnit,
        thresholds,
        notificationSettings,
        notificationContact,
      });

      res.json({
        message: "Preferences updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req?.user?._id;
      if (!userId) {
        throw new Error("User id required");
      }
      const userProfile = await this.userService.getUserProfile(userId);

      res.json(userProfile);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async getallAlerts(req: Request, res: Response) {
    try {
      if (!req.user || !req.user._id) {
        throw new Error("User id required");
      }
      const userId = req.user._id as Schema.Types.ObjectId;
      const alerts = await this.userService.getAllAlerts(userId);

      res.json(alerts);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}
