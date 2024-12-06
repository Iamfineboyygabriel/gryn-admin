// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Add functions to expose here
});
