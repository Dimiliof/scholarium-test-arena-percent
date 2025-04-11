
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadInput from './FileUploadInput';
import GoogleDriveUploader from './GoogleDriveUploader';
import { AlertCircle, FileUp, HardDrive } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  viewLink: string;
  downloadLink: string;
  iconLink?: string;
  thumbnailLink?: string;
  source: 'google-drive' | 'local';
}

interface UploadTypeSelectionProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDriveFileSelected: (file: DriveFile) => void;
  selectedFile?: File | DriveFile | null;
}

const UploadTypeSelection: React.FC<UploadTypeSelectionProps> = ({ 
  onFileChange, 
  onDriveFileSelected,
  selectedFile 
}) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="local">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="local" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Τοπικό Αρχείο
          </TabsTrigger>
          <TabsTrigger value="drive" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Google Drive
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="local">
          <FileUploadInput onChange={onFileChange} />
        </TabsContent>
        
        <TabsContent value="drive">
          <GoogleDriveUploader onFileSelected={onDriveFileSelected} />
        </TabsContent>
      </Tabs>
      
      {selectedFile && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            {selectedFile instanceof File 
              ? `Επιλεγμένο αρχείο: ${selectedFile.name}`
              : `Επιλεγμένο αρχείο από το Drive: ${(selectedFile as DriveFile).name}`
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UploadTypeSelection;
