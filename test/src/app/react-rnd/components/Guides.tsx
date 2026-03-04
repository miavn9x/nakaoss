import React from "react";
import { ActiveGuide } from "./types";

interface GuidesProps {
      activeGuides: ActiveGuide[];
}

export const Guides: React.FC<GuidesProps> = ({ activeGuides }) => {
      if (!activeGuides || activeGuides.length === 0) return null;

      return (
            <>
                  {activeGuides.map((guide, i) => {
                        if (guide.type === "vertical") {
                              return (
                                    <div
                                          key={i}
                                          style={{
                                                position: "absolute",
                                                top: 0,
                                                bottom: 0,
                                                left: guide.position,
                                                width: "1px",
                                                backgroundColor: "#ec4899", // pink-500
                                                zIndex: 9999,
                                                pointerEvents: "none",
                                          }}
                                    />
                              );
                        } else {
                              return (
                                    <div
                                          key={i}
                                          style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                top: guide.position,
                                                height: "1px",
                                                backgroundColor: "#ec4899",
                                                zIndex: 9999,
                                                pointerEvents: "none",
                                          }}
                                    />
                              );
                        }
                  })}
            </>
      );
};
