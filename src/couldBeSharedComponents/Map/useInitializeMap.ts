import Maplibregl, { LngLatLike, Map as MaplibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MutableRefObject, useEffect, useRef, useState } from "react";

// import { MAP_MAX_ZOOM, MapSourceIds } from "../../configuration/constants";

export type MapRef = MutableRefObject<MaplibreMap | null | undefined>;

export const useInitializeMap = (config?: {
  center?: LngLatLike;
  zoom?: number;
}) => {
  const { center: initialCenter, zoom: initialZoom } = config ?? {};
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap>();

  useEffect(
    function initializeMapInstance() {
      const isMapInitialized = !!mapRef.current;
      if (isMapInitialized) return;

      const center = initialCenter ?? [0, 0];
      const zoom = initialZoom ?? 1;

      mapRef.current = new Maplibregl.Map({
        container: mapContainer.current as HTMLElement,
        style: "https://demotiles.maplibre.org/style.json",
        center: center,
        zoom: zoom,
      });
    },
    [initialCenter, initialZoom]
  );

  useEffect(function initializeIsMapLoaded() {
    if (!mapRef.current) return;

    const handleMapLoad = () => {
      setIsMapLoaded(true); // this is useful to trigger functions that use depenency arrays, since the mapRef.current cannot.
    };

    mapRef.current?.on("load", handleMapLoad);

    const mapInstance = mapRef.current;

    return () => {
      mapInstance.off("load", handleMapLoad);
    };
  }, []);

  return {
    isMapLoaded,
    mapContainer,
    mapRef,
  };
};
