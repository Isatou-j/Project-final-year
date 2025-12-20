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
      // Patients (5)
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'jane_smith',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=5',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'mike_wilson',
        email: 'mike.wilson@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=13',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'sarah_brown',
        email: 'sarah.brown@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=9',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'david_jones',
        email: 'david.jones@example.com',
        password: hashedPassword,
        role: Role.PATIENT,
        profileUrl: 'https://i.pravatar.cc/150?img=14',
        isVerified: true,
        emailVerified: true,
      },
      // Physicians (4)
      {
        username: 'dr_adams',
        email: 'dr.adams@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://i.pravatar.cc/150?img=33',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'dr_martinez',
        email: 'dr.martinez@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://i.pravatar.cc/150?img=28',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'dr_lee',
        email: 'dr.lee@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://i.pravatar.cc/150?img=47',
        isVerified: true,
        emailVerified: true,
      },
      {
        username: 'dr_thompson',
        email: 'dr.thompson@example.com',
        password: hashedPassword,
        role: Role.PHYSICIAN,
        profileUrl: 'https://i.pravatar.cc/150?img=27',
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
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-05-15'),
        gender: Gender.MALE,
        phoneNumber: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        emergencyContact: '+1234567899',
        bloodType: 'O+',
        allergies: 'Penicillin',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[1].id,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: new Date('1985-08-22'),
        gender: Gender.FEMALE,
        phoneNumber: '+1234567891',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        emergencyContact: '+1234567898',
        bloodType: 'A+',
        allergies: 'None',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[2].id,
        firstName: 'Mike',
        lastName: 'Wilson',
        dateOfBirth: new Date('1992-03-10'),
        gender: Gender.MALE,
        phoneNumber: '+1234567892',
        address: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        emergencyContact: '+1234567897',
        bloodType: 'B+',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[3].id,
        firstName: 'Sarah',
        lastName: 'Brown',
        dateOfBirth: new Date('1988-11-30'),
        gender: Gender.FEMALE,
        phoneNumber: '+1234567893',
        address: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        emergencyContact: '+1234567896',
        bloodType: 'AB+',
        allergies: 'Latex',
      },
    }),
    prisma.patient.create({
      data: {
        userId: patientUsers[4].id,
        firstName: 'David',
        lastName: 'Jones',
        dateOfBirth: new Date('1995-07-18'),
        gender: Gender.MALE,
        phoneNumber: '+1234567894',
        address: '654 Maple Dr',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        emergencyContact: '+1234567895',
        bloodType: 'O-',
      },
    }),
  ]);

  console.log('✅ Patients created');

  // Create Physicians
  const physicians = await Promise.all([
    prisma.physician.create({
      data: {
        userId: physicianUsers[0].id,
        firstName: 'Emily',
        lastName: 'Adams',
        specialization: 'Cardiology',
        licenseNumber: 'MD12345',
        yearsOfExperience: 10,
        qualification: 'MD, FACC',
        bio: 'Experienced cardiologist specializing in heart disease prevention and treatment.',
        consultationFee: new Prisma.Decimal(150.0),
        status: PhysicianStatus.APPROVED,
        isAvailable: true,
      },
    }),
    prisma.physician.create({
      data: {
        userId: physicianUsers[1].id,
        firstName: 'Carlos',
        lastName: 'Martinez',
        specialization: 'Pediatrics',
        licenseNumber: 'MD23456',
        yearsOfExperience: 8,
        qualification: 'MD, FAAP',
        bio: "Caring pediatrician dedicated to children's health and wellness.",
        consultationFee: new Prisma.Decimal(120.0),
        status: PhysicianStatus.APPROVED,
        isAvailable: true,
      },
    }),
    prisma.physician.create({
      data: {
        userId: physicianUsers[2].id,
        firstName: 'Lisa',
        lastName: 'Lee',
        specialization: 'Dermatology',
        licenseNumber: 'MD34567',
        yearsOfExperience: 12,
        qualification: 'MD, FAAD',
        bio: 'Board-certified dermatologist specializing in skin conditions and cosmetic procedures.',
        consultationFee: new Prisma.Decimal(130.0),
        status: PhysicianStatus.APPROVED,
        isAvailable: true,
      },
    }),
    prisma.physician.create({
      data: {
        userId: physicianUsers[3].id,
        firstName: 'Robert',
        lastName: 'Thompson',
        specialization: 'General Practice',
        licenseNumber: 'MD45678',
        yearsOfExperience: 15,
        qualification: 'MD, FAAFP',
        bio: 'Family medicine physician providing comprehensive primary care.',
        consultationFee: new Prisma.Decimal(100.0),
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
        receivedBy: 'John Doe',
        notes: 'Payment received via credit card',
      },
    }),
    prisma.receipt.create({
      data: {
        invoiceId: invoices[1].id,
        receiptNo: 'RCP-2024-002',
        issuedAt: new Date(),
        receivedBy: 'Jane Smith',
        notes: 'Payment received via debit card',
      },
    }),
    prisma.receipt.create({
      data: {
        invoiceId: invoices[3].id,
        receiptNo: 'RCP-2024-003',
        issuedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        receivedBy: 'Sarah Brown',
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
        patientName: 'John Doe',
        rating: 5,
        comment:
          'Dr. Adams was excellent! Very thorough and explained everything clearly.',
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
        patientName: 'Jane Smith',
        rating: 5,
        comment: 'Dr. Martinez is wonderful with children. Highly recommended!',
      },
    }),
    prisma.review.create({
      data: {
        physicianId: physicians[2].id,
        patientName: 'Mike Wilson',
        rating: 5,
        comment:
          'Dr. Lee was very knowledgeable and provided great treatment advice.',
      },
    }),
    prisma.review.create({
      data: {
        physicianId: physicians[3].id,
        patientName: 'Sarah Brown',
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
  console.log('Patient: john.doe@example.com / Password123');
  console.log('Physician: dr.adams@example.com / Password123');
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
