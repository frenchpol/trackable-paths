
import { Button } from '@/components/ui/button';
import { useLocation } from '@/context/LocationContext';
import { Play, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { downloadGPXFile } from '@/utils/gpx';
import { toast } from 'sonner';

export const TrackingControls = () => {
  const { isTracking, startTracking, stopTracking, currentPath } = useLocation();

  const handleStopTracking = () => {
    stopTracking();
    if (currentPath.length > 0) {
      downloadGPXFile(currentPath);
      toast.success('Track saved as GPX file');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 p-4 bg-white/80 backdrop-blur-lg rounded-full shadow-lg"
    >
      {!isTracking ? (
        <Button
          onClick={startTracking}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300"
        >
          <Play className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          onClick={handleStopTracking}
          variant="destructive"
          className="rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300"
        >
          <Square className="h-5 w-5" />
        </Button>
      )}
    </motion.div>
  );
};
