import React from 'react';
import { Song } from '../models/Song';
import Image from 'next/image';
import usePlayerStore from '../hooks/usePlayerStore';

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  const { setCurrentSong, currentSong } = usePlayerStore();
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const formatPrice = (pricePerMinute: number): string => {
    // Convert from wei to ETH and format
    const ethPrice = pricePerMinute / 1e18;
    return `${ethPrice.toFixed(8)} ETH/min`;
  };
  
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary relative">
        <span className="relative z-10">Hot Tracks</span>
        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-miami-gradient rounded-full opacity-70"></span>
      </h2>
      <div className="space-y-3">
        {songs.map((song) => (
          <div 
            key={song.id}
            className={`p-4 rounded-xl cursor-pointer flex items-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              currentSong?.id === song.id 
                ? 'bg-gradient-to-r from-miami-pink/15 to-miami-blue/15 border border-white/30 shadow-md' 
                : 'hover:bg-white/40 dark:hover:bg-white/5'
            }`}
            onClick={() => setCurrentSong(song)}
          >
            <div className="relative w-14 h-14 flex-shrink-0 mr-4 rounded-lg overflow-hidden group">
              <Image
                src={song.coverArt}
                alt={`${song.title} cover`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {currentSong?.id === song.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80">
                    <div className="w-3 h-3 bg-miami-pink rounded-sm"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className={`font-medium ${currentSong?.id === song.id ? 'text-primary' : ''}`}>
                {song.title}
              </h3>
              <p className="text-sm text-foreground/70">{song.artist}</p>
              <div className="flex items-center mt-1">
                <div className="text-xs py-0.5 px-2 rounded-full bg-miami-purple/10 text-miami-purple">
                  {song.album}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">{formatDuration(song.duration)}</span>
              <span className="text-xs mt-1 py-0.5 px-2 rounded-full bg-miami-green/10 text-miami-green">
                {formatPrice(song.pricePerMinute)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList; 