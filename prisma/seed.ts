import { encryptPassword } from "../src/auth-utils";
import { prisma } from "./db.setup";
import {
  communityPosts_seedData,
  events_seedData,
  photos_seedData,
  profiles_seedData,
  schedules_seedData,
  users_seedData,
} from "./seedData";

const clearDb = async () => {
  await prisma.user.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.event.deleteMany();
  await prisma.photo.deleteMany();
  console.log("old tables deleted");
};

const seed = async () => {
  await clearDb();

  await Promise.all(
    users_seedData.map(async ({ username, password }) => {
      const {
        username: Pusername,
        picture,
        bio,
        home,
        occupation,
        birthday,
      } = profiles_seedData.find((profile) => profile.username == username)!;

      return prisma.user.create({
        data: {
          username,
          //TO_DO create a migration with passwordHash instead of password
          password: await encryptPassword(password),
          profile: {
            create: {
              username: Pusername,
              picture,
              bio,
              home,
              occupation,
              birthday,
              schedules: {
                create: schedules_seedData.filter(
                  (obj) => obj.user === username
                ),
              },
            },
          },
          communityPosts: {
            create: communityPosts_seedData.filter(
              (obj) => obj.user === username
            ),
          },
          events: {
            create: events_seedData.filter((obj) => obj.user === username),
          },
        },
        include: {
          profile: {
            include: {
              schedules: true,
            },
          },
          communityPosts: true,
          events: true,
        },
      });
    })
  );

  await Promise.all(
    photos_seedData.map(({ image, date }) =>
      prisma.photo.create({
        data: {
          image,
          date,
        },
      })
    )
  );

  console.log("new data seeded");
};

seed();
