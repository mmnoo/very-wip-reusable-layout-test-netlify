import { ReactNode, useEffect, useRef, useState } from "react";
import panelContentsWrapperStyles from "./PanelContentsWithSubpanel.module.scss";
import { ButtonXTopRight } from "../couldBeSharedComponents/buttons/ButtonXTopRight";
import { useCloseSubpanelWhenParentPanelCloses } from "./useCloseSubpanelWhenParentPanelCloses";

export const PanelContentsWithSubpanel = ({
  isLeftPanelOpen,
  isSubpanelOpen = true,
  mainPanelContent,
  setIsSubpanelOpen,
  subpanelClassName = undefined,
  subpanelContent,
}: {
  isLeftPanelOpen: boolean;
  isSubpanelOpen: boolean;
  mainPanelContent: ReactNode;
  setIsSubpanelOpen: (arg: boolean) => unknown;
  subpanelClassName?: string;
  subpanelContent: ReactNode;
}) => {
  const [subpanelWidthFromCss, setSubpanelWidthFromCss] = useState<string>();

  const subpanelRef = useRef<HTMLDivElement>(null);

  const closeSubpanel = () => {
    setIsSubpanelOpen(false);
  };

  useCloseSubpanelWhenParentPanelCloses({
    isLeftPanelOpen,
    setIsSubpanelOpen,
  });

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
          className={`${panelContentsWrapperStyles.subpanelWrapper} ${subpanelClassName}`}
          style={widthStylesOverride}
          ref={subpanelRef}
        >
          <ButtonXTopRight onPress={closeSubpanel} />
          {subpanelContent}
        </div>
      ) : null}

      {mainPanelContent}
    </div>
  );
};
