
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePrintResults = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Αποτελέσματα Κουίζ',
    onAfterPrint: () => console.log('Η εκτύπωση ολοκληρώθηκε!'),
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
        }
        .no-print {
          display: none !important;
        }
        .print-container {
          width: 100%;
          padding: 0;
          margin: 0;
        }
        .print-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .question-container {
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        .print-footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #666;
        }
      }
    `,
  });

  return { componentRef, handlePrint };
};
