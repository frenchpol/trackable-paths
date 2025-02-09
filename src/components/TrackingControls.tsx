
import { Button } from '@/components/ui/button';
import { useLocation } from '@/context/LocationContext';
import { Play, Square, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadGPXFile } from '@/utils/gpx';
import { toast } from 'sonner';
import { useState } from 'react';
import { POIDialog } from './POIDialog';

export const TrackingControls = () => {
  const { isTracking, startTracking, stopTracking, currentPath, trackName } = useLocation();
  const [isPOIDialogOpen, setIsPOIDialogOpen] = useState(false);

  const handleStopTracking = () => {
    stopTracking();
    if (currentPath.length > 0) {
      downloadGPXFile(currentPath, trackName);
      toast.success('Track saved as GPX file', {
        className: 'bg-background/95 border-border/50 text-foreground',
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-50"
      >
        {!isTracking ? (
          <Button
            onClick={() => startTracking(trackName)}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground button-control button-primary"
          >
            <Play className="h-6 w-6" />
          </Button>
        ) : (
          <>
            <Button
              onClick={handleStopTracking}
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground button-control button-primary"
            >
              <Square className="h-6 w-6" />
            </Button>
            <Button
              onClick={() => setIsPOIDialogOpen(true)}
              className="w-16 h-16 rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground button-control button-primary"
            >
              <MapPin className="h-6 w-6" />
            </Button>
          </>
        )}
      </motion.div>
      <POIDialog isOpen={isPOIDialogOpen} onClose={() => setIsPOIDialogOpen(false)} />
    </>
  );
};
