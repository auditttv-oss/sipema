import { User } from '../types';
import { MOCK_USERS } from '../constants';

export const getUsers = async (): Promise<User[]> => {
  return Promise.resolve(MOCK_USERS);
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const id = 'user_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const newUser: User = { id, ...user };
  MOCK_USERS.push(newUser);
  return Promise.resolve(newUser);
};

export const updateUser = async (user: User): Promise<void> => {
  const index = MOCK_USERS.findIndex(u => u.id === user.id);
  if (index !== -1) {
    MOCK_USERS[index] = user;
  }
  return Promise.resolve();
};

export const deleteUser = async (id: string): Promise<void> => {
  const index = MOCK_USERS.findIndex(u => u.id === id);
  if (index !== -1) {
    MOCK_USERS.splice(index, 1);
  }
  return Promise.resolve();
};
