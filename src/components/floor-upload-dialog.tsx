'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FloorUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FloorUploadDialog({
  isOpen,
  onClose,
  onSuccess,
}: FloorUploadDialogProps) {
  const [floorName, setFloorName] = useState('');
  const [floorLevel, setFloorLevel] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an SVG, PNG, or JPEG file.",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!floorName.trim() || !floorLevel.trim() || !selectedFile) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all fields and select a file.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', floorName.trim());
      formData.append('level', floorLevel.trim());

      const response = await fetch('/api/floors/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      toast({
        title: "Floor uploaded successfully",
        description: `${floorName} has been added to the floor list.`,
      });

      setFloorName('');
      setFloorLevel('');
      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload floor plan.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFloorName('');
    setFloorLevel('');
    setSelectedFile(null);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload New Floor Plan</DialogTitle>
          <DialogDescription>
            Add a custom floor plan with your own map image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="floor-name" className="text-right">
              Name
            </Label>
            <Input
              id="floor-name"
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
              className="col-span-3"
              placeholder="Floor name (e.g., Custom Floor 1)"
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="floor-level" className="text-right">
              Level
            </Label>
            <Input
              id="floor-level"
              type="number"
              value={floorLevel}
              onChange={(e) => setFloorLevel(e.target.value)}
              className="col-span-3"
              placeholder="Floor level (e.g., 18)"
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="floor-file" className="text-right">
              Map File
            </Label>
            <div className="col-span-3 space-y-2">
              <Input
                id="floor-file"
                type="file"
                accept=".svg,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="cursor-pointer"
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                Supports SVG, PNG, or JPEG files (max 5MB)
              </p>
              {selectedFile && (
                <p className="text-xs text-green-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Floor
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}