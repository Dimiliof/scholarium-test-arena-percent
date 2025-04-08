
import React from 'react';

export interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineItemProps[];
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description }) => {
  return (
    <div className="flex mb-8 relative">
      <div className="flex flex-col items-center mr-4">
        <div className="bg-primary w-3 h-3 rounded-full z-10" />
        <div className="h-full w-0.5 bg-gray-200 absolute top-3 bottom-0 left-1" />
      </div>
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm font-semibold text-gray-500 mb-1">{year}</div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="py-4">
      {events.map((event, index) => (
        <TimelineItem
          key={index}
          year={event.year}
          title={event.title}
          description={event.description}
        />
      ))}
    </div>
  );
};
