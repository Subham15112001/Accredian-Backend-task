/*
  Warnings:

  - Added the required column `couponCode` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupon` ADD COLUMN `couponCode` VARCHAR(191) NOT NULL;
