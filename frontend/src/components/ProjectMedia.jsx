import React, { useState } from "react";

export default function ProjectMedia({
  src,
  mediaType,
  alt = "",
  className = "",
  videoClassName = "",
  imgClassName = "",
  onLoad,
  onLoadedData,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  preload = "metadata",
  groupHoverScale = false,
}) {
  const [isNear169, setIsNear169] = useState(true);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      // "Near 16:9" means aspect ratio is between 1.5 and 2.0 (16:9 is ~1.78)
      setIsNear169(ratio >= 1.5 && ratio <= 2.0);
    }
    if (onLoad) onLoad(e);
  };

  const handleVideoLoad = (e) => {
    const { videoWidth, videoHeight } = e.target;
    if (videoWidth && videoHeight) {
      const ratio = videoWidth / videoHeight;
      setIsNear169(ratio >= 1.5 && ratio <= 2.0);
    }
    if (onLoadedData) onLoadedData(e);
  };

  const fitClass = isNear169 ? "object-cover" : "object-contain";
  const zoomClass = (groupHoverScale && isNear169) ? "transition-transform duration-500 group-hover:scale-105" : "";

  if (mediaType === "video" && src) {
    return (
      <video
        src={src}
        className={`${className} ${videoClassName} ${fitClass} ${zoomClass}`}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        preload={preload}
        onLoadedData={handleVideoLoad}
        onLoadedMetadata={handleVideoLoad}
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${imgClassName} ${fitClass} ${zoomClass}`}
      onLoad={handleImageLoad}
    />
  );
}
