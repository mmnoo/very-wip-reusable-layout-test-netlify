import { useEffect } from "react";

export const useCloseSubpanelWhenParentPanelCloses = ({
  isLeftPanelOpen,
  setIsSubpanelOpen,
}: {
  isLeftPanelOpen: boolean;
  setIsSubpanelOpen: (arg: boolean) => unknown;
}) => {
  useEffect(() => {
    if (!isLeftPanelOpen) {
      setIsSubpanelOpen(false);
    }
  });
};
