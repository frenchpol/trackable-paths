
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from '@/context/LocationContext';
import { motion } from 'framer-motion';

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
      <DialogContent className="dialog-content bg-background/95 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl font-bold tracking-tight">
            Add Point of Interest
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          <div className="space-y-2">
            <Textarea
              placeholder="Describe this location..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none h-32 text-lg placeholder:text-foreground/50"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-background/50 text-foreground hover:bg-accent/50 h-12 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPOI}
              disabled={!comment.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 button-primary"
            >
              Add Point
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
