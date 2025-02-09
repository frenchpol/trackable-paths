
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/context/LocationContext';
import { motion } from 'framer-motion';

export const NewTrackDialog = () => {
  const [trackName, setTrackName] = useState('');
  const { startTracking } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleStart = () => {
    if (trackName.trim()) {
      startTracking(trackName);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="dialog-content bg-background/95 backdrop-blur-lg border-border/50">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl font-bold tracking-tight">
            New Activity
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          <div className="space-y-2">
            <Input
              placeholder="Activity name"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="bg-muted/50 border-border/50 text-foreground h-12 text-lg placeholder:text-foreground/50"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-border/50 bg-background/50 text-foreground hover:bg-accent/50 h-12 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={!trackName.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 button-primary"
            >
              Start Activity
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
