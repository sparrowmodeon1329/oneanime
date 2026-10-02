'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause,
  Sparkles, 
  Film, 
  ExternalLink, 
  Info, 
  CheckCircle2, 
  Images, 
  Search, 
  RotateCcw, 
  RotateCw, 
  FastForward 
} from 'lucide-react';

export interface Episode {
  id: number;
  title: string;
  streamUrl: string;
}

export interface AnimeItem {
  id: string;
  title: string;
  posters: string[]; 
  language: string;
  totalEpisodes: number;
  description: string;
  episodes: Episode[];
}

const MY_ANIME_COLLECTION: AnimeItem[] = [
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen (Tamil Dub)',
    posters: [
      '/poster1.jpg',
    ],
    language: 'Tamil Dubbed',
    totalEpisodes: 2,
    description: 'Ryomen Sukuna curse finger storyline with high quality Tamil audio stream.',
    episodes: [
      {
        id: 1,
        title: 'Episode 1: Ryomen Sukuna',
        streamUrl: '/anime1.mp4',
      },
      {
        id: 2,
        title: 'Episode 2: For Myself',
        streamUrl: '/anime1.mp4',
      },
    ],
  },
  {
    id: 'naruto-shippuden',
    title: 'Naruto Shippuden (Tamil Dub)',
    posters: [
      '/poster2.jpg',
    ],
    language: 'Tamil Dubbed',
    totalEpisodes: 1,
    description: 'Naruto returns after intensive training to protect the Hidden Leaf Village.',
    episodes: [
      {
        id: 1,
        title: 'Episode 1: Homecoming',
        streamUrl: '/anime1.mp4',
      },
    ],
  },
];

export default function Home() {
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem>(MY_ANIME_COLLECTION[0]);
  const [selectedPosterIndex, setSelectedPosterIndex] = useState<number>(0);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(
    MY_ANIME_COLLECTION[0]?.episodes[0] || { id: 1, title: 'No Episode', streamUrl: '' }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 2.5 seconds auto-hide logic for mobile touch & laptop mouse move
  const triggerControls = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const handleAnimeSelect = (anime: AnimeItem) => {
    setSelectedAnime(anime);
    setSelectedPosterIndex(0);
    if (anime.episodes && anime.episodes.length > 0) {
      setCurrentEpisode(anime.episodes[0]);
      setIsPlaying(true);
    }
  };

  const handleEpisodeSelect = (ep: Episode) => {
    setCurrentEpisode(ep);
    setIsPlaying(true);
  };

  const handleSkip = (seconds: number) => {
    triggerControls();
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const togglePlayPause = () => {
    triggerControls();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVideoEnded = () => {
    const currentIndex = selectedAnime.episodes.findIndex((ep) => ep.id === currentEpisode.id);
    if (currentIndex !== -1 && currentIndex < selectedAnime.episodes.length - 1) {
      setCurrentEpisode(selectedAnime.episodes[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const filteredCollection = MY_ANIME_COLLECTION.filter((anime) =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    anime.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 selection:bg-red-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3.5 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 font-black text-white shadow-lg shadow-red-600/30">
            1A
          </span>
          <div>
            <h1 className="text-xl font-black tracking-wider text-white">
              ONE<span className="text-red-500">ANIME</span>
            </h1>
            <p className="text-[10px] font-medium tracking-wide text-zinc-400">
              TAMIL ANIME STREAMING HUB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            <Sparkles className="h-3.5 w-3.5" /> Multi-Poster & Tamil Audio
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Cinema Video Frame */}
        <section className="mb-10 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div 
            onClick={triggerControls}
            onMouseMove={triggerControls}
            onTouchStart={triggerControls}
            className="relative aspect-video w-full bg-black cursor-pointer select-none"
          >
            {currentEpisode.streamUrl ? (
              <>
                <video
                  ref={videoRef}
                  key={currentEpisode.streamUrl}
                  src={currentEpisode.streamUrl}
                  controls
                  autoPlay
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={handleVideoEnded}
                  className="h-full w-full object-contain focus:outline-none"
                >
                  Your browser does not support HTML5 video streaming.
                </video>

                {/* Mobile & Laptop Auto-Hide Floating Controls */}
                <div 
                  className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-6 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip(-10);
                    }}
                    title="Rewind 10 seconds"
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/80 text-white shadow-lg transition hover:scale-110 hover:bg-red-600 active:scale-95"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    title={isPlaying ? 'Pause' : 'Play'}
                    className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/50 transition hover:scale-110 active:scale-95"
                  >
                    {isPlaying ? <Pause className="h-6 w-6 fill-white" /> : <Play className="h-6 w-6 fill-white ml-0.5" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSkip(10);
                    }}
                    title="Forward 10 seconds"
                    className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-black/80 text-white shadow-lg transition hover:scale-110 hover:bg-red-600 active:scale-95"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                <Info className="h-10 w-10 text-zinc-600" />
                <p className="text-sm font-medium text-zinc-400">
                  No active video stream URL configured for this episode.
                </p>
              </div>
            )}
          </div>

          {/* Episode Info */}
          <div className="border-t border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Now Playing
                  </span>
                  <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-300">
                    {selectedAnime.language}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-white sm:text-2xl">
                  {selectedAnime.title} — {currentEpisode.title}
                </h2>
              </div>

              {currentEpisode.streamUrl && (
                <a
                  href={currentEpisode.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                >
                  Direct Stream Link <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-zinc-400 sm:text-sm">
              {selectedAnime.description}
            </p>

            {/* Poster Gallery Selector */}
            <div className="mt-5 border-t border-zinc-800/80 pt-4">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                <Images className="h-3.5 w-3.5 text-red-500" /> Anime Posters ({selectedAnime.posters.length} Available):
              </span>
              <div className="mt-2.5 flex items-center gap-3">
                {selectedAnime.posters.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPosterIndex(idx)}
                    className={`relative h-16 w-12 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedPosterIndex === idx
                        ? 'border-red-500 ring-2 ring-red-500/50 scale-105'
                        : 'border-zinc-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Poster Thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Selectors */}
            <div className="mt-5 border-t border-zinc-800/80 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Choose Episode:
                </span>
                <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <FastForward className="h-3 w-3 text-red-500" /> Auto-play Next Enabled
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {selectedAnime.episodes.map((ep) => {
                  const isEpPlaying = currentEpisode.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleEpisodeSelect(ep)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                        isEpPlaying
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-400'
                          : 'border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {isEpPlaying && <CheckCircle2 className="h-3.5 w-3.5" />}
                      Episode {ep.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Custom Collection Grid with Instant Search */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
              <Film className="h-5 w-5 text-red-500" /> Your Anime Library
            </h3>
            
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anime or dub..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 pl-9 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filteredCollection.map((anime) => {
              const isSelected = selectedAnime.id === anime.id;
              const activePoster = isSelected ? anime.posters[selectedPosterIndex] || anime.posters[0] : anime.posters[0];

              return (
                <div
                  key={anime.id}
                  onClick={() => handleAnimeSelect(anime)}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'border-red-500 bg-zinc-900 shadow-xl shadow-red-500/10 ring-2 ring-red-500/40'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900">
                    <img
                      src={activePoster}
                      alt={anime.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-3.5">
                      <span className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                        <Play className="h-3.5 w-3.5 fill-white" /> Watch
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5">
                    <h4 className="line-clamp-1 text-sm font-bold text-zinc-100 group-hover:text-red-400">
                      {anime.title}
                    </h4>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{anime.language}</span>
                      <span>{anime.posters.length} Posters</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}