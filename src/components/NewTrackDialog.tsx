
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from '@/context/LocationContext';

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
      <DialogContent className="bg-popover border-border shadow-lg shadow-primary/10">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">Record a New Track</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter track name"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-border bg-muted text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={!trackName.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
