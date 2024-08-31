-- CreateTable
CREATE TABLE "Users" (
    "uid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "img" TEXT DEFAULT '',
    "twitter" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "subTitle" VARCHAR(100),
    "content" VARCHAR(5600) NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "authorUid" TEXT NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userName" TEXT DEFAULT 'Anon',
    "comment" VARCHAR(50) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_uid_key" ON "Users"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Posts_id_key" ON "Posts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Comments_id_key" ON "Comments"("id");

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorUid_fkey" FOREIGN KEY ("authorUid") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
