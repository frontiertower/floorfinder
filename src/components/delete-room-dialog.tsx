'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Room } from '@/lib/types';

interface DeleteRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  room: Room | null;
}

export function DeleteRoomDialog({
  isOpen,
  onClose,
  onDelete,
  room,
}: DeleteRoomDialogProps) {
  if (!room) return null;

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Room</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this room? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid gap-2">
            <div><strong>Name:</strong> {room.name}</div>
            <div><strong>ID:</strong> {room.id}</div>
            {room.notes && <div><strong>Notes:</strong> {room.notes}</div>}
            <div><strong>Coordinates:</strong> [{room.coords.map(c => c.toFixed(1)).join(', ')}]</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}