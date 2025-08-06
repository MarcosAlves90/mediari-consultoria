import { onMounted } from 'vue';

/**
 * Composable para gerenciar o mapa Leaflet
 */
export const useMap = () => {
  const initializeMap = async () => {
    if (import.meta.client) {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      const redIcon = new L.Icon({
        iconUrl: 'https://res.cloudinary.com/dawhjravc/image/upload/marker-icon-2x-red_tpormo_vyst4k.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      onMounted(() => {
        const map = L.map('map').setView([-23.61460809533691, -46.56925480555049], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/way/1184265877" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([-23.61460809533691, -46.56925480555049], { icon: redIcon }).addTo(map)
          .bindPopup('Edifício Monumental, Rua Amazonas, 439 - Centro, São Caetano do Sul, SP')
          .openPopup();
      });
    }
  };

  return {
    initializeMap,
  };
};
