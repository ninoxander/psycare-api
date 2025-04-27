-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR,
    "description" TEXT,
    "date" DATE,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);
