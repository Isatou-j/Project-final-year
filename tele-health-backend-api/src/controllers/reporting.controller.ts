/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { ReportingService } from '../services/reporting.service';

export const getDashboardStatsController = async (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const stats = await ReportingService.getDashboardStats();

    res.status(200).json({
      message: 'Dashboard statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getFinancialReportController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const format = (req.query.format as 'json' | 'excel') || 'json';

    const result = await ReportingService.generateFinancialReport({
      startDate,
      endDate,
      format,
    });

    if (result.format === 'excel') {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${result.filename}"`,
      );
      res.send(result.buffer);
    } else {
      res.status(200).json({
        message: 'Financial report generated successfully',
        data: result.data,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getServicePerformanceController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const format = (req.query.format as 'json' | 'excel') || 'json';

    const result = await ReportingService.generateServicePerformanceReport({
      startDate,
      endDate,
      format,
    });

    if (result.format === 'excel') {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${result.filename}"`,
      );
      res.send(result.buffer);
    } else {
      res.status(200).json({
        message: 'Service performance report generated successfully',
        data: result.data,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTrendsController = async (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const trends = await ReportingService.getMonthlyTrends();

    res.status(200).json({
      message: 'Monthly trends report generated successfully',
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientsReportController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const format = (req.query.format as 'json' | 'excel') || 'json';
    const status = req.query.status as 'active' | 'inactive' | undefined;

    const result = await ReportingService.generatePatientsReport({
      startDate,
      endDate,
      format,
      status,
    });

    if (result.format === 'excel') {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${result.filename}"`,
      );
      res.send(result.buffer);
    } else {
      res.status(200).json({
        message: 'Patients report generated successfully',
        data: result.data,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const generateScheduledReportsController = async (
  _: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    // For now, we'll manually trigger the main reports
    const dashboardStats = await ReportingService.getDashboardStats();
    const monthlyTrends = await ReportingService.getMonthlyTrends();

    res.status(200).json({
      message: 'Reports generated successfully',
      data: {
        dashboardStats,
        monthlyTrends,
      },
    });
  } catch (error) {
    next(error);
  }
};
