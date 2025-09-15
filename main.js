const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const db = require('./db/db');
const fs = require('fs');
const PDFDocument = require('pdfkit');
function createWindow () {
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile('index.html');
  if (isDev) {
    win.webContents.openDevTools();
  }
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
ipcMain.handle('load-menu', async () => {
  return db.getMenu();
});
ipcMain.handle('save-invoice', async (event, invoice) => {
  const created_at = new Date().toISOString();
  const total = invoice.total;
  const data = JSON.stringify(invoice);
  const id = db.saveInvoice(created_at, total, data);
  return { id, created_at };
});
ipcMain.handle('export-pdf', async (event, invoice) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Export Invoice PDF',
    defaultPath: `invoice-${invoice.id || Date.now()}.pdf`,
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (canceled) return { canceled: true };
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${invoice.id || ''}`);
  doc.text(`Date: ${new Date().toLocaleString()}`);
  doc.moveDown();
  invoice.items.forEach(it => {
    doc.text(`${it.name} x${it.qty} - ₹${(it.price*it.qty).toFixed(2)}`);
  });
  doc.moveDown();
  doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)}`);
  doc.text(`Tax: ₹${invoice.tax.toFixed(2)}`);
  doc.text(`Total: ₹${invoice.total.toFixed(2)}`);
  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve({ canceled: false, filePath }));
    stream.on('error', (err) => reject(err));
  });
});
