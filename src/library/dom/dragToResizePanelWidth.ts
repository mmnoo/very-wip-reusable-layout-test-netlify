export function dragToResizePanelWidth({
  event,
  divRef,
  onMoveEnd = () => {},
  isLeftEdgeResizeTarget = false,
}: {
  event: React.MouseEvent | React.TouchEvent;
  divRef: React.RefObject<HTMLDivElement>;
  onMoveEnd?: (newWidth: string) => void;
  isLeftEdgeResizeTarget?: boolean;
}): void {
  if (event.type.includes("mouse")) {
    // for touch events we rely on css's touch-action: none.
    // we dont call preventDefault for touch because to prevent console errors
    event.preventDefault();
  }

  if (!divRef.current) {
    throw new Error("divRef is not defined");
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
    const newWidthWithMin = newWidthRaw < 10 ? 10 : newWidthRaw;
    newWidthPixels = `${newWidthWithMin}px`;

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

  // Add both mouse and touch event listeners
  window.addEventListener("mousemove", handleMove);
  window.addEventListener("touchmove", handleMove);
  window.addEventListener("mouseup", handleEnd);
  window.addEventListener("touchend", handleEnd);
}
