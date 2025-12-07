'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePdfDownload } from '@/hooks/use-pdf-download';
import { useToast } from '@/hooks/use-toast';

interface DownloadButtonProps {
  elementId: string;
  filename: string;
  label?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  elementId,
  filename,
  label = 'Download PDF'
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { downloadPdf } = usePdfDownload();
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPdf(elementId, filename);
      toast({
        title: "Download successful",
        description: `${filename} has been downloaded.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "There was an error generating the PDF. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      size="lg"
      className="text-foreground border-border"
    >
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? 'Generating PDF...' : label}
    </Button>
  );
};