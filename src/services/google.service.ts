const openGoogleMap = (input: {
  name: string;
  lat: number;
  lng: number;
  placeId?: string;
}) => {
  const { name, lat, lng, placeId } = input;

  let url = `https://www.google.com/maps/search/?api=1&`;

  if (placeId) {
    url += `query=${encodeURIComponent(name)}&query_place_id=${placeId}`;
  } else {
    url += `query=${lat},${lng}`;
  }

  window.open(url, '_blank');
};

export default { openGoogleMap };
