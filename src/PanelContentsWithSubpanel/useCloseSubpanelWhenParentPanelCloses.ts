import { useEffect } from "react";

export const useCloseSubpanelWhenParentPanelCloses = ({
  isLeftPanelOpen,
  setIsSubpanelOpen,
}: {
  isLeftPanelOpen: boolean;
  setIsSubpanelOpen: (arg: boolean) => void;
}) => {
  useEffect(() => {
    if (!isLeftPanelOpen) {
      setIsSubpanelOpen(false);
    }
  });
};
