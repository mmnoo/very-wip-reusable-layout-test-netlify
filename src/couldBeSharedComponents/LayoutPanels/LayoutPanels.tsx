import {
  Dispatch,
  // MouseEvent,
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
  isRightPanelResizable?: boolean;
  isRightPanelToggelable?: boolean;
  leftPanelClassName?: string;
  leftPanelContent?: ReactNode;
  rightPanelContent?: ReactNode;
  setIsLeftPanelOpen?: Dispatch<SetStateAction<boolean>>;
}

export const LayoutPanels = ({
  children,
  isLeftPanelOpen = undefined,
  isLeftPanelResizable = false,
  isLeftPanelToggelable = true,
  isRightPanelResizable = false,
  isRightPanelToggelable = true,
  leftPanelClassName,
  leftPanelContent,
  rightPanelContent,
  setIsLeftPanelOpen = undefined,
}: LayoutPanelsProps) => {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  // todo: validate props that need to go together isLeftPAnelOpen, setIsLeftPanelOpen, throw errors if one not present
  // todo: make it possible for right panel open state to be controlled by parent
  const [isLeftPanelOpenInternal, setIsLeftPanelOpenInternal] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [leftPanelResizableWidth, setLeftPanelResizableWidth] =
    useState<string>();
  const [rightPanelResizableWidth, setRightPanelResizableWidth] =
    useState<string>();

  const isLeftPanelOpenToUse = isLeftPanelOpen ?? isLeftPanelOpenInternal;
  const setIsLeftPanelOpenToUse =
    setIsLeftPanelOpen ?? setIsLeftPanelOpenInternal;
  const leftPanelDynamicStyles = useMemo(
    () => ({
      width: leftPanelResizableWidth,
      marginLeft: isLeftPanelOpenToUse ? "0px" : `-${leftPanelResizableWidth}`,
    }),
    [isLeftPanelOpenToUse, leftPanelResizableWidth]
  );
  const rightPanelDynamicStyles = {
    width: rightPanelResizableWidth,
    marginRight: isRightPanelOpen ? "0px" : `-${rightPanelResizableWidth}`,
  };

  useEffect(function initialzeResizableWidths() {
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
    });
  };

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
              <button
                className={layoutPanelStyles.panelCloseButton}
                onClick={() => setIsLeftPanelOpenToUse((previous) => !previous)}
              >
                {isLeftPanelOpenToUse ? "<" : ">"}
              </button>
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
          className={layoutPanelStyles.panel}
          style={rightPanelDynamicStyles}
          ref={rightPanelRef}
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
