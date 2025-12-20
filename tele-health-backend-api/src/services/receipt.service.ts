/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../lib/prisma';
import { ReceiptRequest } from '../types/';
import { PDFGenerator } from '../utils/pdf-generator';
import { ExcelReportGenerator } from '../utils/excel-generator';

export const createReceipt = async (data: ReceiptRequest) => {
  return prisma.receipt.create({
    data,
    include: {
      invoice: {
        include: {
          payment: {
            include: {
              appointment: {
                include: {
                  patient: true,
                  physician: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const getAllReceipts = async (options?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
}) => {
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    status,
    search,
  } = options ?? {};

  const skip = (page - 1) * limit;
  const where: any = {};

  if (startDate && endDate) {
    where.issuedAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (status) {
    where.invoice = {
      status,
    };
  }

  if (search) {
    where.OR = [
      { receiptNo: { contains: search, mode: 'insensitive' } },
      { receivedBy: { contains: search, mode: 'insensitive' } },
      { invoice: { invoiceNo: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [receipts, total] = await Promise.all([
    prisma.receipt.findMany({
      where,
      skip,
      take: limit,
      include: {
        invoice: {
          include: {
            payment: {
              include: {
                appointment: {
                  include: {
                    patient: true,
                    physician: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.receipt.count({ where }),
  ]);

  return {
    receipts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getReceiptById = async (id: number) => {
  return prisma.receipt.findUnique({
    where: { id },
    include: {
      invoice: {
        include: {
          payment: {
            include: {
              appointment: {
                include: {
                  patient: true,
                  physician: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const updateReceipt = async (id: number, data: any) => {
  return prisma.receipt.update({
    where: { id },
    data,
    include: {
      invoice: {
        include: {
          payment: {
            include: {
              appointment: {
                include: {
                  patient: true,
                  physician: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const deleteReceipt = async (id: number) => {
  return prisma.receipt.delete({ where: { id } });
};

export const generateReceiptPDF = async (receiptId: number) => {
  const receipt = await getReceiptById(receiptId);

  if (!receipt) {
    throw new Error('Receipt not found');
  }

  const receiptData = {
    receipt,
    invoice: receipt.invoice,
    payment: receipt.invoice?.payment,
    appointment: receipt.invoice?.payment?.appointment,
    patient: receipt.invoice?.payment?.appointment?.patient,
    physician: receipt.invoice?.payment?.appointment?.physician,
  };

  const pdfBuffer = await PDFGenerator.generateReceiptPDF(receiptData);
  const filename = `receipt-${receipt.receiptNo}-${Date.now()}.pdf`;
  const filepath = await PDFGenerator.savePDFToFile(pdfBuffer, filename);

  return {
    pdfBuffer,
    filepath,
    filename,
  };
};

export const generateReceiptsReport = async (filters: {
  format: 'pdf' | 'excel';
  startDate?: string;
  endDate?: string;
  status?: string;
}) => {
  const receipts = await prisma.receipt.findMany({
    where: {
      ...(filters.startDate &&
        filters.endDate && {
          issuedAt: {
            gte: new Date(filters.startDate),
            lte: new Date(filters.endDate),
          },
        }),
      ...(filters.status && {
        invoice: { status: filters.status as any },
      }),
    },
    include: {
      invoice: {
        include: {
          payment: {
            include: {
              appointment: {
                include: {
                  patient: true,
                  physician: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (filters.format === 'excel') {
    const excelBuffer = await ExcelReportGenerator.generateReceiptsReport(
      receipts,
      filters,
    );
    const filename = `receipts-report-${Date.now()}.xlsx`;
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
    data: receipts,
    format: 'json',
  };
};

export const getReceiptStats = async () => {
  const [totalReceipts, totalValue, thisMonth, lastMonth] = await Promise.all([
    prisma.receipt.count(),
    prisma.receipt.aggregate({
      _sum: { id: true },
    }),
    prisma.receipt.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.receipt.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lte: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
        },
      },
    }),
  ]);

  return {
    totalReceipts,
    totalValue: Number(totalValue._sum.id) || 0,
    thisMonth,
    lastMonth,
    growth: lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0,
  };
};
