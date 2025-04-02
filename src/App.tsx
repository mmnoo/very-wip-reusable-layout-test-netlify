import { LayoutApp } from "./couldBeSharedComponents/LayoutApp/LayoutApp";
import { LayoutPanels } from "./couldBeSharedComponents/LayoutPanels/LayoutPanels";

import styles from "./App.module.scss";
import { useState } from "react";
import { PanelContentsWithSubpanel } from "./PanelContentsWithSubpanel/PanelContentsWithSubpanel";
import { useCloseSubpanelWhenParentPanelCloses } from "./PanelContentsWithSubpanel/useCloseSubpanelWhenParentPanelCloses";

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
  };
  return (
    <LayoutApp headerContent={<>header</>} footerContent={<>footer</>}>
      <LayoutPanels
        leftPanelContent={
          <PanelContentsWithSubpanel
            isSubpanelOpen={isLeftSubpanelOpen}
            setIsSubpanelOpen={setIsLeftSubpanelOpen}
            subpanelContents={
              <div style={{ backgroundColor: "lightgreen", height: "100%" }}>
                {/* not saying we should use inline styling here, but emphacizing that subpanel content styling happens by composistion 
								we'd need to avoid the corner close button from overlapping the contents, but thats not hard so I dont expect it needs a demo
								*/}
                subpanel contents
              </div>
            }
            mainPanelContents={
              <>
                Left Panel
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
        rightPanelContent={<>right panel</>}
        leftPanelWidth="300px"
        setIsLeftPanelOpen={customHandleLeftPanelToggle}
        isLeftPanelOpen={isLeftPanelOpenOverride}
        leftPanelClassName={styles.leftPanelOverride} //override left panel styles to show a possible approach to style overriding
      >
        <div>map here</div>
      </LayoutPanels>
    </LayoutApp>
  );
}

export default App;
