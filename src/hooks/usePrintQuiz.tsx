
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { QuizQuestion } from '@/lib/subjectsData';

export const usePrintQuiz = () => {
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Διαγώνισμα',
    onAfterPrint: () => console.log('Η εκτύπωση του διαγωνίσματος ολοκληρώθηκε!'),
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
        .quiz-controls, .progress-indicator {
          display: none !important;
        }
        .options-label {
          font-weight: bold;
          margin-bottom: 5px;
        }
      }
    `,
  });

  // Λειτουργία για την εκτύπωση του κουίζ
  const printQuiz = (questions: QuizQuestion[]) => {
    // Δημιουργία προσωρινού div για την εκτύπωση
    const printContent = document.createElement('div');
    printContent.className = 'print-container';
    
    // Προσθήκη του header
    const header = document.createElement('div');
    header.className = 'print-header';
    header.innerHTML = `
      <h1>Διαγώνισμα</h1>
      <p>Ημερομηνία: ${new Date().toLocaleDateString('el-GR')}</p>
    `;
    printContent.appendChild(header);
    
    // Προσθήκη των ερωτήσεων
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.className = 'question-container';
      questionElement.innerHTML = `
        <p><strong>${index + 1}. ${question.question}</strong></p>
        <div class="options">
          ${question.options.map((option, optionIndex) => `
            <div class="option">
              ${String.fromCharCode(65 + optionIndex)}. ${option}
            </div>
          `).join('')}
        </div>
      `;
      printContent.appendChild(questionElement);
    });
    
    // Προσθήκη στο DOM και έπειτα εκτύπωση
    if (componentRef.current) {
      componentRef.current.innerHTML = '';
      componentRef.current.appendChild(printContent);
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  };

  return { componentRef, handlePrint, printQuiz };
};
