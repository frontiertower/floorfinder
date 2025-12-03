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
import { Textarea } from '@/components/ui/textarea';
import type { Room } from '@/lib/types';

interface RoomEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Partial<Room>) => void;
  coords: [number, number, number, number];
  floorId: string;
}

const predefinedColors = [
  { name: 'Green', value: 'rgba(76, 175, 80, 0.5)' },
  { name: 'Blue', value: 'rgba(33, 150, 243, 0.5)' },
  { name: 'Orange', value: 'rgba(255, 152, 0, 0.5)' },
  { name: 'Purple', value: 'rgba(156, 39, 176, 0.5)' },
  { name: 'Red', value: 'rgba(244, 67, 54, 0.5)' },
  { name: 'Pink', value: 'rgba(255, 200, 255, 0.5)' },
  { name: 'Yellow', value: 'rgba(255, 235, 59, 0.5)' },
  { name: 'Teal', value: 'rgba(0, 150, 136, 0.5)' },
];

export function RoomEditorDialog({
  isOpen,
  onClose,
  onSave,
  coords,
  floorId,
}: RoomEditorDialogProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState(predefinedColors[0].value);
  const [customColor, setCustomColor] = useState('');

  const handleSave = () => {
    const floorNum = floorId.replace('floor-', '');
    const roomId = `f${floorNum}r${Date.now().toString(36)}`;

    onSave({
      id: roomId,
      name: name || 'Unnamed Room',
      notes,
      color: customColor || color,
      coords,
      floorId,
    });

    // Reset form
    setName('');
    setNotes('');
    setColor(predefinedColors[0].value);
    setCustomColor('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Add details for the room you just drew.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Conference Room A"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Optional notes..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Color</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setColor(c.value);
                      setCustomColor('');
                    }}
                    className={`w-8 h-8 rounded border-2 ${
                      color === c.value && !customColor
                        ? 'border-primary'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
              <Input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="Custom color (e.g., rgba(255, 0, 0, 0.5))"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Coords</Label>
            <div className="col-span-3 text-sm text-muted-foreground">
              [{coords.map(c => c.toFixed(1)).join(', ')}]
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Create Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}