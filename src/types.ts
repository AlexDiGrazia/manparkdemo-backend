export type TProfile = {
  bio: string;
  birthday: Date | undefined;
  home: string;
  id: number;
  occupation: string;
  picture: string;
  userId: number;
  username: string;
} | null; /* profile is an optional relationship in Prisma Schema */

export type TUser = {
  id: number;
  username: string;
  password: string;
  profile?: TProfile | undefined;
};
