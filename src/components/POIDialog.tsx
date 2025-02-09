
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
      <DialogContent className="bg-popover border-border shadow-lg shadow-primary/10">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">Add Point of Interest</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Enter POI description"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-muted border-border text-foreground resize-none h-[100px]"
            />
          </div>
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border bg-muted text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPOI}
              disabled={!comment.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
