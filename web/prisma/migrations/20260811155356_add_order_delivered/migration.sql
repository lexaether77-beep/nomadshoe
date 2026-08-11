-- AlterEnum
ALTER TYPE "MessageKind" ADD VALUE 'ORDER_DELIVERED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveredAt" TIMESTAMP(3);
