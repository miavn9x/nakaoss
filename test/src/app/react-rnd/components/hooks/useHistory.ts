import { useState, useCallback } from "react";
import { BannerElement, BannerBg } from "../types";

type HistorySnapshot = {
      elements: BannerElement[];
      bannerBg: BannerBg;
};

export function useHistory(
      initialElements: BannerElement[],
      initialBannerBg: BannerBg,
      setElements: React.Dispatch<React.SetStateAction<BannerElement[]>>,
      setBannerBg: React.Dispatch<React.SetStateAction<BannerBg>>
) {
      const [past, setPast] = useState<HistorySnapshot[]>([]);
      const [future, setFuture] = useState<HistorySnapshot[]>([]);

      // Function to record a new state into history
      const recordHistory = useCallback(
            (newElements: BannerElement[], newBannerBg: BannerBg) => {
                  setPast((prev) => {
                        // Limit history to 30 steps to preserve memory
                        const newPast = [...prev, { elements: newElements, bannerBg: newBannerBg }];
                        if (newPast.length > 30) {
                              return newPast.slice(newPast.length - 30);
                        }
                        return newPast;
                  });
                  // Clear future when making a new change
                  setFuture([]);
            },
            []
      );

      const undo = useCallback(
            (currentElements: BannerElement[], currentBannerBg: BannerBg) => {
                  setPast((prev) => {
                        if (prev.length === 0) return prev;
                        const previousState = prev[prev.length - 1];
                        const newPast = prev.slice(0, prev.length - 1);

                        // Push current state to future
                        setFuture((f) => [{ elements: currentElements, bannerBg: currentBannerBg }, ...f]);

                        // Apply previous state
                        setElements(previousState.elements);
                        setBannerBg(previousState.bannerBg);

                        return newPast;
                  });
            },
            [setElements, setBannerBg]
      );

      const redo = useCallback(
            (currentElements: BannerElement[], currentBannerBg: BannerBg) => {
                  setFuture((prev) => {
                        if (prev.length === 0) return prev;
                        const nextState = prev[0];
                        const newFuture = prev.slice(1);

                        // Push current state to past
                        setPast((p) => [...p, { elements: currentElements, bannerBg: currentBannerBg }]);

                        // Apply next state
                        setElements(nextState.elements);
                        setBannerBg(nextState.bannerBg);

                        return newFuture;
                  });
            },
            [setElements, setBannerBg]
      );

      return {
            past,
            future,
            recordHistory,
            undo,
            redo,
      };
}
