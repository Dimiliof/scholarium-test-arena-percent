
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { QuizQuestion } from '@/lib/subjectsData';

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

  // Λειτουργία για την εκτύπωση των αποτελεσμάτων
  const printResults = (
    subjectName: string,
    quizType: string,
    questions: QuizQuestion[],
    userAnswers: number[],
    score: number
  ) => {
    // Υπολογισμός των σωστών απαντήσεων
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    
    // Δημιουργία προσωρινού div για την εκτύπωση
    const printContent = document.createElement('div');
    printContent.className = 'print-container';
    
    // Προσθήκη του header
    const header = document.createElement('div');
    header.className = 'print-header';
    header.innerHTML = `
      <h1>${subjectName} - ${quizType}</h1>
      <p>Ημερομηνία: ${new Date().toLocaleDateString('el-GR')}</p>
      <div style="margin: 20px 0; text-align: center;">
        <h2>Σύνοψη Αποτελεσμάτων</h2>
        <p style="font-size: 24px; margin: 10px 0;">
          <strong>${correctAnswers}/${questions.length}</strong> σωστές απαντήσεις
        </p>
        <p style="font-size: 24px; color: ${getScoreColor(score)}">
          <strong>${score}%</strong> - ${getGradeText(score)}
        </p>
      </div>
    `;
    printContent.appendChild(header);
    
    // Προσθήκη των ερωτήσεων και απαντήσεων
    const questionsContainer = document.createElement('div');
    questions.forEach((question, index) => {
      const isCorrect = userAnswers[index] === question.correctAnswer;
      
      const questionElement = document.createElement('div');
      questionElement.className = 'question-container';
      questionElement.style.borderLeft = isCorrect 
        ? '4px solid #22c55e' // Πράσινο για σωστή
        : '4px solid #ef4444'; // Κόκκινο για λάθος
      questionElement.style.padding = '10px';
      questionElement.style.marginBottom = '15px';
      
      questionElement.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 8px;">${index + 1}. ${question.question}</p>
        <div class="options">
          ${question.options.map((option, optionIndex) => {
            let style = '';
            if (optionIndex === question.correctAnswer) {
              style = 'color: #22c55e; font-weight: bold;'; // Πράσινο για σωστή
            } else if (optionIndex === userAnswers[index] && optionIndex !== question.correctAnswer) {
              style = 'color: #ef4444; text-decoration: line-through;'; // Κόκκινο για λάθος επιλογή
            }
            
            return `
              <div style="${style}; margin: 5px 0; padding: 5px;">
                ${String.fromCharCode(65 + optionIndex)}. ${option}
                ${optionIndex === question.correctAnswer ? ' ✓' : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
      questionsContainer.appendChild(questionElement);
    });
    
    printContent.appendChild(questionsContainer);
    
    // Προσθήκη του footer
    const footer = document.createElement('div');
    footer.className = 'print-footer';
    footer.innerHTML = `<p>© ${new Date().getFullYear()} - Εκπαιδευτική Πλατφόρμα</p>`;
    printContent.appendChild(footer);
    
    // Προσθήκη στο DOM και έπειτα εκτύπωση
    if (componentRef.current) {
      componentRef.current.innerHTML = '';
      componentRef.current.appendChild(printContent);
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  };

  // Βοηθητικές συναρτήσεις
  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#22c55e'; // πράσινο
    if (score >= 80) return '#16a34a'; // πράσινο πιο σκούρο
    if (score >= 70) return '#2563eb'; // μπλε
    if (score >= 60) return '#eab308'; // κίτρινο
    if (score >= 50) return '#f97316'; // πορτοκαλί
    return '#ef4444'; // κόκκινο
  };

  const getGradeText = (score: number): string => {
    if (score >= 90) return 'Άριστα';
    if (score >= 80) return 'Πολύ καλά';
    if (score >= 70) return 'Καλά';
    if (score >= 60) return 'Μέτρια';
    if (score >= 50) return 'Επαρκώς';
    return 'Ανεπαρκώς';
  };

  return { componentRef, handlePrint, printResults };
};
