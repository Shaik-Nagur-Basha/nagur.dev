import React, { useState, useEffect, useRef } from "react";

export default function ProjectMedia({
  src, // legacy fallback
  mediaType,
  videoSrc,
  thumbnailSrc,
  isHovered = false,
  alt = "",
  className = "",
  videoClassName = "",
  imgClassName = "",
  onLoad,
  onLoadedData,
  autoPlay = false,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  preload,
  groupHoverScale = false,
  forceContain = false,
}) {
  const [isNear169, setIsNear169] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);

  // Detect mobile screen (width < 768px for md breakpoint)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Determine final sources
  const finalVideoSrc = videoSrc || (mediaType === "video" ? src : null);
  const finalThumbnailSrc = thumbnailSrc || (mediaType === "image" ? src : null);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      setIsNear169(ratio >= 1.4 && ratio <= 2.1);
    }
    if (onLoad) onLoad(e);
  };

  const handleVideoLoad = (e) => {
    const { videoWidth, videoHeight } = e.target;
    if (videoWidth && videoHeight) {
      const ratio = videoWidth / videoHeight;
      setIsNear169(ratio >= 1.4 && ratio <= 2.1);
    }
    if (onLoadedData) onLoadedData(e);
  };

  // Play/Pause control based on hover
  useEffect(() => {
    if (mediaType !== "video" || !videoRef.current || isMobile || controls) return;

    if (isHovered) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay on hover prevented:", error);
        });
      }
    } else {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
  }, [isHovered, isMobile, mediaType, controls]);

  const fitClass = forceContain ? "object-contain" : (isNear169 ? "object-cover" : "object-contain");
  const zoomClass = (groupHoverScale && isNear169 && !forceContain) ? "transition-transform duration-500 group-hover:scale-105" : "";

  // Render Image only
  if (mediaType === "image") {
    return (
      <img
        src={finalThumbnailSrc}
        alt={alt}
        className={`${className} ${imgClassName} ${fitClass} ${zoomClass}`}
        onLoad={handleImageLoad}
      />
    );
  }

  // Render Video with optional Thumbnail fallback
  if (mediaType === "video") {
    // Determine preload behavior
    // If we have a thumbnail, we can delay loading video content entirely (preload="none")
    // If we don't have a thumbnail, we must get first frame (preload="metadata")
    const finalPreload = preload || (finalThumbnailSrc ? "none" : "metadata");

    // On mobile, just show thumbnail if available, otherwise show static video frame
    if (isMobile) {
      if (finalThumbnailSrc) {
        return (
          <img
            src={finalThumbnailSrc}
            alt={alt}
            className={`${className} ${imgClassName} ${fitClass} ${zoomClass}`}
            onLoad={handleImageLoad}
          />
        );
      }
      return (
        <video
          src={finalVideoSrc}
          className={`${className} ${videoClassName} ${fitClass} ${zoomClass}`}
          preload={autoPlay ? "auto" : "metadata"}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          onLoadedData={handleVideoLoad}
          onLoadedMetadata={handleVideoLoad}
        />
      );
    }

    // On desktop/tablet, support hover play
    return (
      <div className={`relative ${className} overflow-hidden`}>
        {/* Thumbnail Image (acts as fallback/background) */}
        {finalThumbnailSrc && (
          <img
            src={finalThumbnailSrc}
            alt={alt}
            className={`absolute inset-0 w-full h-full ${imgClassName} ${fitClass} ${zoomClass} transition-opacity duration-300 ${
              isHovered && !controls ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
          />
        )}
        
        {/* Video Player */}
        <video
          ref={videoRef}
          src={finalVideoSrc}
          className={`w-full h-full ${videoClassName} ${fitClass} ${zoomClass} transition-opacity duration-300 ${
            finalThumbnailSrc ? (isHovered || controls ? "opacity-100 relative z-10" : "opacity-0 absolute inset-0") : "opacity-100"
          }`}
          autoPlay={isHovered || autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          preload={finalPreload}
          onLoadedData={handleVideoLoad}
          onLoadedMetadata={handleVideoLoad}
        >
          <source src={finalVideoSrc} type="video/mp4" />
        </video>
      </div>
    );
  }

  return null;
}
