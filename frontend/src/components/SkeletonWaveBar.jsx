export default function SkeletonWaveBlur({ className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 wave-water-bar" />

      <style>
        {`
          .wave-water-bar {
            position: absolute;
            top: -40%;
            left: -60%;
            width: 9%; /* SHORT BAR */
            height: 180%;
            transform: rotate(18deg);
            animation: wave-water-move 2.4s linear infinite;

            /* HEAVY WHITE WATER SHIMMER */
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.25),
              rgba(255, 255, 255, 0.95),
              rgba(255, 255, 255, 0.25),
              transparent
            );

            filter: blur(6px);
          }

          @keyframes wave-water-move {
            0% {
              left: -60%;
            }
            100% {
              left: 140%;
            }
          }

          .dark .wave-water-bar {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.08),
              rgba(255, 255, 255, 0.25),
              rgba(255, 255, 255, 0.08),
              transparent
            );
          }
        `}
      </style>
    </div>
  );
}
