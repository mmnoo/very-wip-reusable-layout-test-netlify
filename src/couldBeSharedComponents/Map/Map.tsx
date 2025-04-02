import "maplibre-gl/dist/maplibre-gl.css";

import mapStyles from "./Map.module.css";
import { ReactNode } from "react";

export const Map = ({
  additionalControls,
  legend,
  mapContainer,
}: {
  additionalControls?: React.ReactNode;
  legend?: ReactNode;
  mapContainer: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div className={mapStyles.mapWrapper}>
      <div ref={mapContainer} className={mapStyles.map} />
      {additionalControls ? (
        <div className={mapStyles.extraMapControlsContainer}>
          {additionalControls}
        </div>
      ) : null}
      {legend ? (
        <div className={mapStyles.legendContainer}>{legend}</div>
      ) : null}
    </div>
  );
};
