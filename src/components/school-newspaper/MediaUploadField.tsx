
import React, { useState } from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Image, Video, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MediaUploadFieldProps {
  form: any;
  onMediaUpload: (url: string) => void;
}

const MediaUploadField: React.FC<MediaUploadFieldProps> = ({ form, onMediaUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    form.getValues('imageUrl') || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Έλεγχος μεγέθους αρχείου (μέγιστο 5MB)
    if (file.size > 5 * 1024 * 1024) {
      form.setError('imageUrl', {
        type: 'manual',
        message: 'Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 5MB'
      });
      return;
    }

    // Έλεγχος τύπου αρχείου
    const fileType = file.type;
    if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      form.setError('imageUrl', {
        type: 'manual',
        message: 'Μη αποδεκτός τύπος αρχείου. Επιτρέπονται μόνο εικόνες και βίντεο'
      });
      return;
    }

    setIsUploading(true);

    // Δημιουργία URL για προεπισκόπηση
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Simulαte upload and get URL - in a real app this would be an API call
    setTimeout(() => {
      const uploadedUrl = objectUrl;
      form.setValue('imageUrl', uploadedUrl);
      onMediaUpload(uploadedUrl);
      setIsUploading(false);
    }, 1000);
  };

  const handleRemoveMedia = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    form.setValue('imageUrl', '');
    onMediaUpload('');
  };

  const isVideo = previewUrl?.includes('video');

  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Πολυμέσα</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {!previewUrl ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    id="media-upload"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Κάντε κλικ για ανέβασμα εικόνας ή βίντεο
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Υποστηρίζονται αρχεία: JPG, PNG, GIF, MP4 (μέχρι 5MB)
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative border rounded-lg overflow-hidden">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full"
                    onClick={handleRemoveMedia}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  {isVideo ? (
                    <video 
                      src={previewUrl} 
                      controls 
                      className="w-full h-64 object-contain bg-black"
                    />
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Προεπισκόπηση" 
                      className="w-full h-64 object-contain" 
                    />
                  )}
                  
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm",
                    isVideo ? "flex items-center" : "hidden"
                  )}>
                    <Video className="h-4 w-4 mr-2" />
                    Βίντεο
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Ανεβάστε μια εικόνα ή βίντεο για το άρθρο σας
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MediaUploadField;
