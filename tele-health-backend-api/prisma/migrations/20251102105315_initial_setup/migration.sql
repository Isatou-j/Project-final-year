-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'PHYSICIAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "PhysicianStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ConsultationType" AS ENUM ('VIDEO', 'AUDIO', 'CHAT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'INSURANCE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PATIENT',
    "profileUrl" TEXT,
    "lastLogin" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletionReason" TEXT,
    "passwordUpdatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "emergencyContact" TEXT,
    "bloodType" TEXT,
    "allergies" TEXT,
    "medicalHistory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "physicians" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "qualification" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "consultationFee" DECIMAL(10,2) NOT NULL,
    "status" "PhysicianStatus" NOT NULL DEFAULT 'PENDING',
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "physicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "physicianId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "consultationType" "ConsultationType" NOT NULL DEFAULT 'VIDEO',
    "symptoms" TEXT,
    "notes" TEXT,
    "meetingLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availabilities" (
    "id" SERIAL NOT NULL,
    "physicianId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'GMD',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" INTEGER,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "invoiceNo" VARCHAR(50) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'UNPAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "receiptNo" VARCHAR(50) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "receivedBy" VARCHAR(255),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "medications" TEXT NOT NULL,
    "instructions" TEXT,
    "followUpDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "physicianId" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "resetToken" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" VARCHAR(45),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_deletedAt_isActive_idx" ON "users"("deletedAt", "isActive");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "patients_userId_key" ON "patients"("userId");

-- CreateIndex
CREATE INDEX "patients_userId_idx" ON "patients"("userId");

-- CreateIndex
CREATE INDEX "patients_createdAt_idx" ON "patients"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "physicians_userId_key" ON "physicians"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "physicians_licenseNumber_key" ON "physicians"("licenseNumber");

-- CreateIndex
CREATE INDEX "physicians_userId_idx" ON "physicians"("userId");

-- CreateIndex
CREATE INDEX "physicians_specialization_idx" ON "physicians"("specialization");

-- CreateIndex
CREATE INDEX "physicians_licenseNumber_idx" ON "physicians"("licenseNumber");

-- CreateIndex
CREATE INDEX "physicians_status_idx" ON "physicians"("status");

-- CreateIndex
CREATE INDEX "physicians_createdAt_idx" ON "physicians"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE INDEX "admins_userId_idx" ON "admins"("userId");

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateIndex
CREATE INDEX "appointments_serviceId_idx" ON "appointments"("serviceId");

-- CreateIndex
CREATE INDEX "appointments_physicianId_idx" ON "appointments"("physicianId");

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_idx" ON "appointments"("appointmentDate");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- CreateIndex
CREATE INDEX "services_isActive_idx" ON "services"("isActive");

-- CreateIndex
CREATE INDEX "availabilities_physicianId_idx" ON "availabilities"("physicianId");

-- CreateIndex
CREATE UNIQUE INDEX "availabilities_physicianId_dayOfWeek_key" ON "availabilities"("physicianId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "payments_appointmentId_key" ON "payments"("appointmentId");

-- CreateIndex
CREATE INDEX "payments_appointmentId_idx" ON "payments"("appointmentId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_paymentMethod_idx" ON "payments"("paymentMethod");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE INDEX "medical_records_patientId_idx" ON "medical_records"("patientId");

-- CreateIndex
CREATE INDEX "medical_records_createdAt_idx" ON "medical_records"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_paymentId_key" ON "invoices"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNo_key" ON "invoices"("invoiceNo");

-- CreateIndex
CREATE INDEX "invoices_invoiceNo_idx" ON "invoices"("invoiceNo");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_issuedAt_idx" ON "invoices"("issuedAt");

-- CreateIndex
CREATE INDEX "invoices_dueDate_idx" ON "invoices"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_invoiceId_key" ON "receipts"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "receipts_receiptNo_key" ON "receipts"("receiptNo");

-- CreateIndex
CREATE INDEX "receipts_receiptNo_idx" ON "receipts"("receiptNo");

-- CreateIndex
CREATE INDEX "receipts_issuedAt_idx" ON "receipts"("issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_appointmentId_key" ON "prescriptions"("appointmentId");

-- CreateIndex
CREATE INDEX "reviews_physicianId_idx" ON "reviews"("physicianId");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_userId_key" ON "email_verifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_code_key" ON "email_verifications"("code");

-- CreateIndex
CREATE INDEX "email_verifications_code_idx" ON "email_verifications"("code");

-- CreateIndex
CREATE INDEX "email_verifications_expiresAt_idx" ON "email_verifications"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_userId_key" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_resetToken_key" ON "password_reset_tokens"("resetToken");

-- CreateIndex
CREATE INDEX "password_reset_tokens_resetToken_idx" ON "password_reset_tokens"("resetToken");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expiresAt_idx" ON "password_reset_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_userId_key" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "sessions_revoked_idx" ON "sessions"("revoked");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "physicians" ADD CONSTRAINT "physicians_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES "physicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES "physicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_physicianId_fkey" FOREIGN KEY ("physicianId") REFERENCES "physicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
