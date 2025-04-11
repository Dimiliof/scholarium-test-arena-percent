
import { useState } from 'react';
import { useQuestionManagement } from '@/hooks/useQuestionManagement';
import { useAuth } from '@/contexts/AuthContext';
import { DriveFile } from './UploadTypeSelection';
import { toast } from 'sonner';

interface ResourceFormValues {
  title: string;
  description: string;
  type: string;
  url: string;
  subject: string;
  gradeLevel: string;
  isPublic: boolean;
  file: File | null;
}

export const useResourceSubmit = (onSuccess: () => void) => {
  const { user } = useAuth();
  const { addResource, isLoading } = useQuestionManagement();
  
  const submitResource = (resource: ResourceFormValues, driveFile: DriveFile | null) => {
    let fileUrl = resource.url;
    
    // Αν έχουμε αρχείο, δημιουργούμε ένα URL για αυτό (για λόγους επίδειξης)
    if (resource.file) {
      fileUrl = URL.createObjectURL(resource.file);
    } else if (driveFile) {
      // Αν έχουμε αρχείο από το Drive, χρησιμοποιούμε το downloadLink
      fileUrl = driveFile.downloadLink;
    }
    
    const newResource = {
      title: resource.title,
      description: resource.description,
      type: resource.type as any,
      url: fileUrl,
      subject: resource.subject,
      gradeLevel: resource.gradeLevel,
      isPublic: resource.isPublic,
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Ανώνυμος Εκπαιδευτικός',
      authorEmail: user?.email || '',
      // Προσθήκη μεταδεδομένων για το Google Drive αν υπάρχει
      driveFileId: driveFile?.id || null,
      driveFileName: driveFile?.name || null,
      driveFileThumbnail: driveFile?.thumbnailLink || null,
    };
    
    const resourceId = addResource(newResource);
    
    if (resourceId) {
      toast.success("Ο εκπαιδευτικός πόρος προστέθηκε επιτυχώς!");
      onSuccess();
      return true;
    }
    
    return false;
  };
  
  return {
    submitResource,
    isLoading
  };
};
