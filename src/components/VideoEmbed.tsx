
import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoEmbedProps {
  videoId: string;
  title: string;
  thumbnail?: string;
}

const VideoEmbed = ({ videoId, title, thumbnail }: VideoEmbedProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const usedThumbnail = thumbnail || defaultThumbnail;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => setIsLoading(false);
    }
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-telemetria-dark shadow-lg aspect-video w-full">
      {!isPlaying ? (
        <button
          className="group absolute inset-0 flex items-center justify-center w-full h-full cursor-pointer"
          onClick={handlePlay}
          aria-label="Reproduzir vídeo"
        >
          <img
            src={usedThumbnail}
            alt={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-telemetria-darker/40 group-hover:bg-telemetria-darker/50 transition-all duration-300"></div>
          <div className="relative flex flex-col items-center gap-4 z-10 p-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-telemetria-yellow/90 text-telemetria-dark transition-transform duration-300 group-hover:scale-110 group-hover:bg-telemetria-yellow">
              <Play fill="currentColor" size={24} className="ml-1" />
            </div>
            <div className="text-center">
              <h3 className="text-white text-lg font-medium group-hover:text-telemetria-yellow transition-colors">
                {title}
              </h3>
              <p className="text-white/80 text-sm mt-1">Clique para assistir</p>
            </div>
          </div>
        </button>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-telemetria-dark">
              <div className="w-10 h-10 border-4 border-telemetria-yellow/20 border-t-telemetria-yellow rounded-full animate-spin"></div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={cn(
              "absolute inset-0",
              isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"
            )}
          ></iframe>
        </>
      )}
    </div>
  );
};

export default VideoEmbed;
