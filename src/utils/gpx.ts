
const createGPXString = (coordinates: number[][]): string => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Lovable Track Creator"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <trk>
    <name>Recorded Track</name>
    <trkseg>`;

  const points = coordinates
    .map(([lon, lat]) => `      <trkpt lat="${lat}" lon="${lon}"></trkpt>`)
    .join('\n');

  const footer = `
    </trkseg>
  </trk>
</gpx>`;

  return `${header}\n${points}${footer}`;
};

export const downloadGPXFile = (coordinates: number[][]) => {
  const gpxContent = createGPXString(coordinates);
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `track-${date}.gpx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
