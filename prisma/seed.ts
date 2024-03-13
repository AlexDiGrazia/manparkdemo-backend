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
  await prisma.users.deleteMany();
  await prisma.profiles.deleteMany();
  await prisma.community_posts.deleteMany();
  await prisma.schedules.deleteMany();
  await prisma.events.deleteMany();
  await prisma.photos.deleteMany();
};

const seed = async () => {
  clearDb();

  await Promise.all(
    users_seedData.map(({ username, password }) =>
      prisma.users.create({
        data: {
          username,
          password,
          // password: await encryptPassword(password),
        },
      })
    )
  );

  await Promise.all(
    profiles_seedData.map(
      ({ user, picture, bio, home, occupation, birthday }) =>
        prisma.profiles.create({
          data: {
            user,
            picture,
            bio,
            home,
            occupation,
            birthday,
          },
        })
    )
  );

  await Promise.all(
    communityPosts_seedData.map((post) =>
      prisma.community_posts.create({
        data: {
          text: post.text,
          user: post.user,
        },
      })
    )
  );

  await Promise.all(
    schedules_seedData.map(({ user, day, event }) =>
      prisma.schedules.create({
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
      prisma.events.create({
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
      prisma.photos.create({
        data: {
          image,
          date,
        },
      })
    )
  );
};

seed();
