-- CreateTable
CREATE TABLE "support_reports" (
    "report_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "reason" VARCHAR(255),
    "body" TEXT,
    "page" VARCHAR(255),
    "folio" VARCHAR(100),
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "support_reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "support_reports_folio_key" ON "support_reports"("folio");

-- AddForeignKey
ALTER TABLE "support_reports" ADD CONSTRAINT "support_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
