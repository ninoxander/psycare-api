-- CreateTable
CREATE TABLE "alerts" (
    "alert_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "type" VARCHAR,
    "description" TEXT,
    "date" TIMESTAMP(6),
    "status" VARCHAR,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("alert_id")
);

-- CreateTable
CREATE TABLE "articles" (
    "article_id" SERIAL NOT NULL,
    "professional_id" INTEGER,
    "title" VARCHAR,
    "content" TEXT,
    "media_url" VARCHAR,
    "media_type" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "articles_pkey" PRIMARY KEY ("article_id")
);

-- CreateTable
CREATE TABLE "emotional_records" (
    "record_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "emotion" VARCHAR,
    "intensity" INTEGER,
    "description" TEXT,
    "date" DATE,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "emotional_records_pkey" PRIMARY KEY ("record_id")
);

-- CreateTable
CREATE TABLE "habits" (
    "habit_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "habit_type" VARCHAR,
    "description" TEXT,
    "date" DATE,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "habits_pkey" PRIMARY KEY ("habit_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "message" TEXT,
    "type" VARCHAR,
    "date" TIMESTAMP(6),
    "read_status" VARCHAR,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "patient_professional" (
    "relation_id" SERIAL NOT NULL,
    "patient_id" INTEGER,
    "professional_id" INTEGER,
    "start_date" DATE,
    "end_date" DATE,
    "status" VARCHAR,

    CONSTRAINT "patient_professional_pkey" PRIMARY KEY ("relation_id")
);

-- CreateTable
CREATE TABLE "professionals" (
    "professional_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "specialization" VARCHAR,
    "license_number" VARCHAR,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("professional_id")
);

-- CreateTable
CREATE TABLE "questionnaires" (
    "questionnaire_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "type" VARCHAR,
    "responses" JSON,
    "date" DATE,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "questionnaires_pkey" PRIMARY KEY ("questionnaire_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" SERIAL NOT NULL,
    "patient_id" INTEGER,
    "professional_id" INTEGER,
    "date" TIMESTAMP(6),
    "notes" TEXT,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "setting_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "notification_preferences" JSON,
    "privacy_settings" JSON,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("setting_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR,
    "email" VARCHAR,
    "password" VARCHAR,
    "role" VARCHAR,
    "bio" VARCHAR(255),
    "pronouns" VARCHAR(100),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professionals_user_id_key" ON "professionals"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("professional_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "emotional_records" ADD CONSTRAINT "emotional_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "habits" ADD CONSTRAINT "habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_professional" ADD CONSTRAINT "patient_professional_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_professional" ADD CONSTRAINT "patient_professional_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("professional_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professionals"("professional_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
