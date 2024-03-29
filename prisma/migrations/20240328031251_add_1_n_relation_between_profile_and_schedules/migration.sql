/*
  Warnings:

  - Added the required column `profileId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Schedule_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("day", "event", "id", "user") SELECT "day", "event", "id", "user" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
