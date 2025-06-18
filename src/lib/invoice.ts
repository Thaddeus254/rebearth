import jsPDF from 'jspdf';
import { supabase } from './supabase';

export interface InvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
}

// Generate random invoice number
export const generateInvoiceNumber = (): string => {
  const prefix = 'RB';
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp.slice(-6)}${random}`;
};

// Create invoice in database
export const createInvoice = async (invoiceData: InvoiceData) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceData.invoiceNumber,
      customer_name: invoiceData.customerName,
      customer_email: invoiceData.customerEmail,
      customer_phone: invoiceData.customerPhone,
      customer_address: invoiceData.customerAddress,
      items: invoiceData.items,
      total_amount: invoiceData.totalAmount,
      status: invoiceData.status,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create invoice: ${error.message}`);
  }

  return data;
};

// Update invoice status
export const updateInvoiceStatus = async (invoiceId: string, status: 'pending' | 'paid' | 'cancelled') => {
  const { data, error } = await supabase
    .from('invoices')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', invoiceId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update invoice: ${error.message}`);
  }

  return data;
};

// Generate PDF invoice
export const generateInvoicePDF = (invoiceData: InvoiceData, type: 'invoice' | 'receipt' = 'invoice'): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('REBEARTH SOLUTIONS LIMITED', pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Agricultural Solutions & Services', pageWidth / 2, 40, { align: 'center' });
  doc.text('P.O. Box 72-49305, Kisumu, Kenya', pageWidth / 2, 50, { align: 'center' });
  doc.text('Phone: +254706169776 | Email: info@rebearthsolutions.com', pageWidth / 2, 60, { align: 'center' });
  
  // Invoice/Receipt title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const title = type === 'invoice' ? 'INVOICE' : 'RECEIPT';
  doc.text(title, pageWidth / 2, 80, { align: 'center' });
  
  // Invoice details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${title} #: ${invoiceData.invoiceNumber}`, 20, 100);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 110);
  doc.text(`Status: ${invoiceData.status.toUpperCase()}`, 20, 120);
  
  // Customer details
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 20, 140);
  doc.setFont('helvetica', 'normal');
  doc.text(invoiceData.customerName, 20, 150);
  doc.text(invoiceData.customerEmail, 20, 160);
  doc.text(invoiceData.customerPhone, 20, 170);
  doc.text(invoiceData.customerAddress, 20, 180);
  
  // Items table header
  let yPosition = 200;
  doc.setFont('helvetica', 'bold');
  doc.text('ITEM', 20, yPosition);
  doc.text('QTY', 120, yPosition);
  doc.text('PRICE', 140, yPosition);
  doc.text('TOTAL', 170, yPosition);
  
  // Draw line under header
  doc.line(20, yPosition + 5, 190, yPosition + 5);
  
  // Items
  doc.setFont('helvetica', 'normal');
  yPosition += 15;
  
  invoiceData.items.forEach((item) => {
    doc.text(item.name, 20, yPosition);
    doc.text(item.quantity.toString(), 120, yPosition);
    doc.text(`KES ${item.price.toLocaleString()}`, 140, yPosition);
    doc.text(`KES ${item.total.toLocaleString()}`, 170, yPosition);
    yPosition += 10;
  });
  
  // Total
  yPosition += 10;
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT:', 140, yPosition);
  doc.text(`KES ${invoiceData.totalAmount.toLocaleString()}`, 170, yPosition);
  
  // Footer
  yPosition += 30;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing Rebearth Solutions Limited!', pageWidth / 2, yPosition, { align: 'center' });
  doc.text('For any inquiries, please contact us at info@rebearthsolutions.com', pageWidth / 2, yPosition + 10, { align: 'center' });
  
  if (type === 'receipt') {
    doc.text('This is a computer-generated receipt. No signature required.', pageWidth / 2, yPosition + 20, { align: 'center' });
  }
  
  return doc;
};

// Download invoice/receipt
export const downloadInvoice = (invoiceData: InvoiceData, type: 'invoice' | 'receipt' = 'invoice') => {
  const doc = generateInvoicePDF(invoiceData, type);
  const filename = `${type}_${invoiceData.invoiceNumber}.pdf`;
  doc.save(filename);
};