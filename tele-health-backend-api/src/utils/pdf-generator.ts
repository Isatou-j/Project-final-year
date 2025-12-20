/* eslint-disable @typescript-eslint/no-explicit-any */
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

export class PDFGenerator {
  private static browser: any = null;

  static async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  static async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  static async generateReceiptPDF(receiptData: any): Promise<Buffer> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    const html = this.generateReceiptHTML(receiptData);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await page.close();
    return pdf;
  }

  static async generateInvoicePDF(invoiceData: any): Promise<Buffer> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    const html = this.generateInvoiceHTML(invoiceData);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await page.close();
    return pdf;
  }

  private static generateReceiptHTML(receiptData: any): string {
    const { receipt, invoice, payment, booking, user, service } = receiptData;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt - ${receipt.receiptNo}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4A90E2;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #4A90E2;
            margin-bottom: 5px;
          }
          .document-title {
            font-size: 24px;
            color: #666;
            margin-top: 10px;
          }
          .content {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .left-column, .right-column {
            width: 48%;
          }
          .info-section {
            margin-bottom: 20px;
          }
          .info-title {
            font-weight: bold;
            color: #4A90E2;
            margin-bottom: 8px;
            border-bottom: 1px solid #eee;
            padding-bottom: 4px;
          }
          .info-item {
            margin-bottom: 5px;
          }
          .amount-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .amount-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .total-amount {
            font-size: 18px;
            font-weight: bold;
            color: #4A90E2;
            border-top: 2px solid #4A90E2;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status.paid {
            background: #d4edda;
            color: #155724;
          }
          .qr-section {
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Tyler's Laundry Service</div>
          <div style="color: #666; margin: 5px 0;">Professional Laundry & Dry Cleaning</div>
          <div class="document-title">RECEIPT</div>
        </div>

        <div class="content">
          <div class="left-column">
            <div class="info-section">
              <div class="info-title">Receipt Information</div>
              <div class="info-item"><strong>Receipt No:</strong> ${receipt.receiptNo}</div>
              <div class="info-item"><strong>Issue Date:</strong> ${new Date(receipt.issuedAt).toLocaleDateString()}</div>
              <div class="info-item"><strong>Invoice No:</strong> ${invoice.invoiceNo}</div>
              ${receipt.receivedBy ? `<div class="info-item"><strong>Received By:</strong> ${receipt.receivedBy}</div>` : ''}
            </div>

            <div class="info-section">
              <div class="info-title">Customer Information</div>
              <div class="info-item"><strong>Name:</strong> ${user.name}</div>
              <div class="info-item"><strong>Email:</strong> ${user.email}</div>
              ${user.phone ? `<div class="info-item"><strong>Phone:</strong> ${user.phone}</div>` : ''}
            </div>
          </div>

          <div class="right-column">
            <div class="info-section">
              <div class="info-title">Service Details</div>
              <div class="info-item"><strong>Service:</strong> ${service.type}</div>
              ${service.description ? `<div class="info-item"><strong>Description:</strong> ${service.description}</div>` : ''}
              <div class="info-item"><strong>Booking Date:</strong> ${new Date(booking.date).toLocaleDateString()}</div>
              <div class="info-item"><strong>Status:</strong> <span class="status paid">${booking.status}</span></div>
            </div>

            <div class="info-section">
              <div class="info-title">Payment Information</div>
              <div class="info-item"><strong>Method:</strong> ${payment.method}</div>
              <div class="info-item"><strong>Transaction ID:</strong> ${payment.transactionId}</div>
              <div class="info-item"><strong>Status:</strong> <span class="status paid">${payment.status}</span></div>
            </div>
          </div>
        </div>

        <div class="amount-section">
          <div class="amount-row">
            <span>Service Amount:</span>
            <span>$${Number(booking.totalAmount - booking.deliveryFee).toFixed(2)}</span>
          </div>
          <div class="amount-row">
            <span>Delivery Fee:</span>
            <span>$${Number(booking.deliveryFee).toFixed(2)}</span>
          </div>
          <div class="amount-row">
            <span>Tax:</span>
            <span>$${Number(invoice.tax).toFixed(2)}</span>
          </div>
          ${
            Number(invoice.discount) > 0
              ? `
          <div class="amount-row">
            <span>Discount:</span>
            <span>-$${Number(invoice.discount).toFixed(2)}</span>
          </div>
          `
              : ''
          }
          <div class="amount-row total-amount">
            <span>Total Paid:</span>
            <span>$${Number(payment.amount).toFixed(2)}</span>
          </div>
        </div>

        ${
          receipt.notes
            ? `
        <div class="info-section">
          <div class="info-title">Notes</div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${receipt.notes}
          </div>
        </div>
        `
            : ''
        }

        <div class="footer">
          <p><strong>Thank you for choosing Tyler's Laundry Service!</strong></p>
          <p>For questions about this receipt, please contact us at support@tylerslaundry.com</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  }

  private static generateInvoiceHTML(invoiceData: any): string {
    const { invoice, payment, booking, user, service } = invoiceData;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${invoice.invoiceNo}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #E74C3C;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #E74C3C;
            margin-bottom: 5px;
          }
          .document-title {
            font-size: 24px;
            color: #666;
            margin-top: 10px;
          }
          .content {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .left-column, .right-column {
            width: 48%;
          }
          .info-section {
            margin-bottom: 20px;
          }
          .info-title {
            font-weight: bold;
            color: #E74C3C;
            margin-bottom: 8px;
            border-bottom: 1px solid #eee;
            padding-bottom: 4px;
          }
          .info-item {
            margin-bottom: 5px;
          }
          .amount-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .amount-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .total-amount {
            font-size: 18px;
            font-weight: bold;
            color: #E74C3C;
            border-top: 2px solid #E74C3C;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status.paid {
            background: #d4edda;
            color: #155724;
          }
          .status.unpaid {
            background: #f8d7da;
            color: #721c24;
          }
          .due-date {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Tyler's Laundry Service</div>
          <div style="color: #666; margin: 5px 0;">Professional Laundry & Dry Cleaning</div>
          <div class="document-title">INVOICE</div>
        </div>

        <div class="content">
          <div class="left-column">
            <div class="info-section">
              <div class="info-title">Invoice Information</div>
              <div class="info-item"><strong>Invoice No:</strong> ${invoice.invoiceNo}</div>
              <div class="info-item"><strong>Issue Date:</strong> ${new Date(invoice.issuedAt).toLocaleDateString()}</div>
              <div class="info-item"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</div>
              <div class="info-item"><strong>Status:</strong> <span class="status ${invoice.status.toLowerCase()}">${invoice.status}</span></div>
            </div>

            <div class="info-section">
              <div class="info-title">Customer Information</div>
              <div class="info-item"><strong>Name:</strong> ${user.name}</div>
              <div class="info-item"><strong>Email:</strong> ${user.email}</div>
              ${user.phone ? `<div class="info-item"><strong>Phone:</strong> ${user.phone}</div>` : ''}
              ${user.address ? `<div class="info-item"><strong>Address:</strong> ${user.address}</div>` : ''}
            </div>
          </div>

          <div class="right-column">
            <div class="info-section">
              <div class="info-title">Service Details</div>
              <div class="info-item"><strong>Service:</strong> ${service.type}</div>
              ${service.description ? `<div class="info-item"><strong>Description:</strong> ${service.description}</div>` : ''}
              <div class="info-item"><strong>Booking Date:</strong> ${new Date(booking.date).toLocaleDateString()}</div>
              <div class="info-item"><strong>Pickup Address:</strong> ${booking.pickupAddress}</div>
              <div class="info-item"><strong>Delivery Address:</strong> ${booking.deliveryAddress}</div>
            </div>

            ${
              payment
                ? `
            <div class="info-section">
              <div class="info-title">Payment Information</div>
              <div class="info-item"><strong>Method:</strong> ${payment.method}</div>
              <div class="info-item"><strong>Transaction ID:</strong> ${payment.transactionId}</div>
              <div class="info-item"><strong>Status:</strong> <span class="status ${payment.status.toLowerCase()}">${payment.status}</span></div>
            </div>
            `
                : ''
            }
          </div>
        </div>

        ${
          invoice.status === 'UNPAID'
            ? `
        <div class="due-date">
          <strong>⚠️ Payment Due: ${new Date(invoice.dueDate).toLocaleDateString()}</strong>
          <br>Please ensure payment is made by the due date to avoid late fees.
        </div>
        `
            : ''
        }

        <div class="amount-section">
          <div class="amount-row">
            <span>Service Amount:</span>
            <span>$${Number(booking.totalAmount - booking.deliveryFee).toFixed(2)}</span>
          </div>
          <div class="amount-row">
            <span>Delivery Fee:</span>
            <span>$${Number(booking.deliveryFee).toFixed(2)}</span>
          </div>
          <div class="amount-row">
            <span>Tax:</span>
            <span>$${Number(invoice.tax).toFixed(2)}</span>
          </div>
          ${
            Number(invoice.discount) > 0
              ? `
          <div class="amount-row">
            <span>Discount:</span>
            <span>-$${Number(invoice.discount).toFixed(2)}</span>
          </div>
          `
              : ''
          }
          <div class="amount-row total-amount">
            <span>Total Amount:</span>
            <span>$${Number(invoice.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p><strong>Tyler's Laundry Service</strong></p>
          <p>For questions about this invoice, please contact us at billing@tylerslaundry.com</p>
          <p>Payment can be made online at www.tylerslaundry.com/pay</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  }

  static async savePDFToFile(
    pdfBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const uploadsDir = 'uploads/documents';
    await fs.mkdir(uploadsDir, { recursive: true });

    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, pdfBuffer);

    return filepath;
  }
}
