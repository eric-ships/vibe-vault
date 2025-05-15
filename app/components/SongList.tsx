import React from 'react';
import { Song } from '../models/Song';
import Image from 'next/image';
import usePlayerStore from '../hooks/usePlayerStore';

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  const { setCurrentSong, currentSong, paymentInterval } = usePlayerStore();
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const formatPrice = (pricePerMinute: number): string => {
    // Calculate price per interval (instead of per minute)
    const intervalInMinutes = paymentInterval / 60;
    const pricePerInterval = (pricePerMinute * intervalInMinutes) / 1e18;
    
    // Format the price in a more readable way
    if (pricePerInterval < 0.000001) {
      return `${(pricePerInterval * 1000000).toFixed(2)}μETH`;
    } else if (pricePerInterval < 0.001) {
      return `${(pricePerInterval * 1000).toFixed(2)}mETH`;
    } else {
      return `${pricePerInterval.toFixed(4)}ETH`;
    }
  };
  
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-center text-primary relative">
        <span className="relative z-10">Hot Tracks</span>
        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-miami-gradient rounded-full opacity-70"></span>
      </h2>
      <div className="space-y-2">
        {songs.map((song) => (
          <div 
            key={song.id}
            className={`py-2 px-3 rounded-lg cursor-pointer flex items-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${
              currentSong?.id === song.id 
                ? 'bg-gradient-to-r from-miami-pink/15 to-miami-blue/15 border border-white/30 shadow-md' 
                : 'hover:bg-white/40 dark:hover:bg-white/5'
            }`}
            onClick={() => setCurrentSong(song)}
          >
            <div className="relative w-12 h-12 flex-shrink-0 mr-3 rounded-lg overflow-hidden group">
              <Image
                src={song.coverArt}
                alt={`${song.title} cover`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {currentSong?.id === song.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/80">
                    <div className="w-2 h-2 bg-miami-pink rounded-sm"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium truncate ${currentSong?.id === song.id ? 'text-primary' : ''}`}>
                  {song.title}
                </h3>
                <span className="text-xs font-medium ml-2 flex-shrink-0">{formatDuration(song.duration)}</span>
              </div>
              
              <div className="flex items-center justify-between mt-0.5">
                <div className="flex items-center space-x-2 min-w-0">
                  <p className="text-xs text-foreground/70 truncate">{song.artist}</p>
                  <span className="text-xs text-foreground/40">•</span>
                  <div className="text-xs px-1.5 rounded bg-miami-purple/10 text-miami-purple truncate">
                    {song.album}
                  </div>
                </div>
                <span className="text-xs ml-2 py-0.5 px-1.5 rounded-full bg-miami-blue/25 text-blue-600 dark:text-blue-400 font-semibold flex-shrink-0">
                  {formatPrice(song.pricePerMinute)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList; 