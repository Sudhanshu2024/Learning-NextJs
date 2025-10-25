-- CreateTable
CREATE TABLE "Todos" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorid" INTEGER NOT NULL,

    CONSTRAINT "Todos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Todos_authorid_key" ON "Todos"("authorid");

-- AddForeignKey
ALTER TABLE "Todos" ADD CONSTRAINT "Todos_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
