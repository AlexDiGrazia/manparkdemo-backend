/*
  Warnings:

  - Added the required column `authorId` to the `CommunityPost` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommunityPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CommunityPost" ("id", "text", "user") SELECT "id", "text", "user" FROM "CommunityPost";
DROP TABLE "CommunityPost";
ALTER TABLE "new_CommunityPost" RENAME TO "CommunityPost";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
