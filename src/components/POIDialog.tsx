
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from '@/context/LocationContext';

interface POIDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const POIDialog = ({ isOpen, onClose }: POIDialogProps) => {
  const [comment, setComment] = useState('');
  const { addPOI, currentLocation } = useLocation();

  const handleAddPOI = () => {
    if (currentLocation && comment.trim()) {
      addPOI({
        coordinates: currentLocation,
        comment: comment.trim(),
      });
      setComment('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Point of Interest</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter POI description"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAddPOI} disabled={!comment.trim()}>
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
