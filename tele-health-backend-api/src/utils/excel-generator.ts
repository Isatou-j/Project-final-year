/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs/promises';

export class ExcelReportGenerator {
  static async generateReceiptsReport(receipts: any[], filters: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Receipts Report');

    worksheet.columns = [
      { header: 'Receipt No', key: 'receiptNo', width: 15 },
      { header: 'Invoice No', key: 'invoiceNo', width: 15 },
      { header: 'Patient Name', key: 'patientName', width: 20 },
      { header: 'Physician Name', key: 'physicianName', width: 20 },
      { header: 'Service Type', key: 'serviceType', width: 20 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Payment Method', key: 'paymentMethod', width: 15 },
      { header: 'Issue Date', key: 'issueDate', width: 15 },
      { header: 'Received By', key: 'receivedBy', width: 20 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    this.styleHeader(worksheet);

    receipts.forEach((receipt, index) => {
      const appointment = receipt.invoice?.payment?.appointment;
      const patient = appointment?.patient;
      const physician = appointment?.physician;

      const row = worksheet.addRow({
        receiptNo: receipt.receiptNo,
        invoiceNo: receipt.invoice?.invoiceNo || 'N/A',
        patientName: patient
          ? `${patient.firstName} ${patient.lastName}`
          : 'N/A',
        physicianName: physician
          ? `Dr. ${physician.firstName} ${physician.lastName}`
          : 'N/A',
        serviceType: appointment?.service?.name || 'N/A',
        amount: receipt.invoice?.totalAmount || 0,
        paymentMethod: receipt.invoice?.payment?.paymentMethod || 'N/A',
        issueDate: new Date(receipt.issuedAt).toLocaleDateString(),
        receivedBy: receipt.receivedBy || 'N/A',
        status: receipt.invoice?.status || 'N/A',
      });

      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8F9FA' },
        };
      }
    });

    this.addSummarySection(worksheet, receipts, 'Receipts');
    this.addFiltersInfo(worksheet, filters);

    return await workbook.xlsx.writeBuffer();
  }

  static async generateInvoicesReport(invoices: any[], filters: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Invoices Report');

    worksheet.columns = [
      { header: 'Invoice No', key: 'invoiceNo', width: 15 },
      { header: 'Patient Name', key: 'patientName', width: 20 },
      { header: 'Physician Name', key: 'physicianName', width: 20 },
      { header: 'Service Type', key: 'serviceType', width: 20 },
      { header: 'Total Amount', key: 'totalAmount', width: 12 },
      { header: 'Tax', key: 'tax', width: 10 },
      { header: 'Discount', key: 'discount', width: 10 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Issue Date', key: 'issueDate', width: 15 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
    ];

    this.styleHeader(worksheet);

    invoices.forEach((invoice, index) => {
      const appointment = invoice.payment?.appointment;
      const patient = appointment?.patient;
      const physician = appointment?.physician;

      const row = worksheet.addRow({
        invoiceNo: invoice.invoiceNo,
        patientName: patient
          ? `${patient.firstName} ${patient.lastName}`
          : 'N/A',
        physicianName: physician
          ? `Dr. ${physician.firstName} ${physician.lastName}`
          : 'N/A',
        serviceType: appointment?.service?.name || 'N/A',
        totalAmount: invoice.totalAmount,
        tax: invoice.tax,
        discount: invoice.discount,
        status: invoice.status,
        issueDate: new Date(invoice.issuedAt).toLocaleDateString(),
        dueDate: new Date(invoice.dueDate).toLocaleDateString(),
        paymentStatus: invoice.payment?.status || 'N/A',
      });

      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8F9FA' },
        };
      }

      if (invoice.status === 'UNPAID') {
        row.getCell('status').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFEAA7' },
        };
      }
    });

    this.addSummarySection(worksheet, invoices, 'Invoices');
    this.addFiltersInfo(worksheet, filters);

    return await workbook.xlsx.writeBuffer();
  }

  static async generateFinancialReport(data: any) {
    const workbook = new ExcelJS.Workbook();

    const summarySheet = workbook.addWorksheet('Financial Summary');
    const paymentsSheet = workbook.addWorksheet('Payments Detail');
    const revenueSheet = workbook.addWorksheet('Revenue by Service');

    this.createFinancialSummary(summarySheet, data.summary);
    this.createPaymentsDetail(paymentsSheet, data.payments);
    this.createRevenueByService(revenueSheet, data.revenueByService);

    return await workbook.xlsx.writeBuffer();
  }

  static async generatePatientsReport(patients: any[], filters: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Patients Report');

    worksheet.columns = [
      { header: 'Patient ID', key: 'id', width: 12 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Gender', key: 'gender', width: 12 },
      { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
      { header: 'Total Appointments', key: 'totalAppointments', width: 18 },
      { header: 'Total Spent', key: 'totalSpent', width: 15 },
      { header: 'Last Appointment', key: 'lastAppointment', width: 18 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Join Date', key: 'joinDate', width: 15 },
    ];

    this.styleHeader(worksheet);

    patients.forEach((patient, index) => {
      const row = worksheet.addRow({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.user?.email || 'N/A',
        phone: patient.phoneNumber || 'N/A',
        gender: patient.gender,
        dateOfBirth: new Date(patient.dateOfBirth).toLocaleDateString(),
        totalAppointments: patient._count?.appointments || 0,
        totalSpent: patient.totalSpent || 0,
        lastAppointment: patient.lastAppointmentDate
          ? new Date(patient.lastAppointmentDate).toLocaleDateString()
          : 'N/A',
        status: patient.user?.isActive ? 'Active' : 'Inactive',
        joinDate: new Date(patient.createdAt).toLocaleDateString(),
      });

      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8F9FA' },
        };
      }
    });

    this.addSummarySection(worksheet, patients, 'Patients');
    this.addFiltersInfo(worksheet, filters);

    return await workbook.xlsx.writeBuffer();
  }

  static async generatePhysiciansReport(physicians: any[], filters: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Physicians Report');

    worksheet.columns = [
      { header: 'Physician ID', key: 'id', width: 12 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Specialization', key: 'specialization', width: 20 },
      { header: 'License No', key: 'licenseNumber', width: 15 },
      { header: 'Experience (Years)', key: 'experience', width: 18 },
      { header: 'Consultation Fee', key: 'consultationFee', width: 18 },
      { header: 'Total Appointments', key: 'totalAppointments', width: 18 },
      { header: 'Average Rating', key: 'averageRating', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Join Date', key: 'joinDate', width: 15 },
    ];

    this.styleHeader(worksheet);

    physicians.forEach((physician, index) => {
      const row = worksheet.addRow({
        id: physician.id,
        name: `Dr. ${physician.firstName} ${physician.lastName}`,
        email: physician.user?.email || 'N/A',
        specialization: physician.specialization,
        licenseNumber: physician.licenseNumber,
        experience: physician.yearsOfExperience,
        consultationFee: `$${physician.consultationFee}`,
        totalAppointments: physician._count?.appointments || 0,
        averageRating: physician.averageRating || 'N/A',
        status: physician.status,
        joinDate: new Date(physician.createdAt).toLocaleDateString(),
      });

      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8F9FA' },
        };
      }
    });

    this.addSummarySection(worksheet, physicians, 'Physicians');
    this.addFiltersInfo(worksheet, filters);

    return await workbook.xlsx.writeBuffer();
  }

  static async generateAppointmentsReport(appointments: any[], filters: any) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Appointments Report');

    worksheet.columns = [
      { header: 'Appointment ID', key: 'id', width: 15 },
      { header: 'Patient Name', key: 'patientName', width: 20 },
      { header: 'Physician Name', key: 'physicianName', width: 20 },
      { header: 'Service', key: 'service', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 12 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Created At', key: 'createdAt', width: 15 },
    ];

    this.styleHeader(worksheet);

    appointments.forEach((appointment, index) => {
      const patient = appointment.patient;
      const physician = appointment.physician;

      const row = worksheet.addRow({
        id: appointment.id,
        patientName: patient
          ? `${patient.firstName} ${patient.lastName}`
          : 'N/A',
        physicianName: physician
          ? `Dr. ${physician.firstName} ${physician.lastName}`
          : 'N/A',
        service: appointment.service?.name || 'N/A',
        date: new Date(appointment.appointmentDate).toLocaleDateString(),
        time: new Date(appointment.startTime).toLocaleTimeString(),
        type: appointment.consultationType,
        status: appointment.status,
        amount: appointment.payment?.amount || 0,
        createdAt: new Date(appointment.createdAt).toLocaleDateString(),
      });

      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8F9FA' },
        };
      }

      if (appointment.status === 'CANCELLED') {
        row.getCell('status').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFEAA7' },
        };
      }
    });

    this.addSummarySection(worksheet, appointments, 'Appointments');
    this.addFiltersInfo(worksheet, filters);

    return await workbook.xlsx.writeBuffer();
  }

  private static styleHeader(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.getRow(1);
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A90E2' },
    };
    headerRow.font = {
      color: { argb: 'FFFFFFFF' },
      bold: true,
    };
    headerRow.alignment = { horizontal: 'center' };
  }

  private static addSummarySection(
    worksheet: ExcelJS.Worksheet,
    data: any[],
    type: string,
  ) {
    const lastRow = worksheet.rowCount + 2;

    worksheet.mergeCells(`A${lastRow}:I${lastRow}`);
    const summaryTitleRow = worksheet.getRow(lastRow);
    summaryTitleRow.getCell(1).value = `${type} Summary`;
    summaryTitleRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8F4FD' },
    };
    summaryTitleRow.font = { bold: true };

    const summaryData = [
      [`Total ${type}:`, data.length],
      ['Report Generated:', new Date().toLocaleString()],
    ];

    if (type === 'Invoices') {
      const totalAmount = data.reduce(
        (sum, invoice) => sum + Number(invoice.totalAmount || 0),
        0,
      );
      const paidAmount = data
        .filter(invoice => invoice.status === 'PAID')
        .reduce((sum, invoice) => sum + Number(invoice.totalAmount || 0), 0);
      const unpaidAmount = totalAmount - paidAmount;

      summaryData.push(
        ['Total Amount:', `$${totalAmount.toFixed(2)}`],
        ['Paid Amount:', `$${paidAmount.toFixed(2)}`],
        ['Unpaid Amount:', `$${unpaidAmount.toFixed(2)}`],
      );
    }

    if (type === 'Receipts') {
      const totalAmount = data.reduce((sum, receipt) => {
        return sum + Number(receipt.invoice?.totalAmount || 0);
      }, 0);
      summaryData.push(['Total Amount:', `$${totalAmount.toFixed(2)}`]);
    }

    if (type === 'Patients') {
      const totalSpent = data.reduce(
        (sum, patient) => sum + Number(patient.totalSpent || 0),
        0,
      );
      const activePatients = data.filter(p => p.user?.isActive).length;
      summaryData.push(
        ['Total Spent:', `$${totalSpent.toFixed(2)}`],
        ['Active Patients:', activePatients],
      );
    }

    if (type === 'Physicians') {
      const totalAppointments = data.reduce(
        (sum, physician) => sum + Number(physician._count?.appointments || 0),
        0,
      );
      const approvedPhysicians = data.filter(
        p => p.status === 'APPROVED',
      ).length;
      summaryData.push(
        ['Total Appointments:', totalAppointments],
        ['Approved Physicians:', approvedPhysicians],
      );
    }

    if (type === 'Appointments') {
      const completedAppointments = data.filter(
        a => a.status === 'COMPLETED',
      ).length;
      const cancelledAppointments = data.filter(
        a => a.status === 'CANCELLED',
      ).length;
      const totalRevenue = data.reduce(
        (sum, appointment) => sum + Number(appointment.payment?.amount || 0),
        0,
      );
      summaryData.push(
        ['Completed:', completedAppointments],
        ['Cancelled:', cancelledAppointments],
        ['Total Revenue:', `$${totalRevenue.toFixed(2)}`],
      );
    }

    summaryData.forEach((item, index) => {
      const row = worksheet.getRow(lastRow + 1 + index);
      row.getCell(1).value = item[0];
      row.getCell(2).value = item[1];
      row.getCell(1).font = { bold: true };
    });
  }

  private static addFiltersInfo(worksheet: ExcelJS.Worksheet, filters: any) {
    const lastRow = worksheet.rowCount + 2;

    worksheet.mergeCells(`A${lastRow}:I${lastRow}`);
    const filtersRow = worksheet.getRow(lastRow);
    filtersRow.getCell(1).value = 'Applied Filters';
    filtersRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFF3CD' },
    };
    filtersRow.font = { bold: true };

    Object.entries(filters).forEach(([key, value], index) => {
      if (value) {
        const row = worksheet.getRow(lastRow + 1 + index);
        row.getCell(1).value = `${key}:`;
        row.getCell(2).value = String(value);
      }
    });
  }

  private static createFinancialSummary(
    worksheet: ExcelJS.Worksheet,
    summary: any,
  ) {
    worksheet.columns = [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 20 },
    ];

    this.styleHeader(worksheet);

    const summaryData = [
      { metric: 'Total Revenue', value: `$${summary.totalRevenue.toFixed(2)}` },
      { metric: 'Total Payments', value: summary.totalPayments },
      {
        metric: 'Average Order Value',
        value: `$${summary.averageOrderValue.toFixed(2)}`,
      },
      { metric: 'Paid Invoices', value: summary.paidInvoices },
      { metric: 'Unpaid Invoices', value: summary.unpaidInvoices },
      {
        metric: 'Total Tax Collected',
        value: `$${summary.totalTax.toFixed(2)}`,
      },
      {
        metric: 'Total Discounts Given',
        value: `$${summary.totalDiscounts.toFixed(2)}`,
      },
    ];

    summaryData.forEach(item => {
      worksheet.addRow(item);
    });
  }

  private static createPaymentsDetail(
    worksheet: ExcelJS.Worksheet,
    payments: any[],
  ) {
    worksheet.columns = [
      { header: 'Transaction ID', key: 'transactionId', width: 20 },
      { header: 'Patient Name', key: 'patientName', width: 20 },
      { header: 'Physician Name', key: 'physicianName', width: 20 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Method', key: 'method', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Date', key: 'date', width: 15 },
    ];

    this.styleHeader(worksheet);

    payments.forEach(payment => {
      const appointment = payment.appointment;
      const patient = appointment?.patient;
      const physician = appointment?.physician;

      worksheet.addRow({
        transactionId: payment.transactionId || payment.id,
        patientName: patient
          ? `${patient.firstName} ${patient.lastName}`
          : 'N/A',
        physicianName: physician
          ? `Dr. ${physician.firstName} ${physician.lastName}`
          : 'N/A',
        amount: payment.amount,
        method: payment.paymentMethod,
        status: payment.status,
        date: new Date(payment.createdAt).toLocaleDateString(),
      });
    });
  }

  private static createRevenueByService(
    worksheet: ExcelJS.Worksheet,
    revenueData: any[],
  ) {
    worksheet.columns = [
      { header: 'Service Type', key: 'serviceType', width: 25 },
      { header: 'Total Revenue', key: 'revenue', width: 15 },
      { header: 'Number of Orders', key: 'orders', width: 15 },
      { header: 'Average Price', key: 'averagePrice', width: 15 },
    ];

    this.styleHeader(worksheet);

    revenueData.forEach(service => {
      worksheet.addRow({
        serviceType: service.type,
        revenue: service.totalRevenue,
        orders: service.orderCount,
        averagePrice: service.averagePrice,
      });
    });
  }

  static async saveExcelToFile(
    excelBuffer: any,
    filename: string,
  ): Promise<string> {
    const uploadsDir = 'uploads/reports';
    await fs.mkdir(uploadsDir, { recursive: true });

    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, excelBuffer);

    return filepath;
  }
}
