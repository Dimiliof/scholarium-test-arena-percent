
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileImageDialogProps = {
  currentImage?: string | null;
  userInitials: string; 
  onImageChange: (imageData: string | null) => void;
};

const ProfileImageDialog = ({ currentImage, userInitials, onImageChange }: ProfileImageDialogProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onImageChange(previewImage);
    setOpen(false);
  };

  const handleCancel = () => {
    setPreviewImage(null);
    setOpen(false);
  };

  const handleRemove = () => {
    onImageChange(null);
    setPreviewImage(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Αλλαγή φωτογραφίας
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Αλλαγή φωτογραφίας προφίλ</DialogTitle>
          <DialogDescription>
            Ανεβάστε μια νέα φωτογραφία προφίλ ή αφαιρέστε την υπάρχουσα.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <Avatar className="h-24 w-24">
            {previewImage ? (
              <AvatarImage src={previewImage} alt="Προεπισκόπηση" />
            ) : currentImage ? (
              <AvatarImage src={currentImage} alt="Τρέχουσα" />
            ) : (
              <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture" className="text-center mb-2">Επιλέξτε μια φωτογραφία</Label>
            <input
              id="picture"
              type="file"
              accept="image/*"
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {(currentImage || previewImage) && (
            <Button variant="destructive" size="sm" onClick={handleRemove} className="w-full sm:w-auto">
              <X className="mr-2 h-4 w-4" />
              Αφαίρεση φωτογραφίας
            </Button>
          )}
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" onClick={handleCancel} className="w-full sm:w-auto">
              Ακύρωση
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!previewImage} className="w-full sm:w-auto">
              Αποθήκευση
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageDialog;
