'use client';

import React, { useEffect } from 'react';
import SongList from './components/SongList';
import MusicPlayer from './components/MusicPlayer';
import WalletConnect from './components/WalletConnect';
import { sampleSongs } from './models/Song';
import Image from 'next/image';
import { useToast } from './ToastContainer';

export default function Home() {
  const { showToast } = useToast();
  
  // Expose showToast to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.debugShowToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        showToast(message, type);
      };
    }
  }, [showToast]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Debug button - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={() => showToast('Test toast message!', 'info')}
          className="fixed z-50 bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg"
        >
          Test Toast
        </button>
      )}
      
      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 w-40 h-40 opacity-30 pointer-events-none z-0">
        <Image 
          src="/images/palm-tree.png" 
          alt="Palm Tree" 
          width={150} 
          height={150} 
          className="animate-pulse-grow"
        />
      </div>
      
      <div className="fixed top-20 right-10 w-40 h-40 opacity-20 pointer-events-none z-0 hidden md:block">
        <div className="w-32 h-32 rounded-full bg-miami-pink blur-3xl animate-pulse"></div>
      </div>
      
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
            <p className="text-white/80">Stream music, pay artists directly with crypto</p>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar with wallet connection */}
          <div className="md:col-span-1">
            <WalletConnect />
            
            <div className="mt-6 p-6 miami-card bg-white/80 dark:bg-miami-purple/10 rounded-lg backdrop-blur-sm border border-white/20">
              <h2 className="text-xl font-bold mb-4 text-primary">About Vibe Vault</h2>
              <p className="text-foreground/80 mb-3">
                Vibe Vault is a decentralized music streaming platform that allows listeners
                to pay artists directly with cryptocurrency based on how long they listen.
              </p>
              <p className="text-foreground/80">
                Every minute of streaming sends a small crypto payment to the song's creator,
                ensuring fair compensation for artists.
              </p>
              
              <div className="mt-6 flex justify-center">
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-miami-gradient opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="block text-2xl font-bold miami-text-gradient">Miami Vibes</span>
                      <span className="text-sm text-foreground/70">Feel the rhythm, pay the artist</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Song list */}
          <div className="md:col-span-2">
            <div className="mb-8 p-6 miami-card bg-white/80 dark:bg-miami-purple/10 rounded-lg backdrop-blur-sm border border-white/20">
              <SongList songs={sampleSongs} />
            </div>
            
            {/* Player */}
            <div className="miami-card bg-white/80 dark:bg-miami-purple/10 rounded-lg backdrop-blur-sm border border-white/20 overflow-hidden animate-glow">
              <MusicPlayer />
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 mt-12 bg-miami-gradient text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <p>© 2023 Vibe Vault. All rights reserved.</p>
          <p className="mt-2 text-white/70">Powered by Ethereum blockchain technology.</p>
          
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-white hover:text-miami-yellow transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" className="text-white hover:text-miami-yellow transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
