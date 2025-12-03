'use client';

import { useState, useEffect } from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FloorNameEditorProps {
  floorId: string;
  floorName: string;
  isEditMode: boolean;
  onNameChange: (newName: string) => void;
}

export function FloorNameEditor({
  floorId,
  floorName,
  isEditMode,
  onNameChange,
}: FloorNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(floorName);

  useEffect(() => {
    setTempName(floorName);
  }, [floorName]);

  const handleSave = () => {
    if (tempName.trim() && tempName !== floorName) {
      onNameChange(tempName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(floorName);
    setIsEditing(false);
  };

  if (!isEditMode) {
    return (
      <h2 className="text-2xl font-bold text-primary">
        {floorId} - {floorName}
      </h2>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-primary">{floorId} -</span>
        <Input
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          className="text-2xl font-bold w-64"
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={handleSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h2 className="text-2xl font-bold text-primary">
        {floorId} - {floorName}
      </h2>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="opacity-70 hover:opacity-100"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
}