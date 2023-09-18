-- CreateTable
CREATE TABLE "ChristmasGroup" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "ChristmasGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecretSanta" (
    "id" TEXT NOT NULL,
    "christmasGroupId" TEXT NOT NULL,
    "giverId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "SecretSanta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChristmasGroupToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChristmasGroupToUser_AB_unique" ON "_ChristmasGroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChristmasGroupToUser_B_index" ON "_ChristmasGroupToUser"("B");

-- AddForeignKey
ALTER TABLE "SecretSanta" ADD CONSTRAINT "SecretSanta_christmasGroupId_fkey" FOREIGN KEY ("christmasGroupId") REFERENCES "ChristmasGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretSanta" ADD CONSTRAINT "SecretSanta_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretSanta" ADD CONSTRAINT "SecretSanta_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChristmasGroupToUser" ADD CONSTRAINT "_ChristmasGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ChristmasGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChristmasGroupToUser" ADD CONSTRAINT "_ChristmasGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
