import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

export const checkUserByIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params?.id;
    const user = await userService.getUserById(id);
    if (user) {
        return next();
    }
    res.status(404).json(`User with id ${id} is not found`);
};
