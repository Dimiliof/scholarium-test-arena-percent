
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ForumDiscussion from '@/components/forum/ForumDiscussion';

const ForumPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        <ForumDiscussion subjectId={subjectId} />
      </div>
      <Footer />
    </div>
  );
};

export default ForumPage;
