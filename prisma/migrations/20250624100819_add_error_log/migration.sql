-- CreateTable
CREATE TABLE "error_logs" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "token" TEXT,
    "ipAddress" TEXT,
    "errorStack" TEXT NOT NULL,
    "payload" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);
