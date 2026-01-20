import prisma from '../lib/prisma';
import { hashPassword } from '../utils/hash';
import {
  Role,
  Gender,
  PhysicianStatus,
  AppointmentStatus,
  ConsultationType,
  InvoiceStatus,
  Prisma,
} from './generated/prisma';

async function seed(): Promise<void> {
  console.log('🌱 Starting database seeding...');

  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.prescription.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.review.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.service.deleteMany();
  await prisma.session.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.emailVerification.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.physician.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.testimonial.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create Users
  const hashedPassword = await hashPassword('Password123');

  await prisma.user.createMany({
    data: [
      // Patients (7)
      {
        username: 'fatou_ceesay',
        email: 'fatou.ceesay@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'kebba_ceesay',
        email: 'kebba.ceesay@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=5',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'alieu_touray',
        email: 'alieu.touray@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=13',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'rohey_jatta',
        email: 'rohey.jatta@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=9',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'nyima_ceesay',
        email: 'nyima.ceesay@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=14',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'ebrima_fatty',
        email: 'ebrima.fatty@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=15',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'muhammed_jammeh',
        email: 'muhammed.jammeh@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=16',
        isVerified: true,
        emailVerified: true,
      },
      // Physicians (5)
      {
        username: 'dr_ceesay',
        email: 'dr.ceesay@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop&crop=face&auto=format',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'dr_bojang',
        email: 'dr.bojang@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://cdn.oreateai.com/aiimage/strategy/eeaebd18f9fa49848d137ce5c03921fb.jpg',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'dr_jawaneh',
        email: 'dr.jawaneh@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://cdn.oreateai.com/aiimage/strategy/f20d16ac5e9a401e9db38ceb5136b0e1.jpg',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'dr_jallow',
        email: 'dr.jallow@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8CmKuvFP9T2j3iv-FV5Fo74-l8vN3m7Nr7A&s',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'dr_binta_ceesay',
        email: 'dr.binta.ceesay@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnnY3WDyUO6qXqOXOqDCs75zw6-oq-YECq1g&s',
        isVerified: true,
        emailVerified: true,
      },
      // Admin (1)
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: Role.ADMIN,
        profileUrl: 'https://i.pravatar.cc/150?img=68',
        isVerified: true,
        emailVerified: true,
      },
    ],
  });

  console.log('✅ Users created');

  // Get created users
  const allUsers = await prisma.user.findMany();
  const patientUsers = allUsers.filter(u => u.role === Role.PATIENT);
  const physicianUsers = allUsers.filter(u => u.role === Role.PHYSICIAN);
  const adminUsers = allUsers.filter(u => u.role === Role.ADMIN);

  // Create Patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        userId: patientUsers[0].id,
        firstName: 'Fatou',
        lastName: 'Ceesay',
        dateOfBirth: new Date('1990-05-15'),
        gender: Gender.FEMALE,
        phoneNumber: '+1234567890',
        address: '123 Main St',
        city: 'Banjul',
        state: 'Banjul',
        zipCode: '10001',
        emergencyContact: '+1234567899',
        bloodType: 'O+',
        allergies: 'Penicillin',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[1].id,
        firstName: 'Kebba',
        lastName: 'Ceesay',
        dateOfBirth: new Date('1985-08-22'),
        gender: Gender.MALE,
        phoneNumber: '+1234567891',
        address: '456 Oak Ave',
        city: 'Serrekunda',
        state: 'Kanifing',
        zipCode: '90001',
        emergencyContact: '+1234567898',
        bloodType: 'A+',
        allergies: 'None',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[2].id,
        firstName: 'Alieu',
        lastName: 'Touray',
        dateOfBirth: new Date('1992-03-10'),
        gender: Gender.MALE,
        phoneNumber: '+1234567892',
        address: '789 Pine Rd',
        city: 'Brikama',
        state: 'West Coast',
        zipCode: '60601',
        emergencyContact: '+1234567897',
        bloodType: 'B+',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[3].id,
        firstName: 'Rohey',
        lastName: 'Jatta',
        dateOfBirth: new Date('1988-11-30'),
        gender: Gender.FEMALE,
        phoneNumber: '+1234567893',
        address: '321 Elm St',
        city: 'Bakau',
        state: 'Kanifing',
        zipCode: '77001',
        emergencyContact: '+1234567896',
        bloodType: 'AB+',
        allergies: 'Latex',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[4].id,
        firstName: 'Nyima',
        lastName: 'Ceesay',
        dateOfBirth: new Date('1995-07-18'),
        gender: Gender.FEMALE,
        phoneNumber: '+1234567894',
        address: '654 Maple Dr',
        city: 'Banjul',
        state: 'Banjul',
        zipCode: '85001',
        emergencyContact: '+1234567895',
        bloodType: 'O-',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[5].id,
        firstName: 'Ebrima',
        lastName: 'Fatty',
        dateOfBirth: new Date('1993-09-25'),
        gender: Gender.MALE,
        phoneNumber: '+1234567895',
        address: '789 Beach Rd',
        city: 'Bakau',
        state: 'Kanifing',
        zipCode: '90002',
        emergencyContact: '+1234567894',
        bloodType: 'A-',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[6].id,
        firstName: 'Muhammed',
        lastName: 'Jammeh',
        dateOfBirth: new Date('1987-12-05'),
        gender: Gender.MALE,
        phoneNumber: '+1234567896',
        address: '456 Market St',
        city: 'Serrekunda',
        state: 'Kanifing',
        zipCode: '90003',
        emergencyContact: '+1234567893',
        bloodType: 'B-',
      },
    }),
  ]);

  console.log('✅ Patients created');

  // Create Physicians
  const physicians = await Promise.all([
    prisma.physician.create({
      data: {
        userId: physicianUsers[0].id,
        firstName: 'Tamsirr',
        lastName: 'Ceesay',
        specialization: 'Cardiology',
        licenseNumber: 'MD12345',
        yearsOfExperience: 12,
        qualification: 'MD, FACC',
        bio: 'Experienced cardiologist specializing in heart disease prevention and treatment. Dedicated to improving cardiovascular health in African communities.',
        profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop&crop=face&auto=format',
        consultationFee: new Prisma.Decimal(150.0),
        status: PhysicianStatus.APPROVED,
        isAvailable: true,
      },
    }),
    prisma.physician.create({
      data: {
        userId: physicianUsers[1].id,
        firstName: 'Omar',
        lastName: 'Bojang',
        specialization: 'Pediatrics',
        licenseNumber: 'MD23456',
        yearsOfExperience: 8,
        qualification: 'MD, FAAP',
        bio: "Caring pediatrician dedicated to children's health and wellness. Passionate about providing quality healthcare for young patients.",
        profileImage: 'https://cdn.oreateai.com/aiimage/strategy/eeaebd18f9fa49848d137ce5c03921fb.jpg',
        consultationFee: new Prisma.Decimal(120.0),
        status: PhysicianStatus.APPROVED,
        isAvailable: true,
      },
    }),
    prisma.physician.create({
      data: {
        userId: physicianUsers[2].id,
        firstName: 'Fatou',
        lastName: 'Jawaneh',
        specialization: 'Dermatology',
        licenseNumber: 'MD34567',
        yearsOfExperience: 12,
        qualification: 'MD, FAAD',
        bio: 'Board-certified dermatologist specializing in skin conditions and cosmetic procedures. Expert in treating skin conditions common in African populations.',
        profileImage: 'https://cdn.oreateai.com/aiimage/strategy/f20d16ac5e9a401e9db38ceb5136b0e1.jpg',
        consultationFee: new Prisma.Decimal(130.0),
        status: PhysicianStatus.APPROVED,
        isAvailable: true,
      },
    }),
    prisma.physician.create({
      data: {
        userId: physicianUsers[3].id,
        firstName: 'Momodou',
        lastName: 'Jallow',
        specialization: 'General Practice',
        licenseNumber: 'MD45678',
        yearsOfExperience: 15,
        qualification: 'MD, FAAFP',
        bio: 'Family medicine physician providing comprehensive primary care. Committed to accessible healthcare for all families.',
        profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8CmKuvFP9T2j3iv-FV5Fo74-l8vN3m7Nr7A&s',
        consultationFee: new Prisma.Decimal(100.0),
        status: PhysicianStatus.APPROVED,
        isAvailable: true,
      },
    }),
    prisma.physician.create({
      data: {
        userId: physicianUsers[4].id,
        firstName: 'Binta',
        lastName: 'Ceesay',
        specialization: 'General Practice',
        licenseNumber: 'MD56789',
        yearsOfExperience: 2,
        qualification: 'MD',
        bio: 'Dedicated general practitioner committed to providing quality primary healthcare services to patients.',
        profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnnY3WDyUO6qXqOXOqDCs75zw6-oq-YECq1g&s',
        consultationFee: new Prisma.Decimal(80.0),
        status: PhysicianStatus.APPROVED,
        isAvailable: true,
      },
    }),
  ]);

  console.log('✅ Physicians created');

  // Create Admin
  await prisma.admin.create({
    data: {
      userId: adminUsers[0].id,
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  console.log('✅ Admin created');

  // Create Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'General Consultation',
        description: 'Comprehensive health assessment and medical advice',
        icon: '🩺',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Follow-up Consultation',
        description: 'Review progress and adjust treatment plan',
        icon: '📋',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Prescription Refill',
        description: 'Renew medications and prescriptions',
        icon: '💊',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Mental Health Consultation',
        description: 'Counseling and mental wellness support',
        icon: '🧠',
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Skin Consultation',
        description: 'Dermatological assessment and treatment',
        icon: '🔬',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Services created');

  // Create Availability for Physicians
  const availabilityData = [];
  for (const physician of physicians) {
    // Monday to Friday, 9 AM to 5 PM
    for (let day = 1; day <= 5; day++) {
      availabilityData.push({
        physicianId: physician.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
      });
    }
  }

  await prisma.availability.createMany({
    data: availabilityData,
  });

  console.log('✅ Availability created');

  // Create Appointments
  const now = new Date();
  const appointments = await Promise.all([
    // Completed appointment
    prisma.appointment.create({
      data: {
        patientId: patients[0].id,
        physicianId: physicians[0].id,
        serviceId: services[0].id,
        appointmentDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        endTime: new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
        ),
        status: AppointmentStatus.COMPLETED,
        consultationType: ConsultationType.VIDEO,
        symptoms: 'Chest pain and shortness of breath',
        notes: 'Patient reports improvement after medication',
      },
    }),
    // Upcoming appointment
    prisma.appointment.create({
      data: {
        patientId: patients[1].id,
        physicianId: physicians[1].id,
        serviceId: services[1].id,
        appointmentDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(
          now.getTime() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
        ),
        status: AppointmentStatus.CONFIRMED,
        consultationType: ConsultationType.VIDEO,
        symptoms: 'Child has fever and cough',
        meetingLink: 'https://meet.example.com/abc123',
      },
    }),
    // Pending appointment
    prisma.appointment.create({
      data: {
        patientId: patients[2].id,
        physicianId: physicians[2].id,
        serviceId: services[4].id,
        appointmentDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        endTime: new Date(
          now.getTime() + 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000,
        ),
        status: AppointmentStatus.PENDING,
        consultationType: ConsultationType.VIDEO,
        symptoms: 'Skin rash and itching',
      },
    }),
    // Completed appointment 2
    prisma.appointment.create({
      data: {
        patientId: patients[3].id,
        physicianId: physicians[3].id,
        serviceId: services[0].id,
        appointmentDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        startTime: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        endTime: new Date(
          now.getTime() - 14 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000,
        ),
        status: AppointmentStatus.COMPLETED,
        consultationType: ConsultationType.AUDIO,
        symptoms: 'Headache and fatigue',
      },
    }),
    // Cancelled appointment
    prisma.appointment.create({
      data: {
        patientId: patients[4].id,
        physicianId: physicians[0].id,
        serviceId: services[2].id,
        appointmentDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        startTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        endTime: new Date(
          now.getTime() + 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
        ),
        status: AppointmentStatus.CANCELLED,
        consultationType: ConsultationType.CHAT,
        symptoms: 'Need prescription refill',
      },
    }),
  ]);

  console.log('✅ Appointments created');

  // Create Payments
  const payment1 = await prisma.payment.create({
    data: {
      appointmentId: appointments[0].id,
      amount: 150.0,
      paymentMethod: 'CREDIT_CARD',
      transactionId: 'TXN001',
      status: 'PAID',
    },
  });

  const payment2 = await prisma.payment.create({
    data: {
      appointmentId: appointments[1].id,
      amount: 120.0,
      paymentMethod: 'DEBIT_CARD',
      transactionId: 'TXN002',
      status: 'PAID',
    },
  });

  const payment3 = await prisma.payment.create({
    data: {
      appointmentId: appointments[2].id,
      amount: 130.0,
      paymentMethod: 'CREDIT_CARD',
    },
  });

  const payment4 = await prisma.payment.create({
    data: {
      appointmentId: appointments[3].id,
      amount: 100.0,
      paymentMethod: 'CASH',
      transactionId: 'TXN003',
      status: 'PAID',
    },
  });

  const payments = [payment1, payment2, payment3, payment4];

  console.log('✅ Payments created');

  // Create Invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        paymentId: payments[0].id,
        invoiceNo: 'INV-2024-001',
        totalAmount: new Prisma.Decimal(150.0),
        tax: new Prisma.Decimal(15.0),
        discount: new Prisma.Decimal(0.0),
        issuedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        status: InvoiceStatus.PAID,
      },
    }),
    prisma.invoice.create({
      data: {
        paymentId: payments[1].id,
        invoiceNo: 'INV-2024-002',
        totalAmount: new Prisma.Decimal(120.0),
        tax: new Prisma.Decimal(12.0),
        discount: new Prisma.Decimal(0.0),
        issuedAt: new Date(),
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        status: InvoiceStatus.PAID,
      },
    }),
    prisma.invoice.create({
      data: {
        paymentId: payments[2].id,
        invoiceNo: 'INV-2024-003',
        totalAmount: new Prisma.Decimal(130.0),
        tax: new Prisma.Decimal(13.0),
        discount: new Prisma.Decimal(0.0),
        issuedAt: new Date(),
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        status: InvoiceStatus.UNPAID,
      },
    }),
    prisma.invoice.create({
      data: {
        paymentId: payments[3].id,
        invoiceNo: 'INV-2024-004',
        totalAmount: new Prisma.Decimal(100.0),
        tax: new Prisma.Decimal(10.0),
        discount: new Prisma.Decimal(10.0),
        issuedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        status: InvoiceStatus.PAID,
      },
    }),
  ]);

  console.log('✅ Invoices created');

  // Create Receipts
  const receipts = await Promise.all([
    prisma.receipt.create({
      data: {
        invoiceId: invoices[0].id,
        receiptNo: 'RCP-2024-001',
        issuedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        receivedBy: 'Fatou Ceesay',
        notes: 'Payment received via credit card',
      },
    }),
    prisma.receipt.create({
      data: {
        invoiceId: invoices[1].id,
        receiptNo: 'RCP-2024-002',
        issuedAt: new Date(),
        receivedBy: 'Kebba Ceesay',
        notes: 'Payment received via debit card',
      },
    }),
    prisma.receipt.create({
      data: {
        invoiceId: invoices[3].id,
        receiptNo: 'RCP-2024-003',
        issuedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        receivedBy: 'Rohey Jatta',
        notes: 'Cash payment received',
      },
    }),
  ]);

  console.log('✅ Receipts created');

  // Create Prescriptions
  const prescriptions = await Promise.all([
    prisma.prescription.create({
      data: {
        appointmentId: appointments[0].id,
        diagnosis: 'Angina Pectoris',
        medications: JSON.stringify([
          {
            name: 'Aspirin',
            dosage: '81mg',
            frequency: 'Once daily',
            duration: '30 days',
          },
          {
            name: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily at bedtime',
            duration: '30 days',
          },
        ]),
        instructions:
          'Take medications as prescribed. Avoid fatty foods. Regular exercise recommended.',
        followUpDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.prescription.create({
      data: {
        appointmentId: appointments[3].id,
        diagnosis: 'Tension Headache',
        medications: JSON.stringify([
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'Every 6 hours as needed',
            duration: '7 days',
          },
        ]),
        instructions:
          'Rest and stay hydrated. Avoid stress. Apply cold compress if needed.',
        followUpDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log('✅ Prescriptions created');

  // Create Medical Records
  const medicalRecords = await Promise.all([
    prisma.medicalRecord.create({
      data: {
        patientId: patients[0].id,
        documentName: 'Blood Test Results - January 2024',
        documentType: 'Lab Report',
        fileUrl: '/uploads/medical-records/blood-test-001.pdf',
        uploadedBy: 'Dr. Emily Adams',
      },
    }),
    prisma.medicalRecord.create({
      data: {
        patientId: patients[0].id,
        documentName: 'ECG Report',
        documentType: 'Diagnostic Report',
        fileUrl: '/uploads/medical-records/ecg-001.pdf',
        uploadedBy: 'Dr. Emily Adams',
      },
    }),
    prisma.medicalRecord.create({
      data: {
        patientId: patients[1].id,
        documentName: 'Vaccination Record',
        documentType: 'Immunization',
        fileUrl: '/uploads/medical-records/vaccine-001.pdf',
        uploadedBy: 'Dr. Carlos Martinez',
      },
    }),
    prisma.medicalRecord.create({
      data: {
        patientId: patients[3].id,
        documentName: 'X-Ray Report',
        documentType: 'Imaging',
        fileUrl: '/uploads/medical-records/xray-001.pdf',
        uploadedBy: 'Dr. Robert Thompson',
      },
    }),
  ]);

  console.log('✅ Medical Records created');

  // Create Reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        physicianId: physicians[0].id,
        patientName: 'Fatou Ceesay',
        rating: 5,
        comment:
          'Dr. Ceesay was excellent! Very thorough and explained everything clearly.',
      },
    }),
    prisma.review.create({
      data: {
        physicianId: physicians[0].id,
        patientName: 'Anonymous',
        rating: 4,
        comment: 'Good experience overall. Would recommend.',
      },
    }),
    prisma.review.create({
      data: {
        physicianId: physicians[1].id,
        patientName: 'Kebba Ceesay',
        rating: 5,
        comment: 'Dr. Bojang is wonderful with children. Highly recommended!',
      },
    }),
    prisma.review.create({
      data: {
        physicianId: physicians[2].id,
        patientName: 'Alieu Touray',
        rating: 5,
        comment:
          'Dr. Jawaneh was very knowledgeable and provided great treatment advice.',
      },
    }),
    prisma.review.create({
      data: {
        physicianId: physicians[3].id,
        patientName: 'Rohey Jatta',
        rating: 4,
        comment: 'Professional and caring doctor.',
      },
    }),
  ]);

  console.log('✅ Reviews created');

  // Create Testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Dr. Emily Roberts',
        role: 'Physician',
        content:
          'As a healthcare provider, this platform makes it easy to reach more patients while maintaining quality care. The interface is intuitive.',
        rating: 5,
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      },
    }),
  ]);

  console.log('✅ Testimonials created');

  // Summary
  console.log('\n📊 Seeding Summary:');
  console.log(`- ${allUsers.length} Users`);
  console.log(`- ${patients.length} Patients`);
  console.log(`- ${physicians.length} Physicians`);
  console.log(`- 1 Admin`);
  console.log(`- ${services.length} Services`);
  console.log(`- ${availabilityData.length} Availability slots`);
  console.log(`- ${appointments.length} Appointments`);
  console.log(`- ${payments.length} Payments`);
  console.log(`- ${invoices.length} Invoices`);
  console.log(`- ${receipts.length} Receipts`);
  console.log(`- ${prescriptions.length} Prescriptions`);
  console.log(`- ${medicalRecords.length} Medical Records`);
  console.log(`- ${reviews.length} Reviews`);
  console.log(`- ${testimonials.length} Testimonials`);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('Patient: fatou.ceesay@example.com / Password123');
  console.log('Physician: dr.ceesay@example.com / Password123');
  console.log('Admin: admin@example.com / Password123');
}

void (async () => {
  try {
    await seed();
  } catch (e) {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
