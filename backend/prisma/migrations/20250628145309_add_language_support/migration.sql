-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "preferredLanguage" TEXT DEFAULT 'en';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "language" TEXT DEFAULT 'en';
