import { LayoutApp } from "./couldBeSharedComponents/LayoutApp/LayoutApp";
import { LayoutPanels } from "./couldBeSharedComponents/LayoutPanels/LayoutPanels";

import styles from "./App.module.scss";
import { useState } from "react";
import { PanelContentsWithSubpanel } from "./PanelContentsWithSubpanel/PanelContentsWithSubpanel";
import { useCloseSubpanelWhenParentPanelCloses } from "./PanelContentsWithSubpanel/useCloseSubpanelWhenParentPanelCloses";
import { Map } from "./couldBeSharedComponents/Map/Map";
import { useInitializeMap } from "./couldBeSharedComponents/Map/useInitializeMap";

function App() {
  const [isLeftPanelOpenOverride, setIsLeftPanelOpenOverride] = useState(true);
  const [isLeftSubpanelOpen, setIsLeftSubpanelOpen] = useState(true);

  useCloseSubpanelWhenParentPanelCloses({
    isLeftPanelOpen: isLeftPanelOpenOverride,
    setIsSubpanelOpen: setIsLeftSubpanelOpen,
  });

  const customHandleLeftPanelToggle = () => {
    console.log(
      "control panel state from parent (and execute any side effects)"
    );

    setIsLeftPanelOpenOverride((previous) => !previous);
  };

  const { mapContainer } = useInitializeMap({
    center: [-122.4194, 37.7749],

    zoom: 10,
  });

  return (
    <LayoutApp
      headerContent={<>header (out of scope )</>}
      footerContent={<>footer (out of scope)</>}
    >
      <LayoutPanels
        leftPanelContent={
          <PanelContentsWithSubpanel
            isSubpanelOpen={isLeftSubpanelOpen}
            setIsSubpanelOpen={setIsLeftSubpanelOpen}
            subpanelContents={
              <div style={{ backgroundColor: "lightcoral", height: "100%" }}>
                {/* not saying we should use inline styling in production level code, 
								but want to note that subpanel content styling happens by composistion 
								*/}
                optional subpanel contents
              </div>
            }
            mainPanelContents={
              <>
                Optional left Panel
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
                <br />
                <br />
                (Map-related components are out of scope for this demo)
              </>
            }
          ></PanelContentsWithSubpanel>
        }
        rightPanelContent={<>Optional right panel</>}
        setIsLeftPanelOpen={customHandleLeftPanelToggle}
        isLeftPanelOpen={isLeftPanelOpenOverride}
        leftPanelClassName={styles.leftPanelOverride}
        isLeftPanelResizable={true}
        isRightPanelResizable={true}
      >
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
      </LayoutPanels>
    </LayoutApp>
  );
}

export default App;
