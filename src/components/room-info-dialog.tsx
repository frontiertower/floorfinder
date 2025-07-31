
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
import type { Room } from '@/lib/types';
import { Badge } from './ui/badge';
import { Wand2 } from 'lucide-react';
import { Button } from './ui/button';

interface RoomInfoDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RoomInfoDialog({ room, open, onOpenChange }: RoomInfoDialogProps) {
  
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
            <Badge variant="outline">AI Disabled</Badge>
          </div>
          <p className="text-sm text-muted-foreground">AI functionality is currently disabled.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
