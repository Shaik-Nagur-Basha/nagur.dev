export default function SkeletonWaveBlur({ className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="skeleton-wave-bar" />

      <style>
        {`
          /* Animation keyframes for shimmer wave effect */
          @keyframes shimmer-progress {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }

          /* Light mode: Darker wave effect */
          .skeleton-wave-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(150, 150, 150, 0.15) 25%,
              rgba(200, 200, 200, 0.6) 50%,
              rgba(150, 150, 150, 0.15) 75%
            );
            background-size: 200% 100%;
            animation: shimmer-progress 1.5s infinite;
          }

          /* Dark mode: Lighter wave effect */
          .dark .skeleton-wave-bar {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.08) 25%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(255, 255, 255, 0.08) 75%
            );
            background-size: 200% 100%;
            animation: shimmer-progress 1.5s infinite;
          }
        `}
      </style>
    </div>
  );
}
