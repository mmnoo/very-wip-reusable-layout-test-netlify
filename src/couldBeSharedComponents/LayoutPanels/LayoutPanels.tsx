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

export interface LayoutPanelsProps {
  children: ReactNode;
  isLeftPanelOpen?: boolean;
  isLeftPanelResizable?: boolean;
  isLeftPanelToggelable?: boolean;
  isRightPanelOpen?: boolean;
  isRightPanelResizable?: boolean;
  isRightPanelToggelable?: boolean;
  leftPanelClassName?: string;
  rightPanelClassName?: string;
  leftPanelContent?: ReactNode;
  leftPanelToggleButton?: ReactElement;
  rightPanelContent?: ReactNode;
  rightPanelToggleButton?: ReactElement;
  setIsLeftPanelOpen?: Dispatch<SetStateAction<boolean>>;
  setIsRightPanelOpen?: Dispatch<SetStateAction<boolean>>;
}

export const LayoutPanels = ({
  children,
  isLeftPanelOpen = undefined,
  isLeftPanelResizable = false,
  isLeftPanelToggelable = true,
  isRightPanelOpen = undefined,
  isRightPanelResizable = false,
  isRightPanelToggelable = true,
  leftPanelClassName = undefined,
  rightPanelClassName = undefined,
  leftPanelContent = undefined,
  leftPanelToggleButton = undefined,
  rightPanelContent = undefined,
  rightPanelToggleButton = undefined,
  setIsLeftPanelOpen = undefined,
  setIsRightPanelOpen = undefined,
}: LayoutPanelsProps) => {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [isLeftPanelOpenInternal, setIsLeftPanelOpenInternal] = useState(true);
  const [isRightPanelOpenInternal, setIsRightPanelOpenInternal] =
    useState(true);
  const [leftPanelResizableWidth, setLeftPanelResizableWidth] =
    useState<string>("300px"); // gets overriden with CSS, but best to have a default value
  const [rightPanelResizableWidth, setRightPanelResizableWidth] =
    useState<string>("300px"); // gets overriden with CSS, but best to have a default value

  const isLeftPanelOpenToUse = isLeftPanelOpen ?? isLeftPanelOpenInternal;
  const isRightPanelOpenToUse = isRightPanelOpen ?? isRightPanelOpenInternal;
  const setIsLeftPanelOpenToUse =
    setIsLeftPanelOpen ?? setIsLeftPanelOpenInternal;
  const setIsRightPanelOpenToUse =
    setIsRightPanelOpen ?? setIsRightPanelOpenInternal;
  const leftPanelDynamicStyles = useMemo(
    () => ({
      width: leftPanelResizableWidth,
      marginLeft: isLeftPanelOpenToUse ? "0px" : `-${leftPanelResizableWidth}`,
    }),
    [isLeftPanelOpenToUse, leftPanelResizableWidth]
  );
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
          className={`${layoutPanelStyles.panel} ${leftPanelClassName}`}
          style={leftPanelDynamicStyles}
          ref={leftPanelRef}
        >
          {isLeftPanelToggelable ? (
            <div className={layoutPanelStyles.leftPanelCloseTab}>
              {leftPanelButtonToUse}
            </div>
          ) : null}
          {leftPanelContent}
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
          className={`${layoutPanelStyles.panel} ${rightPanelClassName}`}
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
