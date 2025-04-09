
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResourceViewer from '@/components/resources/ResourceViewer';
import { useParams } from 'react-router-dom';

const ResourceViewPage: React.FC = () => {
  // Βεβαιωνόμαστε ότι έχουμε resourceId
  const { resourceId } = useParams<{ resourceId: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <ResourceViewer />
      </div>
      <Footer />
    </div>
  );
};

export default ResourceViewPage;
