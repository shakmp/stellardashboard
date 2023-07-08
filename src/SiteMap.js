import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SiteMap = ({ siteData, selectedSite }) => {
  useEffect(() => {
    const map = L.map('map').setView([selectedSite.latitude, selectedSite.longitude], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; OpenStreetMap contributors',
    }).addTo(map);

    siteData.forEach((site) => {
      const bubbleSize = site.systemCapacity / 1000;
      const bubble = L.circleMarker([site.latitude, site.longitude], {
        radius: bubbleSize,
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.6,
      });

      bubble.bindTooltip(`<p>Site Name: ${site.name}</p><p>Capacity: ${site.systemCapacity}</p>`);

      bubble.addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [siteData, selectedSite]);

  return <div id="map" style={{ height: '400px' }} />;
};

export default SiteMap;
