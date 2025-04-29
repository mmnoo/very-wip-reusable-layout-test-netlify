import { LayoutApp } from "./couldBeSharedComponents/LayoutApp/LayoutApp";
import { LayoutPanels } from "./couldBeSharedComponents/LayoutPanels/LayoutPanels";

import styles from "./App.module.scss";
import { useState } from "react";
import { PanelContentsWithSubpanel } from "./PanelContentsWithSubpanel/PanelContentsWithSubpanel";
import { useCloseSubpanelWhenParentPanelCloses } from "./PanelContentsWithSubpanel/useCloseSubpanelWhenParentPanelCloses";
import { Map } from "./couldBeSharedComponents/Map/Map";
import { useMap } from "./couldBeSharedComponents/Map/useMap";

function App() {
  const [isLeftPanelOpenOverride, setIsLeftPanelOpenOverride] = useState(true);
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
  };

  const { mapContainer } = useMap({
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
                {/* not saying we should use inline styling here, but emphacizing that subpanel content styling happens by composistion 
								we'd need to avoid the corner close button from overlapping the contents, but thats not hard so I dont expect it needs a demo
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
              </>
            }
            subpanelWidth="200px"
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
