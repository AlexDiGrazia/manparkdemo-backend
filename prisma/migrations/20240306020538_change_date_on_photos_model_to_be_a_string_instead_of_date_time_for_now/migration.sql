-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_photos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "date" TEXT NOT NULL
);
INSERT INTO "new_photos" ("date", "id", "image") SELECT "date", "id", "image" FROM "photos";
DROP TABLE "photos";
ALTER TABLE "new_photos" RENAME TO "photos";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
