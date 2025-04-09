
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResourceViewer from '@/components/resources/ResourceViewer';

const ResourceViewPage: React.FC = () => {
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
