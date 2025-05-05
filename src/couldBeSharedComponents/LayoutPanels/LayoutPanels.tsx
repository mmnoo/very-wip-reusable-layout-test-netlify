import {
  cloneElement,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import layoutPanelStyles from "./LayoutPanels.module.scss";
import { dragToResizePanelWidth } from "../../library/dom/dragToResizePanelWidth";
import { PanelContentsWithSubpanel } from "../../PanelContentsWithSubpanel/PanelContentsWithSubpanel";

export interface LayoutPanelsProps {
  subpanelClassName?: string;
  subpanelContent?: ReactNode;
  children: ReactNode;
  isLeftPanelOpen?: boolean;
  isLeftPanelResizable?: boolean;
  isLeftPanelToggelable?: boolean;
  isLeftSubpanelOpen?: boolean;
  isRightPanelOpen?: boolean;
  isRightPanelResizable?: boolean;
  isRightPanelToggelable?: boolean;
  leftPanelClassName?: string;
  leftPanelContent?: ReactNode;
  leftPanelToggleButton?: ReactElement;
  rightPanelClassName?: string;
  rightPanelContent?: ReactNode;
  rightPanelToggleButton?: ReactElement;
  setIsLeftPanelOpen?: Dispatch<SetStateAction<boolean>>;
  setIsLeftSubpanelOpen?: Dispatch<SetStateAction<boolean>>;
  setIsRightPanelOpen?: Dispatch<SetStateAction<boolean>>;
}

export const LayoutPanels = ({
  rightPanelClassName = undefined,
  subpanelClassName = undefined,
  children,
  isLeftPanelOpen = undefined,
  isLeftPanelResizable = false,
  isLeftPanelToggelable = true,
  isLeftSubpanelOpen = undefined,
  isRightPanelOpen = undefined,
  isRightPanelResizable = false,
  isRightPanelToggelable = true,
  leftPanelClassName = undefined,
  leftPanelContent = undefined,
  leftPanelToggleButton = undefined,
  rightPanelContent = undefined,
  rightPanelToggleButton = undefined,
  setIsLeftPanelOpen = undefined,
  setIsLeftSubpanelOpen = undefined,
  setIsRightPanelOpen = undefined,
  subpanelContent = undefined,
}: LayoutPanelsProps) => {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  if (
    subpanelContent &&
    (!setIsLeftSubpanelOpen || isLeftSubpanelOpen === undefined)
  ) {
    throw new Error(
      "subpanelContent prop was provided, but setIsLeftSubpanelOpen and isLeftSubpanelOpen were not provided. This is required to control the subpanel's open state. isLeftSubpanelOpen must be initialized to a boolean value"
    );
  }
  const [isLeftPanelOpenInternal, setIsLeftPanelOpenInternal] = useState(true);

  const [isRightPanelOpenInternal, setIsRightPanelOpenInternal] =
    useState(true);
  const [leftPanelResizableWidth, setLeftPanelResizableWidth] =
    useState<string>();
  const [rightPanelResizableWidth, setRightPanelResizableWidth] =
    useState<string>();

  const isLeftPanelOpenToUse = isLeftPanelOpen ?? isLeftPanelOpenInternal;
  const isRightPanelOpenToUse = isRightPanelOpen ?? isRightPanelOpenInternal;
  const setIsLeftPanelOpenToUse =
    setIsLeftPanelOpen ?? setIsLeftPanelOpenInternal;
  const setIsRightPanelOpenToUse =
    setIsRightPanelOpen ?? setIsRightPanelOpenInternal;
  const leftPanelDynamicStyles = useMemo(() => {
    return leftPanelResizableWidth
      ? {
          width: leftPanelResizableWidth,
          marginLeft: isLeftPanelOpenToUse
            ? "0px"
            : `-${leftPanelResizableWidth}`,
        }
      : undefined;
  }, [isLeftPanelOpenToUse, leftPanelResizableWidth]);
  const rightPanelDynamicStyles = {
    width: rightPanelResizableWidth,
    marginRight: isRightPanelOpenToUse ? "0px" : `-${rightPanelResizableWidth}`,
  };

  useEffect(function initializeResizableWidths() {
    setLeftPanelResizableWidth(`${leftPanelRef.current?.offsetWidth}px`);
    setRightPanelResizableWidth(`${rightPanelRef.current?.offsetWidth}px`);
  }, []);

  const dragToResizeLeftPanel = (
    event: React.MouseEvent | React.TouchEvent
  ) => {
    dragToResizePanelWidth({
      event,
      divRef: leftPanelRef,
      onMoveEnd: setLeftPanelResizableWidth,
      closePanel: () => {
        setIsLeftPanelOpenToUse(false);
      },
    });
  };

  const dragToResizeRightPanel = (
    event: React.MouseEvent | React.TouchEvent
  ) => {
    dragToResizePanelWidth({
      event,
      divRef: rightPanelRef,
      onMoveEnd: setRightPanelResizableWidth,
      isLeftEdgeResizeTarget: true,
      closePanel: () => {
        setIsRightPanelOpenToUse(false);
      },
    });
  };
  const handleRightToggleButtonClick = () =>
    setIsRightPanelOpenToUse((previous) => !previous);
  const handleLeftToggleButtonClick = () =>
    setIsLeftPanelOpenToUse((previous) => !previous);
  const internalRightPanelCloseButton = (
    <button
      className={layoutPanelStyles.panelCloseButton}
      onClick={handleRightToggleButtonClick}
    >
      {isRightPanelOpenToUse ? ">" : "<"}
    </button>
  );
  const internalLeftPanelCloseButton = (
    <button
      className={layoutPanelStyles.panelCloseButton}
      onClick={handleLeftToggleButtonClick}
    >
      {isLeftPanelOpenToUse ? "<" : ">"}
    </button>
  );
  const rightPanelButtonToUse = rightPanelToggleButton
    ? cloneElement(rightPanelToggleButton, {
        onClick: handleRightToggleButtonClick,
      })
    : internalRightPanelCloseButton;

  const leftPanelButtonToUse = leftPanelToggleButton
    ? cloneElement(leftPanelToggleButton, {
        onClick: handleLeftToggleButtonClick,
      })
    : internalLeftPanelCloseButton;

  return (
    <div className={layoutPanelStyles.layoutPanelsWrapper}>
      {leftPanelContent ? (
        <div
          className={`${layoutPanelStyles.panel} ${leftPanelClassName ?? ""}`}
          style={leftPanelDynamicStyles}
          ref={leftPanelRef}
        >
          {isLeftPanelToggelable ? (
            <div className={layoutPanelStyles.leftPanelCloseTab}>
              {leftPanelButtonToUse}
            </div>
          ) : null}
          {subpanelContent ? (
            <PanelContentsWithSubpanel
              isSubpanelOpen={isLeftSubpanelOpen!} // we ensure this is defined above
              setIsSubpanelOpen={setIsLeftSubpanelOpen!} // we ensure this is defined above
              subpanelContent={subpanelContent}
              mainPanelContent={leftPanelContent}
              isLeftPanelOpen={isLeftPanelOpenToUse}
              subpanelClassName={subpanelClassName}
            ></PanelContentsWithSubpanel>
          ) : (
            leftPanelContent
          )}
          {isLeftPanelResizable ? (
            <button
              className={layoutPanelStyles.leftPanelResizerTarget}
              onMouseDown={dragToResizeLeftPanel}
              onTouchStart={dragToResizeLeftPanel}
            />
          ) : null}
        </div>
      ) : null}
      <div className={layoutPanelStyles.centerSection}>{children}</div>

      {rightPanelContent ? (
        <div
          className={`${layoutPanelStyles.panel} ${rightPanelClassName ?? ""}`}
          style={rightPanelDynamicStyles}
          ref={rightPanelRef}
        >
          {isRightPanelToggelable ? (
            <div className={layoutPanelStyles.rightPanelCloseTab}>
              {rightPanelButtonToUse}
            </div>
          ) : null}
          {rightPanelContent}
          {isRightPanelResizable ? (
            <button
              className={layoutPanelStyles.rightPanelResizerTarget}
              onMouseDown={dragToResizeRightPanel}
              onTouchStart={dragToResizeRightPanel}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
