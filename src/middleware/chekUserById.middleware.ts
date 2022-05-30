import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types';

export const checkUserByIdMiddleware = (users: IUser[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params?.id;
        const user = users.find((u) => u.id === id);
        if (user) {
            return next();
        }
        res.status(404).json(`User with id ${id} is not found`);
    };
};
