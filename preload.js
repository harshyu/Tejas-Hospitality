const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  loadMenu: () => ipcRenderer.invoke('load-menu'),
  saveInvoice: (invoice) => ipcRenderer.invoke('save-invoice', invoice),
  exportPdf: (invoice) => ipcRenderer.invoke('export-pdf', invoice)
});
