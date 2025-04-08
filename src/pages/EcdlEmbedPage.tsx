
import React from 'react';
import EcdlVideoDemo from '@/components/home/EcdlVideoDemo';

const EcdlEmbedPage = () => {
  return (
    <div className="p-4">
      <EcdlVideoDemo embedded={true} />
    </div>
  );
};

export default EcdlEmbedPage;
