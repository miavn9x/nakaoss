"use client";

import React from "react";
import { BannerBg, BannerElement, DeviceType, deviceWidths } from "../react-rnd/components/types";

interface BannerPreviewProps {
      data: {
            bannerBg: BannerBg;
            bannerHeights: Record<DeviceType, number>;
            elements: BannerElement[];
      };
      device?: DeviceType;
      zoom?: number;
}

export const BannerPreview: React.FC<BannerPreviewProps> = ({
      data,
      device = "desktop",
      zoom = 1,
}) => {
      const { bannerBg, bannerHeights, elements } = data;
      const bannerHeight = bannerHeights?.[device] ?? 300;
      const containerWidth = deviceWidths[device];

      // Hàm tính background cho outer wrapper
      const getBgStyle = (): React.CSSProperties => {
            if (bannerBg.type === "color") return { backgroundColor: bannerBg.value };
            if (bannerBg.type === "gradient") return { backgroundImage: bannerBg.value };
            if (bannerBg.type === "image") return {
                  backgroundImage: `url(${bannerBg.value})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
            };
            return {};
      };

      return (
            // Wrapper: clip để zoom không tràn ra ngoài
            <div
                  style={{
                        width: `${containerWidth * zoom}px`,
                        height: `${bannerHeight * zoom}px`,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                        borderRadius: "2px",
                  }}
            >
                  {/* Canvas thật: scale zoom lại, chứa toàn bộ phần tử */}
                  <div
                        style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: `${containerWidth}px`,
                              height: `${bannerHeight}px`,
                              transformOrigin: "top left",
                              transform: `scale(${zoom})`,
                              ...getBgStyle(),
                        }}
                  >
                        {elements.map((el, idx) => {
                              const bounds = el.bounds[device];
                              // Nếu thiết bị chưa có data bounds, fallback sang bounds của device khác
                              const resolvedBounds = bounds ?? el.bounds["desktop"] ?? el.bounds["ipad"] ?? el.bounds["mobile"];
                              if (!resolvedBounds) return null;

                              const elStyle: React.CSSProperties = {
                                    position: "absolute",
                                    left: `${resolvedBounds.leftPct}%`,
                                    top: `${resolvedBounds.topPct}%`,
                                    width: `${resolvedBounds.widthPct}%`,
                                    height: `${resolvedBounds.heightPct}%`,
                                    zIndex: idx + 10,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: el.type === "text" ? el.textAlign : "center",
                                    borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
                                    overflow: "hidden",
                                    padding: el.type === "text" ? `${el.padding}px` : undefined,
                                    boxSizing: "border-box",
                              };

                              // Background phần tử
                              if (el.backgroundFillType === "gradient" && el.backgroundGradient) {
                                    elStyle.backgroundImage = el.backgroundGradient;
                              } else if (el.backgroundColor && el.backgroundColor !== "transparent") {
                                    elStyle.backgroundColor = el.backgroundColor;
                              }

                              // Shadow phần tử
                              if (el.hasShadow) {
                                    elStyle.boxShadow = "rgba(0, 0, 0, 0.15) 0px 4px 12px";
                              }

                              // Gradient Border dùng CSS Mask
                              const renderBorder = () => {
                                    if (!el.hasBorder || !el.borderWidth) return null;
                                    const isGradient = el.borderFillType === "gradient" && el.borderGradient;
                                    return (
                                          <div
                                                style={{
                                                      position: "absolute",
                                                      inset: 0,
                                                      pointerEvents: "none",
                                                      zIndex: 2,
                                                      padding: `${el.borderWidth}px`,
                                                      borderRadius: el.borderRadius ? `${el.borderRadius}px` : undefined,
                                                      background: isGradient ? el.borderGradient! : el.borderColor,
                                                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                                      WebkitMaskComposite: "xor",
                                                      maskComposite: "exclude",
                                                }}
                                          />
                                    );
                              };

                              return (
                                    <div key={el.id} style={elStyle}>
                                          {renderBorder()}

                                          {/* Text */}
                                          {el.type === "text" && (
                                                <div
                                                      style={{
                                                            width: "100%",
                                                            wordBreak: "break-word",
                                                            whiteSpace: "pre-wrap",
                                                            color: el.textFillType === "color" ? el.color : "transparent",
                                                            backgroundImage: el.textFillType === "gradient" ? el.textGradient : "none",
                                                            WebkitBackgroundClip: el.textFillType === "gradient" ? "text" : "border-box",
                                                            WebkitTextFillColor: el.textFillType === "gradient" ? "transparent" : "unset",
                                                            textAlign: el.textAlign,
                                                            fontWeight: el.fontWeight,
                                                            fontStyle: el.fontStyle ?? "normal",
                                                            textDecoration: el.textDecoration ?? "none",
                                                            fontFamily: `${el.fontFamily}, sans-serif`,
                                                            // Font-size: pixel thật (không clamp – đã được scale bởi zoom wrapper cha)
                                                            fontSize: `${el.fontSize}px`,
                                                            lineHeight: "1.4",
                                                            position: "relative",
                                                            zIndex: 3,
                                                      }}
                                                      dangerouslySetInnerHTML={{ __html: el.text }}
                                                />
                                          )}

                                          {/* Image */}
                                          {el.type === "image" && (
                                                <div
                                                      style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            position: "relative",
                                                            zIndex: 10,
                                                            backgroundImage: el.imageUrl ? `url(${el.imageUrl})` : "none",
                                                            backgroundSize: "contain",
                                                            backgroundPosition: "center",
                                                            backgroundRepeat: "no-repeat",
                                                            opacity: el.imageOpacity ?? 1,
                                                      }}
                                                />
                                          )}
                                    </div>
                              );
                        })}
                  </div>
            </div>
      );
};
