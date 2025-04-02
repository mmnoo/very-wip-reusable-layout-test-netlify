import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import layoutPanelStyles from "./LayoutPanels.module.scss";

export interface LayoutPanelsProps {
  leftPanelContent?: ReactNode;
  rightPanelContent?: ReactNode;
  isLeftPanelToggelable?: boolean;
  isRightPanelToggelable?: boolean;
  children: ReactNode;
  leftPanelClassName?: string;
  leftPanelWidth?: string;
  rightPanelWidth?: string;
  isLeftPanelOpen?: boolean;
  setIsLeftPanelOpen?: Dispatch<SetStateAction<boolean>>;
}

export const LayoutPanels = ({
  leftPanelContent,
  rightPanelContent,
  leftPanelWidth = "400px", // what happens if we also have a css var for this? Should it be a prop or css?
  rightPanelWidth = "400px",
  isRightPanelToggelable = true,
  isLeftPanelToggelable = true,
  leftPanelClassName,
  children,
  isLeftPanelOpen = undefined,
  setIsLeftPanelOpen = undefined,
}: LayoutPanelsProps) => {
  // todo: validate props that need to go together isLeftPAnelOpen, setIsLeftPanelOpen, throw errors if one not present
  // todo: make it possible for right panel open state to be controlled by parent
  const [isLeftPanelOpenInternal, setIsLeftPanelOpenInternal] = useState(true);
  const isLeftPanelOpenToUse =
    isLeftPanelOpen !== null && isLeftPanelOpen !== undefined
      ? isLeftPanelOpen
      : isLeftPanelOpenInternal;

  const setIsLeftPanelOpenToUse =
    setIsLeftPanelOpen ?? setIsLeftPanelOpenInternal;
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const leftPanelDynamicStyles = {
    width: leftPanelWidth,
    marginLeft: isLeftPanelOpenToUse ? "0px" : `-${leftPanelWidth}`,
  };
  const rightPanelDynamicStyles = {
    width: rightPanelWidth,
    marginRight: isRightPanelOpen ? "0px" : `-${rightPanelWidth}`,
  };

  return (
    <div className={layoutPanelStyles.layoutPanelsWrapper}>
      {leftPanelContent ? (
        <div
          className={`${layoutPanelStyles.panel} ${leftPanelClassName}`}
          style={leftPanelDynamicStyles}
        >
          {isLeftPanelToggelable ? (
            <div className={layoutPanelStyles.leftPanelCloseTab}>
              <button
                className={layoutPanelStyles.panelCloseButton}
                onClick={() => setIsLeftPanelOpenToUse((previous) => !previous)}
              >
                {isLeftPanelOpenToUse ? "<" : ">"}
              </button>
            </div>
          ) : null}

          {leftPanelContent}
        </div>
      ) : null}

      {children}
      {rightPanelContent ? (
        <div
          className={layoutPanelStyles.panel}
          style={rightPanelDynamicStyles}
        >
          {isRightPanelToggelable ? (
            <div className={layoutPanelStyles.rightPanelCloseTab}>
              <button
                className={layoutPanelStyles.panelCloseButton}
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              >
                {isRightPanelOpen ? ">" : "<"}
              </button>
            </div>
          ) : null}
          {rightPanelContent}
        </div>
      ) : null}
    </div>
  );
};
