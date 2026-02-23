import {
  AbsoluteFill,
  Html5Audio,
  Html5Video,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Sequence
} from "remotion";

import {myPhotos} from "./photoList";

const durationPerPhoto = 3; // seconds

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const introDuration = 5 * fps;
  const photoDurationFrames = durationPerPhoto * fps;
  const slideshowStart = introDuration;

  // Fade out música últimos 3 segundos
  const fadeOutStart = durationInFrames - 3 * fps;

  const bgVolume =
    frame < fadeOutStart
      ? 0.4
      : interpolate(frame, [fadeOutStart, durationInFrames], [0.4, 0], {
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#1b1b1b, #303030)" }}>
      {/* Música fondo */}
      <Html5Audio src={staticFile("/Background.mp3")} volume={bgVolume} />

      {/* Intro video */}
      {frame < introDuration && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Html5Video src={staticFile("/intro.mp4")} volume={0} />
        </AbsoluteFill>
      )}

      {/* Slideshow */}
      {myPhotos.map((foto, index) => {
        const start = slideshowStart + index * photoDurationFrames;
        const end = start + photoDurationFrames;

        if (frame < start || frame > end) return null;

        const localFrame = frame - start;

        const scale = interpolate(
          localFrame,
          [0, photoDurationFrames],
          [0.9, 1.0]
        );

        const rotation = (index * 7) % 10 - 5;

        return (
          <AbsoluteFill
            key={foto}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Shutter sound al inicio */}
<Sequence from={start} durationInFrames={20}>
  <Html5Audio
    src={staticFile("/shutter.mp3")}
    volume={0.7}
  />
</Sequence>

            <div
              style={{
                background: "white",
                padding: 40,
                boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
                transform: `scale(${scale}) rotate(${rotation}deg)`,
              }}
            >
              <Img
                src={staticFile(`/photos/${foto}`)}
                style={{
                  width: "100%",
                  borderRadius: 4,
                }}
              />
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
