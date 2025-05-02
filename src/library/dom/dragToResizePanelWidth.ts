import { convertCssWidthPropertyValueToPixels } from "./convertCssWidthPropertyToPixels";

export function dragToResizePanelWidth({
  closePanel = () => {},
  divRef,
  event,
  isLeftEdgeResizeTarget = false,
  onMoveEnd = () => {},
}: {
  closePanel: () => void;
  divRef: React.RefObject<HTMLDivElement>;
  event: React.MouseEvent | React.TouchEvent;
  isLeftEdgeResizeTarget?: boolean;
  onMoveEnd?: (newWidth: string) => void;
}): void {
  if (event.type.includes("mouse")) {
    // for touch events we rely on css's touch-action: none.
    // we dont call preventDefault for touch to prevent console errors
    event.preventDefault();
  }

  if (!divRef.current) {
    throw new Error("divRef.current is not defined");
  }

  const panelRectangle = divRef.current.getBoundingClientRect();
  const previousTransition = divRef.current.style.transition;

  const previousX =
    "touches" in event ? event.touches[0].screenX : event.screenX;

  divRef.current.style.transition = "none"; // remove the transition do the div width updates in real time with the mouse/touch movement

  let newWidthPixels: string = `${panelRectangle.width}px`;

  const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
    const currentX =
      "touches" in moveEvent ? moveEvent.touches[0].screenX : moveEvent.screenX;

    const newX = previousX - currentX;
    const newWidthRaw = isLeftEdgeResizeTarget
      ? panelRectangle.width + newX
      : panelRectangle.width - newX;
    const isNewWidthNegative = newWidthRaw < 0;
    if (isNewWidthNegative) {
      return;
    }
    const currentCssMaxWidth = convertCssWidthPropertyValueToPixels({
      element: divRef.current!,
      cssProperty: "max-width",
    });
    const currentCssMinWidth = convertCssWidthPropertyValueToPixels({
      element: divRef.current!,
      cssProperty: "min-width",
    });

    const isNewWidthSmallerThanMinWidth =
      newWidthRaw < (currentCssMinWidth ?? 10);
    const isNewWidthBiggerThanMaxWidth =
      newWidthRaw > (currentCssMaxWidth ?? 300);

    if (isNewWidthSmallerThanMinWidth || newWidthRaw < 10) {
      // we hedge against min-width being less than 10px
      // to leave a slice of panel width for when the panel
      // gets opened again.
      handleEnd();
      closePanel();
      return;
    }
    if (isNewWidthBiggerThanMaxWidth) {
      // no need to continue on to update element width, as it is already at max width.
      return;
    }

    newWidthPixels = `${newWidthRaw}px`;
    divRef.current!.style.width = newWidthPixels;
  };

  const handleEnd = () => {
    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("touchmove", handleMove);
    window.removeEventListener("mouseup", handleEnd);
    window.removeEventListener("touchend", handleEnd);
    divRef.current!.style.transition = previousTransition;
    onMoveEnd(newWidthPixels);
  };

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("touchmove", handleMove);
  window.addEventListener("mouseup", handleEnd);
  window.addEventListener("touchend", handleEnd);
}
