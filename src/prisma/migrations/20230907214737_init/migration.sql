-- CreateEnum
CREATE TYPE "stream_status" AS ENUM ('LIVE', 'PENDING', 'ENDED');

-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "status" "stream_status" NOT NULL DEFAULT 'PENDING';
