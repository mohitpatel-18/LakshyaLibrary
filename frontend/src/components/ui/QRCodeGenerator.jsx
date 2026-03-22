import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { motion } from 'framer-motion';
import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { GlassCard } from './GlassCard';

export const QRCodeGenerator = ({ value, studentId, name }) => {
  const [showQR, setShowQR] = useState(false);

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${studentId}`);
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${studentId}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <QrCodeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Student QR Code</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{name}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQR(!showQR)}
          className="px-4 py-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg font-medium"
        >
          {showQR ? 'Hide' : 'Show'} QR
        </motion.button>
      </div>

      {showQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="bg-white p-4 rounded-xl">
            <QRCode
              id={`qr-${studentId}`}
              value={value || `STUDENT:${studentId}`}
              size={200}
              level="H"
              includeMargin
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadQR}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download QR Code
          </motion.button>
        </motion.div>
      )}
    </GlassCard>
  );
};

export default QRCodeGenerator;
