import { Router, RequestHandler } from "express";
import { UserService } from "@services/user.service";
import { UserRepository } from "@repositories/user.repository";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export const createUser: RequestHandler = async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await userService.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const search: RequestHandler = async (req, res) => {
  try {
    const userEmail = req.query.email as string;
    if (!userEmail) {
      res.status(400).json({ message: 'Email parameter is required' });
      return;
    }
    const user = await userService.findByEmail(userEmail);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const updatedUser = await userService.update(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    await userService.delete(userId);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export class UserController {
  private router: Router;

  constructor() {
    this.router = Router();
  
  }


  public getRouter = (): Router => {
    return this.router;
  };
}

export default new UserController();
