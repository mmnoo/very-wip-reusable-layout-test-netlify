import { ReactNode, useEffect, useRef, useState } from "react";
import panelContentsWrapperStyles from "./PanelContentsWithSubpanel.module.scss";
import { ButtonXTopRight } from "../couldBeSharedComponents/buttons/ButtonXTopRight";

export const PanelContentsWithSubpanel = ({
  mainPanelContents,
  subpanelContents,
  isSubpanelOpen,
  setIsSubpanelOpen,
}: {
  mainPanelContents: ReactNode;
  subpanelContents: ReactNode;
  isSubpanelOpen: boolean;
  setIsSubpanelOpen: (arg: boolean) => unknown;
}) => {
  const [subpanelWidthFromCss, setSubpanelWidthFromCss] = useState<string>();
  const subpanelRef = useRef<HTMLDivElement>(null);
  const closeSubpanel = () => {
    setIsSubpanelOpen(false);
  };

  useEffect(function getSubpanelWidthValueFromCss() {
    setSubpanelWidthFromCss(`${subpanelRef.current?.offsetWidth}px`);
  }, []);
  const widthStylesOverride = subpanelWidthFromCss
    ? {
        width: subpanelWidthFromCss,
        right: `calc(-${subpanelWidthFromCss} - var(--spk-spacing-5, 24px))`, // make sure changes here get reflected in the css
      }
    : undefined;
  return (
    <div className={panelContentsWrapperStyles.panelContentsWrapper}>
      {isSubpanelOpen ? (
        <div
          className={panelContentsWrapperStyles.subpanelWrapper}
          style={widthStylesOverride}
          ref={subpanelRef}
        >
          <ButtonXTopRight onPress={closeSubpanel} />
          {subpanelContents}
        </div>
      ) : null}

      {mainPanelContents}
      {/* 

			WIP thoughts:
			
			Should this be a standalone component, or part of other panels component (LayoutPanels)?
			Keepin git on its own keeps the code simple with less if statements, 
			but that means syncing closing the subpanel when the parent panel closes is hard to make a default
			and must be handled by the consuming app (with a hook we provide for convienience), but this is worse dx. 

			I can probably consume this component in the LayoutPanels directly, to at least keep the code of both separated and small... 
			
			
			things to ask Erin/Al:
				- default panel animations
			*/}
    </div>
  );
};
