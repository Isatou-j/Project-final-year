/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../lib/prisma';
import { ExcelReportGenerator } from '../utils/excel-generator';

export class ReportingService {
  static async generateFinancialReport(filters: {
    startDate: string;
    endDate: string;
    format: 'excel' | 'json';
  }) {
    const { startDate, endDate } = filters;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [payments, invoices, revenueByService] = await Promise.all([
      prisma.payment.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
          status: 'PAID',
        },
        include: {
          appointment: {
            include: {
              patient: true,
              physician: true,
              service: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.findMany({
        where: {
          issuedAt: {
            gte: start,
            lte: end,
          },
        },
        include: {
          payment: {
            include: {
              appointment: {
                include: {
                  patient: true,
                  physician: true,
                  service: true,
                },
              },
            },
          },
        },
      }),
      prisma.appointment.groupBy({
        by: ['serviceId'],
        _count: { id: true },
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
          status: 'COMPLETED',
        },
        orderBy: { _count: { id: 'desc' } },
      }),
    ]);

    const services = await prisma.service.findMany();
    const revenueByServiceWithDetails = await Promise.all(
      revenueByService.map(async revenue => {
        const service = services.find(s => s.id === revenue.serviceId);
        const servicePayments = await prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            appointment: {
              serviceId: revenue.serviceId,
              status: 'COMPLETED',
              createdAt: { gte: start, lte: end },
            },
            status: 'PAID',
          },
        });

        const totalRevenue = Number(servicePayments._sum.amount || 0);
        return {
          type: service?.name || 'Unknown',
          totalRevenue,
          orderCount: revenue._count.id,
          averagePrice:
            revenue._count.id > 0 ? totalRevenue / revenue._count.id : 0,
        };
      }),
    );

    const summary = {
      totalRevenue: payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      ),
      totalPayments: payments.length,
      averageOrderValue:
        payments.length > 0
          ? payments.reduce((sum, payment) => sum + Number(payment.amount), 0) /
            payments.length
          : 0,
      paidInvoices: invoices.filter(inv => inv.status === 'PAID').length,
      unpaidInvoices: invoices.filter(inv => inv.status === 'UNPAID').length,
      totalTax: invoices.reduce((sum, inv) => sum + Number(inv.tax), 0),
      totalDiscounts: invoices.reduce(
        (sum, inv) => sum + Number(inv.discount),
        0,
      ),
    };

    const reportData = {
      summary,
      payments,
      revenueByService: revenueByServiceWithDetails,
    };

    if (filters.format === 'excel') {
      const excelBuffer =
        await ExcelReportGenerator.generateFinancialReport(reportData);
      const filename = `financial-report-${Date.now()}.xlsx`;
      const filepath = await ExcelReportGenerator.saveExcelToFile(
        excelBuffer,
        filename,
      );

      return {
        buffer: excelBuffer,
        filepath,
        filename,
        format: 'excel',
      };
    }

    return {
      data: reportData,
      format: 'json',
    };
  }

  static async generatePatientsReport(filters: {
    startDate?: string;
    endDate?: string;
    format: 'excel' | 'json';
    status?: 'active' | 'inactive';
  }) {
    const where: any = {
      user: {},
    };

    if (filters.status) {
      where.user.isActive = filters.status === 'active';
    }

    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        user: true,
        appointments: {
          include: {
            payment: true,
          },
        },
        _count: {
          select: {
            appointments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const patientsWithStats = patients.map(patient => ({
      ...patient,
      totalSpent: patient.appointments.reduce(
        (sum, appointment) => sum + Number(appointment.payment?.amount || 0),
        0,
      ),
      lastAppointmentDate:
        patient.appointments.length > 0
          ? new Date(
              Math.max(
                ...patient.appointments.map(a =>
                  new Date(a.appointmentDate).getTime(),
                ),
              ),
            )
          : null,
    }));

    if (filters.format === 'excel') {
      const excelBuffer = await ExcelReportGenerator.generatePatientsReport(
        patientsWithStats,
        filters,
      );
      const filename = `patients-report-${Date.now()}.xlsx`;
      const filepath = await ExcelReportGenerator.saveExcelToFile(
        excelBuffer,
        filename,
      );

      return {
        buffer: excelBuffer,
        filepath,
        filename,
        format: 'excel',
      };
    }

    return {
      data: patientsWithStats,
      format: 'json',
    };
  }

  static async generateServicePerformanceReport(filters: {
    startDate: string;
    endDate: string;
    format: 'excel' | 'json';
  }) {
    const { startDate, endDate } = filters;

    const serviceStats = await prisma.service.findMany({
      include: {
        appointments: {
          where: {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          include: {
            payment: true,
          },
        },
        _count: {
          select: {
            appointments: {
              where: {
                createdAt: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
            },
          },
        },
      },
    });

    const reportData = serviceStats.map(service => ({
      serviceName: service.name,
      description: service.description,
      totalAppointments: service._count.appointments,
      totalRevenue: service.appointments.reduce(
        (sum, appointment) => sum + Number(appointment.payment?.amount || 0),
        0,
      ),
      averageRevenue:
        service._count.appointments > 0
          ? service.appointments.reduce(
              (sum, appointment) =>
                sum + Number(appointment.payment?.amount || 0),
              0,
            ) / service._count.appointments
          : 0,
      completedAppointments: service.appointments.filter(
        a => a.status === 'COMPLETED',
      ).length,
      cancelledAppointments: service.appointments.filter(
        a => a.status === 'CANCELLED',
      ).length,
      conversionRate:
        service._count.appointments > 0
          ? (service.appointments.filter(a => a.status === 'COMPLETED').length /
              service._count.appointments) *
            100
          : 0,
    }));

    if (filters.format === 'excel') {
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Service Performance');

      worksheet.columns = [
        { header: 'Service Name', key: 'serviceName', width: 25 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Total Appointments', key: 'totalAppointments', width: 18 },
        { header: 'Total Revenue', key: 'totalRevenue', width: 15 },
        { header: 'Average Revenue', key: 'averageRevenue', width: 15 },
        { header: 'Completed', key: 'completedAppointments', width: 12 },
        { header: 'Cancelled', key: 'cancelledAppointments', width: 12 },
        { header: 'Conversion Rate %', key: 'conversionRate', width: 15 },
      ];

      reportData.forEach(service => {
        worksheet.addRow(service);
      });

      const excelBuffer = await workbook.xlsx.writeBuffer();
      const filename = `service-performance-${Date.now()}.xlsx`;
      const filepath = await ExcelReportGenerator.saveExcelToFile(
        excelBuffer,
        filename,
      );

      return {
        buffer: excelBuffer,
        filepath,
        filename,
        format: 'excel',
      };
    }

    return {
      data: reportData,
      format: 'json',
    };
  }

  static async getDashboardStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalPatients,
      totalPhysicians,
      totalAppointments,
      monthlyRevenue,
      yearlyRevenue,
      pendingAppointments,
      completedAppointments,
      unpaidInvoices,
      recentPayments,
    ] = await Promise.all([
      prisma.patient.count({ where: { user: { isActive: true } } }),
      prisma.physician.count({ where: { status: 'APPROVED' } }),
      prisma.appointment.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          createdAt: { gte: startOfYear },
        },
      }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
      prisma.invoice.count({ where: { status: 'UNPAID' } }),
      prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          appointment: {
            include: {
              patient: {
                include: { user: true },
              },
              physician: {
                include: { user: true },
              },
              service: true,
            },
          },
        },
      }),
    ]);

    return {
      totalPatients,
      totalPhysicians,
      totalAppointments,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      yearlyRevenue: yearlyRevenue._sum.amount || 0,
      pendingAppointments,
      completedAppointments,
      unpaidInvoices,
      recentPayments,
    };
  }

  static async getMonthlyTrends() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const monthlyData = await prisma.payment.groupBy({
      by: ['createdAt'],
      _sum: { amount: true },
      _count: { id: true },
      where: {
        status: 'PAID',
        createdAt: { gte: oneYearAgo },
      },
      orderBy: { createdAt: 'asc' },
    });

    const monthlyRevenue = Array.from({ length: 12 }, (_, index) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (11 - index));
      const monthData = monthlyData.filter(data => {
        const dataMonth = new Date(data.createdAt);
        return (
          dataMonth.getMonth() === month.getMonth() &&
          dataMonth.getFullYear() === month.getFullYear()
        );
      });

      return {
        month: month.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        revenue: monthData.reduce(
          (sum, data) => sum + Number(data._sum.amount || 0),
          0,
        ),
        bookings: monthData.reduce((sum, data) => sum + data._count.id, 0),
      };
    });

    return monthlyRevenue;
  }
}
