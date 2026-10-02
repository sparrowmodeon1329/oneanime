'use client';

import React, { useState } from 'react';

interface Episode {
  id: number;
  title: string;
  duration: string;
  streamUrl: string;
}

interface Anime {
  id: string;
  title: string;
  originalTitle: string;
  genre: string[];
  rating: string;
  synopsis: string;
  poster: string;
  episodes: Episode[];
}

const animeList: Anime[] = [
  {
    id: 'black-clover',
    title: 'Black Clover (Tamil Dub)',
    originalTitle: 'ブラッククローバー',
    genre: ['Action', 'Magic', 'Fantasy', 'Shounen'],
    rating: '8.3/10',
    synopsis: 'Asta and Yuno were abandoned at the same church on the same day. While Yuno possesses exceptional magical powers, Asta was born completely without magic. Follow their journey to become the Wizard King!',
    poster: '/poster1.jpg',
    episodes: [
      {
        id: 1,
        title: 'Episode 1: Asta and Yuno (தமிழ்)',
        duration: '23m',
        streamUrl: 'https://drive.google.com/file/d/19Hq3M9_Iy7EJ3aIUGn3loTjpK6ZqXNpK/preview',
      },
      {
        id: 2,
        title: 'Episode 2: A Boys Vow',
        duration: '23m',
        streamUrl: '',
      },
    ],
  },
  {
    id: 'jjk',
    title: 'Jujutsu Kaisen (Tamil Dub)',
    originalTitle: '呪術廻戦',
    genre: ['Supernatural', 'Action', 'Dark Fantasy'],
    rating: '8.6/10',
    synopsis: 'Yuji Itadori swallows a cursed talisman - the finger of Ryomen Sukuna - and becomes cursed himself to enter the world of Jujutsu sorcerers.',
    poster: '/poster2.jpg',
    episodes: [
      {
        id: 1,
        title: 'Episode 1: Ryomen Sukuna',
        duration: '24m',
        streamUrl: '',
      },
    ],
  },
];

export default function Home() {
  const [selectedAnime, setSelectedAnime] = useState<Anime>(animeList[0]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>(animeList[0].episodes[0]);

  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
    setCurrentEpisode(anime.episodes[0]);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
            OA
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">OneAnime</h1>
            <p className="text-xs text-neutral-400">Tamil Anime Streaming Hub</p>
          </div>
        </div>
        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Live PWA
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Video Player & Details */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-2xl flex items-center justify-center">
            {currentEpisode.streamUrl ? (
              <iframe
                key={currentEpisode.streamUrl}
                src={currentEpisode.streamUrl}
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <span className="text-4xl mb-2">🎬</span>
                <p className="font-medium text-neutral-300">No active stream URL</p>
                <p className="text-sm">Video link upload pannina play aagum</p>
              </div>
            )}
          </div>

          <div className="bg-neutral-900/60 rounded-2xl p-4 sm:p-5 border border-neutral-800 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase mr-2">
                  Now Playing
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedAnime.title}
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-400">Rating: ⭐ {selectedAnime.rating}</span>
            </div>

            <h2 className="text-base sm:text-xl font-bold text-white">
              {currentEpisode.title}
            </h2>

            <p className="text-sm text-neutral-400 leading-relaxed">
              {selectedAnime.synopsis}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
              {selectedAnime.genre.map((g) => (
                <span key={g} className="text-xs px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700/50">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Sidebar: Episodes & Anime Selector */}
        <aside className="flex flex-col gap-6">
          {/* Episode List */}
          <div className="bg-neutral-900/60 rounded-2xl p-4 border border-neutral-800">
            <h3 className="font-bold text-neutral-200 text-base mb-3 flex items-center justify-between">
              <span>Episodes</span>
              <span className="text-xs font-normal text-neutral-400">{selectedAnime.episodes.length} Available</span>
            </h3>
            <div className="flex flex-col gap-2">
              {selectedAnime.episodes.map((ep) => {
                const isActive = ep.id === currentEpisode.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setCurrentEpisode(ep)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between border ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{ep.title}</span>
                      <span className="text-xs text-neutral-500">{ep.duration}</span>
                    </div>
                    {isActive ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500 text-neutral-950">Playing</span>
                    ) : (
                      <span className="text-xs text-neutral-500">Play ▶</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anime Switcher */}
          <div className="bg-neutral-900/60 rounded-2xl p-4 border border-neutral-800">
            <h3 className="font-bold text-neutral-200 text-base mb-3">All Anime Series</h3>
            <div className="flex flex-col gap-3">
              {animeList.map((anime) => {
                const isCurrent = anime.id === selectedAnime.id;
                return (
                  <button
                    key={anime.id}
                    onClick={() => handleSelectAnime(anime)}
                    className={`w-full p-2 rounded-xl transition flex items-center gap-3 border text-left ${
                      isCurrent
                        ? 'bg-rose-500/10 border-rose-500/40 text-white'
                        : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="w-12 h-16 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0 border border-neutral-700">
                      <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold truncate text-neutral-200">{anime.title}</span>
                      <span className="text-xs text-neutral-500">{anime.originalTitle}</span>
                      <span className="text-xs text-amber-400 mt-1">⭐ {anime.rating}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}