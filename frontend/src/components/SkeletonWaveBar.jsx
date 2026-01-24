export default function SkeletonWaveBlur({ className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blurred diagonal wave bar */}
      <div className="absolute inset-0 wave-blur-bar" />

      <style>
        {`
          .wave-blur-bar {
            position: absolute;
            top: -50%;
            left: -70%;
            width: 45%;
            height: 200%;
            transform: rotate(20deg);
            animation: wave-move 2.4s ease-in-out infinite;

            /* THIS is the key part */
            background: linear-gradient(
              90deg,
              transparent,
              rgba(127, 127, 127, 0.08),
              rgba(127, 127, 127, 0.25),
              rgba(127, 127, 127, 0.08),
              transparent
            );
          }

          @keyframes wave-move {
            0% {
              left: -70%;
            }
            100% {
              left: 140%;
            }
          }

          .dark .wave-blur-bar {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(127, 127, 127, 0.08),
              rgba(127, 127, 127, 0.25),
              rgba(127, 127, 127, 0.08),
              transparent
            );
          }
        `}
      </style>
    </div>
  );
}
