
  const loadTeacherContent = () => {
    setIsLoading(true);
    
    try {
      let allContent: TeacherContent[] = [];
      
      for (const subject of subjects) {
        for (const quizType of ['basic', 'intermediate', 'advanced', 'quick', 'medium', 'full']) {
          const storageKey = `quiz_${subject.id}_${quizType}`;
          const storedQuestions = localStorage.getItem(storageKey);
          
          if (storedQuestions) {
            try {
              const questions: QuizQuestion[] = JSON.parse(storedQuestions);
              
              const mappedQuestions: TeacherContent[] = questions.map(q => ({
                id: q.id,
                question: q.question,
                subjectId: subject.id,
                quizType: quizType,
                dateAdded: new Date(Date.now()).toLocaleDateString('el-GR'),
              }));
              
              allContent = [...allContent, ...mappedQuestions];
            } catch (e) {
              console.error("Σφάλμα κατά την ανάγνωση των αποθηκευμένων ερωτήσεων:", e);
            }
          }
        }
      }
      
      allContent.sort((a, b) => b.id - a.id);
      
      setContent(allContent);
    } catch (error) {
      console.error("Σφάλμα κατά τη φόρτωση του περιεχομένου:", error);
      toast.error("Σφάλμα κατά τη φόρτωση του περιεχομένου");
    } finally {
      setIsLoading(false);
    }
  };
