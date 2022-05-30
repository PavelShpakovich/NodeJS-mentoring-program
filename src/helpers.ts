import { IGetAutoSuggestUsers, IUser } from './types';

export const getAutoSuggestUsers = ({ loginSubstring = '', limit = 100, users }: IGetAutoSuggestUsers): IUser[] => {
    return users
        .filter((u) => u.login.startsWith(loginSubstring))
        .sort((a, b) => a.login.localeCompare(b.login))
        .slice(0, limit);
};
