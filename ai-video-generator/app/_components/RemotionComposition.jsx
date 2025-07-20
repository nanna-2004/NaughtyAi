"use client";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import React from "react";

export const RemotionComposition = ({ videoData }) => {
  const { fps, durationInFrames } = useVideoConfig();

  if (!videoData || !videoData.images || videoData.images.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ color: "white", fontSize: 40 }}>Waiting for assets...</h1>
      </AbsoluteFill>
    );
  }

  const { images, captions, audioUrl, captionStyle } = videoData;
  const imageDurationInFrames = Math.max(1, Math.floor(durationInFrames / images.length));

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {audioUrl && <Audio src={audioUrl} />}

      {images.map((imageUrl, index) => {
        const scale = interpolate(
          useCurrentFrame() - index * imageDurationInFrames,
          [0, imageDurationInFrames],
          [1, 1.1],
          { extrapolateRight: "clamp" }
        );

        return (
          <Sequence
            key={imageUrl}
            from={index * imageDurationInFrames}
            durationInFrames={imageDurationInFrames}
          >
            <AbsoluteFill>
              <Img
                src={imageUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${scale})`,
                }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* ✅ Captions now centered at bottom */}
      <AbsoluteFill>
  <div
    style={{
      position: "absolute",
      bottom: 80, // Adjust if needed
      width: "100%",
      textAlign: "center",
    }}
  >
    <CaptionSequence captions={captions} fps={fps} captionStyle={captionStyle} />
  </div>
</AbsoluteFill>

    </AbsoluteFill>
  );
};

const getCaptionStyle = (styleName) => {
  const baseStyle = {
    fontFamily: `Arial, "Helvetica Neue", Helvetica, sans-serif`,
    fontWeight: "bold",
    fontSize: "90px",
    textAlign: "center",
    color: "white",
    textShadow: "0px 0px 25px rgba(0,0,0,0.8)",
  };

  switch (styleName) {
    case 'Bold Yellow': return { ...baseStyle, color: '#FFC700' };
    case 'Mono Style': return { ...baseStyle, fontFamily: 'monospace', color: '#00FF41' };
    case 'Large Subtitle': return { ...baseStyle, fontSize: '110px', color: '#87CEEB' };
    case 'Classic White Shadow': return { ...baseStyle, textShadow: '5px 5px 10px rgba(0,0,0,0.75)' };
    case 'RGB Light': return { ...baseStyle, color: 'transparent' };
    default: return baseStyle;
  }
};

const RgbText = ({ text, style }) => {
  const frame = useCurrentFrame();
  const colors = ["#ff0000", "#00ff00", "#0000ff"];
  const color = colors[Math.floor(frame / 15) % colors.length];
  return (
    <h1
      style={{
        ...style,
        color,
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
      }}
    >
      {text}
    </h1>
  );
};

const CaptionSequence = ({ captions, fps, captionStyle }) => {
  const frame = useCurrentFrame();
  const currentTime = frame / fps;
  const currentCaption = captions?.find(
    (item) => currentTime >= item.start && currentTime <= item.end
  );

  if (!currentCaption) return null;

  const style = getCaptionStyle(captionStyle);
  const word = currentCaption.word;

  if (captionStyle === "RGB Light") {
    return <RgbText text={word} style={style} />;
  }

  return <h1 style={style}>{word}</h1>;
};

export default RemotionComposition;
