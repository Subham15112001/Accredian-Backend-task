/*
  Warnings:

  - You are about to drop the column `userId` on the `coupon` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `coupon` DROP FOREIGN KEY `Coupon_userId_fkey`;

-- AlterTable
ALTER TABLE `coupon` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `CouponUserRelation` (
    `couponId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`couponId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CouponUserRelation` ADD CONSTRAINT `CouponUserRelation_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CouponUserRelation` ADD CONSTRAINT `CouponUserRelation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
