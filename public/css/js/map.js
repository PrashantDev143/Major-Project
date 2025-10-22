 document.addEventListener("DOMContentLoaded", () => {
    const map = new maplibregl.Map({
      container: "map",
      style: "https://api.maptiler.com/maps/streets/style.json?key=OraJntZ05UyOccA7L6E4",
      center: [77.5946, 12.9716],
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl());

    new maplibregl.Marker({ color: "#e63946" })
      .setLngLat([77.5946, 12.9716])
      .setPopup(new maplibregl.Popup({ offset: 25 }).setText("📍 Bengaluru, India"))
      .addTo(map);

    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showAccuracyCircle: false,
      })
    );

    // Prevent map from disappearing after render
    setTimeout(() => map.resize(), 500);
  });