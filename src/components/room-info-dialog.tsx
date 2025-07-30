
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { enhanceSpaceName, EnhanceSpaceNameOutput } from '@/ai/flows/enhance-space-name';
import type { Room } from '@/lib/types';
import { Badge } from './ui/badge';
import { Wand2 } from 'lucide-react';

interface RoomInfoDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RoomInfoDialog({ room, open, onOpenChange }: RoomInfoDialogProps) {
  const [enhancement, setEnhancement] = useState<EnhanceSpaceNameOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (room && open) {
      setLoading(true);
      setError(null);
      setEnhancement(null);
      enhanceSpaceName({ spaceName: room.name })
        .then((result) => {
          setEnhancement(result);
        })
        .catch((err) => {
          console.error('Failed to enhance space name:', err);
          setError('Could not retrieve additional information.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [room, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{room?.name}</DialogTitle>
          <DialogDescription>ID: {room?.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <h3 className="font-headline text-lg">Enhanced Details</h3>
            <Badge variant="outline">AI Generated</Badge>
          </div>
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {enhancement && <p className="text-sm text-foreground">{enhancement.enhancedDescription}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
