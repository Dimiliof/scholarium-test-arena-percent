
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";

interface EcdlVideoDemoProps {
  embedded?: boolean;
}

const EcdlVideoDemo = ({ embedded = false }: EcdlVideoDemoProps) => {
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    if (!embedded) {
      navigate('/subject/ecdl-word');
    } else {
      window.open('https://edupercentage.com/subject/ecdl-word', '_blank');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <Card className="w-full shadow-lg border-2 border-primary/20 overflow-hidden">
        <CardContent className="p-0">
          <div className="aspect-video bg-black relative">
            <iframe 
              className="w-full h-full absolute inset-0"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0&showinfo=0" 
              title="ECDL Simulation Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold mb-2">Προσομοίωση ECDL</h3>
            <p className="text-gray-600 mb-4">
              Παρακολουθήστε πώς λειτουργούν οι προσομοιώσεις ECDL στην πλατφόρμα μας για τις ενότητες Word, Excel και PowerPoint.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleNavigate} className="flex items-center gap-2">
                Δοκιμάστε το ECDL
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {embedded && (
        <div className="mt-2 text-center">
          <a href="https://edupercentage.com" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">
            Powered by EduPercentage
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default EcdlVideoDemo;
