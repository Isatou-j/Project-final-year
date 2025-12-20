/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../lib/prisma';
import { PDFGenerator } from '../utils/pdf-generator';
import { ExcelReportGenerator } from '../utils/excel-generator';

interface InvoiceRequest {
  paymentId: number;
  invoiceNo: string;
  totalAmount: number;
  tax: number;
  discount: number;
  issuedAt: Date;
  dueDate: Date;
  status?: 'PAID' | 'UNPAID' | 'CANCELLED';
}

export const createInvoice = async (data: InvoiceRequest) => {
  return prisma.invoice.create({
    data,
    include: {
      payment: {
        include: {
          appointment: {
            include: {
              patient: { include: { user: true } },
              physician: { include: { user: true } },
              service: true,
            },
          },
        },
      },
      receipt: true,
    },
  });
};

export const getAllInvoices = async (options?: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) => {
  const {
    page = 1,
    limit = 10,
    status,
    startDate,
    endDate,
    search,
  } = options ?? {};

  const skip = (page - 1) * limit;
  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (startDate && endDate) {
    where.issuedAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (search) {
    where.OR = [
      { invoiceNo: { contains: search, mode: 'insensitive' } },
      {
        payment: {
          appointment: {
            patient: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      },
      {
        payment: {
          appointment: {
            patient: {
              user: { email: { contains: search, mode: 'insensitive' } },
            },
          },
        },
      },
    ];
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      skip,
      take: limit,
      include: {
        payment: {
          include: {
            appointment: {
              include: {
                patient: { include: { user: true } },
                physician: { include: { user: true } },
                service: true,
              },
            },
          },
        },
        receipt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.count({ where }),
  ]);

  return {
    invoices,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getInvoiceById = async (id: number) => {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      payment: {
        include: {
          appointment: {
            include: {
              patient: { include: { user: true } },
              physician: { include: { user: true } },
              service: true,
            },
          },
        },
      },
      receipt: true,
    },
  });
};

export const updateInvoice = async (id: number, data: any) => {
  return prisma.invoice.update({
    where: { id },
    data,
    include: {
      payment: {
        include: {
          appointment: {
            include: {
              patient: { include: { user: true } },
              physician: { include: { user: true } },
              service: true,
            },
          },
        },
      },
      receipt: true,
    },
  });
};

export const deleteInvoice = async (id: number) => {
  return prisma.invoice.delete({ where: { id } });
};

export const generateInvoicePDF = async (invoiceId: number) => {
  const invoice = await getInvoiceById(invoiceId);

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const appointment = invoice.payment?.appointment;
  const patient = appointment?.patient;
  const physician = appointment?.physician;

  const invoiceData = {
    invoice,
    payment: invoice.payment,
    appointment,
    patient,
    physician,
    user: patient?.user,
    service: appointment?.service,
  };

  const pdfBuffer = await PDFGenerator.generateInvoicePDF(invoiceData);
  const filename = `invoice-${invoice.invoiceNo}-${Date.now()}.pdf`;
  const filepath = await PDFGenerator.savePDFToFile(pdfBuffer, filename);

  return {
    pdfBuffer,
    filepath,
    filename,
  };
};

export const generateInvoicesReport = async (filters: {
  format: 'pdf' | 'excel';
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const invoices = await prisma.invoice.findMany({
    where: {
      ...(filters.status && { status: filters.status as any }),
      ...(filters.startDate &&
        filters.endDate && {
          issuedAt: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate),
          },
        }),
    },
    include: {
      payment: {
        include: {
          appointment: {
            include: {
              patient: { include: { user: true } },
              physician: { include: { user: true } },
              service: true,
            },
          },
        },
      },
      receipt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (filters.format === 'excel') {
    const excelBuffer = await ExcelReportGenerator.generateInvoicesReport(
      invoices,
      filters,
    );
    const filename = `invoices-report-${Date.now()}.xlsx`;
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
    data: invoices,
    format: 'json',
  };
};

export const getOverdueInvoices = async (options: {
  page?: number;
  limit?: number;
}) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        status: 'UNPAID',
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        payment: {
          include: {
            appointment: {
              include: {
                patient: {
                  include: {
                    user: true,
                  },
                },
                physician: {
                  include: {
                    user: true,
                  },
                },
                service: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { dueDate: 'asc' },
    }),
    prisma.invoice.count({
      where: {
        status: 'UNPAID',
        dueDate: {
          lt: new Date(),
        },
      },
    }),
  ]);

  return {
    invoices,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getInvoiceStats = async () => {
  const [
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
    overdueInvoices,
    totalRevenue,
    unpaidAmount,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: 'PAID' } }),
    prisma.invoice.count({ where: { status: 'UNPAID' } }),
    prisma.invoice.count({
      where: {
        status: 'UNPAID',
        dueDate: { lt: new Date() },
      },
    }),
    prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PAID' },
    }),
    prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'UNPAID' },
    }),
    prisma.invoice.groupBy({
      by: ['issuedAt'],
      _sum: { totalAmount: true },
      _count: { id: true },
      where: {
        status: 'PAID',
        issuedAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 11,
            1,
          ),
        },
      },
      orderBy: { issuedAt: 'asc' },
    }),
  ]);

  return {
    totalInvoices,
    paidInvoices,
    unpaidInvoices,
    overdueInvoices,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    unpaidAmount: unpaidAmount._sum.totalAmount || 0,
    monthlyRevenue,
  };
};

export const markInvoiceAsPaid = async (invoiceId: number) => {
  return prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: 'PAID' },
    include: {
      payment: {
        include: {
          appointment: {
            include: {
              patient: {
                include: {
                  user: true,
                },
              },
              physician: {
                include: {
                  user: true,
                },
              },
              service: true,
            },
          },
        },
      },
      receipt: true,
    },
  });
};
