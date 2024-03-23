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
  // await prisma.profile.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.event.deleteMany();
  await prisma.photo.deleteMany();
  console.log("finished");
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
            },
          },
        },
        include: {
          profile: true,
        },
      });
    })
  );

  await Promise.all(
    communityPosts_seedData.map((post) =>
      prisma.communityPost.create({
        data: {
          text: post.text,
          user: post.user,
        },
      })
    )
  );

  await Promise.all(
    schedules_seedData.map(({ user, day, event }) =>
      prisma.schedule.create({
        data: {
          user,
          day,
          event,
        },
      })
    )
  );

  await Promise.all(
    events_seedData.map(({ user, date, title, details }) =>
      prisma.event.create({
        data: {
          user,
          date,
          title,
          details,
        },
      })
    )
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

  console.log("seeded");
};

seed();
