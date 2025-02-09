
import { Map } from '@/components/Map';
import { TrackingControls } from '@/components/TrackingControls';
import { LocationProvider } from '@/context/LocationContext';
import { NewTrackDialog } from '@/components/NewTrackDialog';

const Index = () => {
  return (
    <LocationProvider>
      <div className="relative h-screen w-full bg-gray-50">
        <Map />
        <TrackingControls />
        <NewTrackDialog />
      </div>
    </LocationProvider>
  );
};

export default Index;
