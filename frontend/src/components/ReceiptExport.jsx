import { FileText, Download, Share2, Mail, Bird } from 'lucide-react';
import { useUiContext } from '../context/UiContext';

const downloadText = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const generatePDF = async (content) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Coffee by Conduit - Receipt</title>
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }

          body {
            font-family: monospace;
            background-color: #111827; /* gray-900 */
            color: #f3f4f6; /* gray-100 */
            padding: 2rem;
            min-height: 100vh;
            margin: 0;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #1f2937; /* gray-800 */
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          pre {
            white-space: pre-wrap;
            margin: 0;
            font-size: 0.875rem;
            line-height: 1.5;
          }

          @media screen {
            /* Styles for screen preview */
            html { background-color: #111827; }
          }

          @media print {
            /* Styles for PDF */
            body, html { background-color: #111827 !important; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <pre>${content}</pre>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

const ReceiptExport = ({ receipt }) => {
  const { openNostrModal, openEmailModal } = useUiContext();

  const handleTextExport = () => {
    const filename = `coffee-by-conduit-receipt-${Date.now()}.txt`;
    downloadText(receipt, filename);
  };

  const handlePDFExport = () => {
    generatePDF(receipt);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Coffee by Conduit Receipt',
          text: receipt,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <h5 className="text-gray-400 w-full text-center mb-4">Save Receipt</h5>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleTextExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
        >
          <FileText className="w-4 h-4" />
          <span>Plain Text</span>
        </button>

        <button
          onClick={handlePDFExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
        >
          <Download className="w-4 h-4" />
          <span>PDF</span>
        </button>

        <button
          onClick={() => openEmailModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
        >
          <Mail className="w-4 h-4" />
          <span>Email</span>
        </button>

          <button
            onClick={() => openNostrModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
            >
            <Bird className="w-4 h-4" />
            <span>Nostr</span>
            </button>

        {navigator.share && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReceiptExport;
