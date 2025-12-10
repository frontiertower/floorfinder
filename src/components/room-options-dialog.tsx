'use client';

import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Room } from '@/lib/types';
import { ROOM_TYPES, TRACK_OPTIONS } from '@/lib/types';

interface RoomOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRoom: Room) => void;
  onDelete: () => void;
  room: Room | null;
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

export function RoomOptionsDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  room,
}: RoomOptionsDialogProps) {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamNumber, setTeamNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const [type, setType] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [tracks, setTracks] = useState<string>('');
  const [addonTracks, setAddonTracks] = useState<string>('');
  const [color, setColor] = useState(predefinedColors[0].value);
  const [customColor, setCustomColor] = useState('');

  // Update local state when room changes
  useEffect(() => {
    if (room) {
      setName(room.name);
      setTeamName(room.teamName || '');

      // Extract team number from room name if not already set
      let teamNum = room.teamNumber || '';
      if (!teamNum && room.name) {
        const match = room.name.match(/SF\d+/i);
        if (match) {
          teamNum = match[0].toUpperCase();
        }
      }
      setTeamNumber(teamNum);

      setProjectName(room.projectName || '');
      setType(room.type || '');
      setNotes(room.notes || '');
      setTracks(room.tracks || 'none');
      setAddonTracks(room.addonTracks || 'none');
      setColor(room.color || predefinedColors[0].value);
      setCustomColor('');
    }
  }, [room]);

  if (!room) return null;

  const handleSave = () => {
    const updatedRoom: Room = {
      ...room,
      name: name || 'Unnamed Room',
      teamName,
      teamNumber,
      projectName,
      type: type || undefined,
      notes,
      tracks: tracks === 'none' ? '' : tracks,
      addonTracks: addonTracks === 'none' ? '' : addonTracks,
      color: customColor || color,
    };

    onSave(updatedRoom);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>
            Make changes to the room or delete it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={(e) => e.currentTarget.focus()}
              className="col-span-3"
              placeholder="Room name"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-teamNumber" className="text-right">
              Team Number
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="edit-teamNumber"
                value={teamNumber}
                onChange={(e) => setTeamNumber(e.target.value)}
                onClick={(e) => e.currentTarget.focus()}
                placeholder="SF20"
                autoComplete="off"
              />
              {name && name.match(/SF\d+/i) && (
                <button
                  type="button"
                  onClick={() => {
                    const match = name.match(/SF\d+/i);
                    if (match) {
                      setTeamNumber(match[0].toUpperCase());
                    }
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Extract from room name ({name.match(/SF\d+/i)?.[0].toUpperCase()})
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-teamName" className="text-right">
              Team Name
            </Label>
            <Input
              id="edit-teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onClick={(e) => e.currentTarget.focus()}
              className="col-span-3"
              placeholder="Engineering Team"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-projectName" className="text-right">
              Project Name
            </Label>
            <Input
              id="edit-projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onClick={(e) => e.currentTarget.focus()}
              className="col-span-3"
              placeholder="Project or product name"
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select room type..." />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map((roomType) => (
                  <SelectItem key={roomType} value={roomType}>
                    {roomType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tracks" className="text-right">
              Primary Track
            </Label>
            <Select value={tracks} onValueChange={setTracks}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select primary track..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {TRACK_OPTIONS.map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-addonTracks" className="text-right">
              Add-on Track
            </Label>
            <Select value={addonTracks} onValueChange={setAddonTracks}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select add-on track..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {TRACK_OPTIONS.map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onClick={(e) => e.currentTarget.focus()}
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
                onClick={(e) => e.currentTarget.focus()}
                placeholder="Custom color (e.g., rgba(255, 0, 0, 0.5))"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Info</Label>
            <div className="col-span-3 text-sm text-muted-foreground space-y-1">
              <div><strong>ID:</strong> {room.id}</div>
              <div><strong>Coords:</strong> [{room.coords.map(c => c.toFixed(1)).join(', ')}]</div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="destructive" onClick={handleDelete}>
            Delete Room
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}