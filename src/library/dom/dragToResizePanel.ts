export function dragToResizePanel({
  event,
  divRef,
  onMouseUp = () => {},
  isLeftEdgeResizeTarget = false,
}: {
  event: React.MouseEvent;
  divRef: React.RefObject<HTMLDivElement>;
  onMouseUp?: (newWidth: string) => void;
  isLeftEdgeResizeTarget?: boolean;
}): void {
  event.preventDefault();

  if (!divRef.current) {
    throw new Error("divRef is not defined");
  }

  const panelRectangle = divRef.current.getBoundingClientRect();
  const previousTransition = divRef.current.style.transition;
  const previousX = event.screenX;

  divRef.current.style.transition = "none"; // remove the transition do the div width updates in real time with the mouse movement

  let newWidthPixels: string = `${panelRectangle.width}px`;

  const mousemove = (windowMouseMoveEvent: MouseEvent) => {
    const newX = previousX - windowMouseMoveEvent.x;
    const newWidth = isLeftEdgeResizeTarget
      ? panelRectangle.width + newX
      : panelRectangle.width - newX;
    newWidthPixels = `${newWidth}px`;
    divRef.current!.style.width = newWidthPixels;
  };

  const mouseup = () => {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
    divRef.current!.style.transition = previousTransition;
    onMouseUp(newWidthPixels);
  };

  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
}
