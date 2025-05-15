'use client';

import React from 'react';
import SongList from './components/SongList';
import MusicPlayer from './components/MusicPlayer';
import WalletConnect from './components/WalletConnect';
import { sampleSongs } from './models/Song';
import { useToast } from './ToastContainer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 bg-miami-gradient text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 flex items-center relative z-10">
          <div className="mr-3">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" />
              <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" stroke="white" strokeWidth="2" />
              <path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" fill="white" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="relative inline-block">
                Vibe Vault
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/40 rounded-full"></span>
              </span>
            </h1>
            <p className="text-white/80">Feel the rhythm, pay the artists</p>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 relative flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar with wallet connection */}
          <div className="md:col-span-1">
            <WalletConnect />
            
            <div className="mt-4 p-3 miami-card bg-white/80 dark:bg-miami-purple/10 rounded-lg backdrop-blur-sm border border-white/20">
              <h2 className="text-sm font-bold mb-2 text-primary">About Vibe Vault</h2>
              <p className="text-xs text-foreground/80">
                Vibe Vault lets you pay artists directly with crypto based on listening time. Each minute sends a small payment to creators, ensuring fair compensation.
              </p>
            </div>
          </div>
          
          {/* Song list */}
          <div className="md:col-span-2">
            <div className="mb-8 p-4 miami-card bg-white/80 dark:bg-miami-purple/10 rounded-lg backdrop-blur-sm border border-white/20">
              <SongList songs={sampleSongs} />
            </div>
            
            {/* Player */}
            <div className="miami-card bg-white/80 dark:bg-miami-purple/10 rounded-lg backdrop-blur-sm border border-white/20 overflow-hidden animate-glow">
              <MusicPlayer />
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 bg-miami-gradient text-white border-t border-white/10 relative overflow-hidden mt-auto">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <p>© 2025 Vibe Vault. All rights reserved.</p>
          <p className="mt-2 text-white/70">Powered by Base</p>
        </div>
      </footer>
    </div>
  );
}
