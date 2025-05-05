-- CreateTable
CREATE TABLE "forum_index" (
    "index_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "forum_index_pkey" PRIMARY KEY ("index_id")
);

-- CreateTable
CREATE TABLE "forum_entries" (
    "entry_id" SERIAL NOT NULL,
    "index_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "media_url" VARCHAR(500),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "forum_entries_pkey" PRIMARY KEY ("entry_id")
);

-- CreateTable
CREATE TABLE "forum_entry_comments" (
    "comment_id" SERIAL NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "content" TEXT,
    "media_url" VARCHAR(500),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "forum_entry_comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "forum_entry_tags" (
    "tag_id" SERIAL NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "tag" VARCHAR(50) NOT NULL,

    CONSTRAINT "forum_entry_tags_pkey" PRIMARY KEY ("tag_id")
);

-- AddForeignKey
ALTER TABLE "forum_entries" ADD CONSTRAINT "forum_entries_index_id_fkey" FOREIGN KEY ("index_id") REFERENCES "forum_index"("index_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_entries" ADD CONSTRAINT "forum_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_entry_comments" ADD CONSTRAINT "forum_entry_comments_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "forum_entries"("entry_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_entry_comments" ADD CONSTRAINT "forum_entry_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_entry_tags" ADD CONSTRAINT "forum_entry_tags_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "forum_entries"("entry_id") ON DELETE CASCADE ON UPDATE CASCADE;
