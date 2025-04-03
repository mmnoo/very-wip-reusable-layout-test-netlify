import { LayoutApp } from "./couldBeSharedComponents/LayoutApp/LayoutApp";
import { LayoutPanels } from "./couldBeSharedComponents/LayoutPanels/LayoutPanels";

import styles from "./App.module.scss";
import { useEffect, useState } from "react";
import { PanelContentsWithSubpanel } from "./PanelContentsWithSubpanel/PanelContentsWithSubpanel";
import { useCloseSubpanelWhenParentPanelCloses } from "./PanelContentsWithSubpanel/useCloseSubpanelWhenParentPanelCloses";
import { Map } from "./couldBeSharedComponents/Map/Map";
import { useMap } from "./couldBeSharedComponents/Map/useMap";

function App() {
  const [isLeftPanelOpenOverride, setIsLeftPanelOpenOverride] = useState(false);
  const [isLeftSubpanelOpen, setIsLeftSubpanelOpen] = useState(true);

  // maybe we want the subpanel to close when the parent panel closes?
  // the subpanel component has no awareness of its parent, so we manage that externally to keep the subpanel component simple and 'stupid'

  useCloseSubpanelWhenParentPanelCloses({
    isLeftPanelOpen: isLeftPanelOpenOverride,
    setIsSubpanelOpen: setIsLeftSubpanelOpen,
  });

  const customHandleLeftPanelToggle = () => {
    console.log(
      "control panel state from parent (and execute any side effects)"
    );

    setIsLeftPanelOpenOverride((previous) => !previous);
    // call a map resize handler here if we need to respond to that
  };

  const { mapContainer, mapRef, isMapLoaded } = useMap({
    center: [-122.4194, 37.7749],

    zoom: 10,
  });

  useEffect(
    function exampleMapResizeHandler() {
      if (!isMapLoaded && !mapRef.current) {
        // this check is a bit redundant, but isMapLoaded will trigger the effect.
        // checking for mapRef.current as well is technically correct and doesnt hurt
        return;
      }
      const mapInstance = mapRef.current;
      const handleMapResize = () => {
        console.log("resize event");
      };
      mapInstance?.on("resize", handleMapResize);

      return () => {
        mapInstance?.off("resize", handleMapResize);
      };
    },
    [isMapLoaded, mapRef]
  );

  return (
    <LayoutApp headerContent={<>header</>} footerContent={<>footer</>}>
      <LayoutPanels
        leftPanelContent={
          <PanelContentsWithSubpanel
            isSubpanelOpen={isLeftSubpanelOpen}
            setIsSubpanelOpen={setIsLeftSubpanelOpen}
            subpanelContents={
              <div style={{ backgroundColor: "lightcoral", height: "100%" }}>
                {/* not saying we should use inline styling here, but emphacizing that subpanel content styling happens by composistion 
								we'd need to avoid the corner close button from overlapping the contents, but thats not hard so I dont expect it needs a demo
								*/}
                optional subpanel contents
              </div>
            }
            mainPanelContents={
              <>
                Optional left Panel PR content
                <br />
                <button
                  onClick={() => setIsLeftSubpanelOpen(!isLeftSubpanelOpen)}
                >
                  toggle subpanel
                </button>
                <br />
                <br />
                <br />
                <br />
                <br />
                <button onClick={customHandleLeftPanelToggle}>
                  toggle left panel with custom function from parent component
                </button>
              </>
            }
            subpanelWidth="200px"
          ></PanelContentsWithSubpanel>
        }
        rightPanelContent={<>Optional right panel</>}
        leftPanelWidth="300px"
        setIsLeftPanelOpen={customHandleLeftPanelToggle}
        isLeftPanelOpen={isLeftPanelOpenOverride}
        leftPanelClassName={styles.leftPanelOverride} //override left panel styles to show a possible approach to style overriding
      >
        <div>
          <Map
            mapContainer={mapContainer}
            legend={<div style={{ backgroundColor: "white" }}> legend</div>}
            additionalControls={
              <>
                <button>custom</button>
                <button>map</button>
                <button>control</button>
                <button>container</button>
              </>
            }
          />
        </div>
      </LayoutPanels>
    </LayoutApp>
  );
}

export default App;
