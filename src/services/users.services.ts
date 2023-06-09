import { z } from "zod";
import { AppDataSource } from "../data-source";
import { User } from "../entities";
import {
  tUserRequest,
  tUserReturn,
  tUserRepo,
  tUserUpdate,
} from "../interfaces";
import { returnUserSchema } from "../schemas";

export const createUserService = async (
  payload: tUserRequest
): Promise<tUserReturn> => {
  const usersRepository: tUserRepo = AppDataSource.getRepository(User);

  const newUserData: User = usersRepository.create(payload)
  
  const newUser: User = await usersRepository.save(newUserData);

  const parsedNewUser: tUserReturn = returnUserSchema.parse(newUser);

  return parsedNewUser;
};

export const listAllUsersService = async (): Promise<tUserReturn[]> => {
  const usersRepository: tUserRepo = AppDataSource.getRepository(User);

  const users: User[] = await usersRepository.find();

  const parsedUsers: tUserReturn[] = z.array(returnUserSchema).parse(users);

  return parsedUsers;
};

export const updateUserService = async (
  id: number,
  payload: tUserUpdate
): Promise<tUserReturn> => {
  const usersRepository: tUserRepo = AppDataSource.getRepository(User);

  const foundUser: User | null = await usersRepository.findOneBy({ id });

  const updatedUserData: User = usersRepository.create({
    ...foundUser,
    ...payload,
  })

  const updatedUser: User = await usersRepository.save(updatedUserData);

  const parsedUpdateUser: tUserReturn = returnUserSchema.parse(updatedUser);

  return parsedUpdateUser;
};

export const deleteUserService = async (id: number): Promise<void> => {
  const userRepository: tUserRepo = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: {
      id: id,
    },
  });

  await userRepository.softRemove(user!);
};
