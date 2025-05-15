'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useAccount, useWalletClient } from 'wagmi';
import usePlayerStore from '../hooks/usePlayerStore';
import { sendPayment, DEFAULT_RECIPIENT_NAME } from '../utils/cryptoPayment';
import { useToast } from '../ToastContainer';

const BASE_SCAN_URL = 'https://sepolia.basescan.org/address/0xbAAcd6217604199b7eB0925E8404C0B49E935EaA#internaltx';

const MusicPlayer: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    play, 
    pause, 
    togglePlayPause,
    listenTime,
    updateListenTime,
    resetListenTime,
    paymentInterval,
    isSmartWallet,
    activeSubAccount
  } = usePlayerStore();
  
  // Use Wagmi hooks
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  // Get global toast function
  const { showToast } = useToast();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'none' | 'pending' | 'success' | 'error'>('none');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  
  // Timer for tracking listen time
  const listenTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Timer for periodic payments
  const paymentTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Flag to track if we've shown the "now playing" toast for the current song
  const hasShownNowPlayingToastRef = useRef(false);
  // Timer for free preview period
  const freePreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Failed to play:', err);
        pause();
      });
      
      // Show "Now Playing" toast when a song starts (only once per song)
      if (!hasShownNowPlayingToastRef.current) {
        showToast(`Now playing: ${currentSong.title} by ${currentSong.artist}`, 'info');
        hasShownNowPlayingToastRef.current = true;
      }
      
      // Start listen time tracking
      if (listenTimerRef.current === null) {
        listenTimerRef.current = setInterval(() => {
          updateListenTime(1); // Update every second
        }, 1000);
      }
      
      // Start free preview timer if not connected
      if (!isConnected && freePreviewTimerRef.current === null) {
        setShowConnectPrompt(false); // Reset any existing prompt
        
        freePreviewTimerRef.current = setTimeout(() => {
          // Pause playback after 10 seconds if wallet is not connected
          pause();
          setShowConnectPrompt(true);
          showToast('Connect your wallet to continue listening', 'info');
        }, 10000); // 10 seconds free preview
      }
    } else {
      audioRef.current.pause();
      
      // Pause listen time tracking
      if (listenTimerRef.current) {
        clearInterval(listenTimerRef.current);
        listenTimerRef.current = null;
      }
    }
    
    return () => {
      if (listenTimerRef.current) {
        clearInterval(listenTimerRef.current);
        listenTimerRef.current = null;
      }
      if (paymentTimerRef.current) {
        clearInterval(paymentTimerRef.current);
        paymentTimerRef.current = null;
      }
      if (freePreviewTimerRef.current) {
        clearTimeout(freePreviewTimerRef.current);
        freePreviewTimerRef.current = null;
      }
    };
  }, [isPlaying, currentSong, pause, updateListenTime, showToast, isConnected]);
  
  // Clear free preview timer if wallet gets connected
  useEffect(() => {
    if (isConnected) {
      setShowConnectPrompt(false);
      if (freePreviewTimerRef.current) {
        clearTimeout(freePreviewTimerRef.current);
        freePreviewTimerRef.current = null;
      }
    }
  }, [isConnected]);
  
  // Reset hasShownNowPlayingToast when song changes
  useEffect(() => {
    if (currentSong) {
      hasShownNowPlayingToastRef.current = false;
      setShowConnectPrompt(false);
      
      // Clear any existing preview timer when song changes
      if (freePreviewTimerRef.current) {
        clearTimeout(freePreviewTimerRef.current);
        freePreviewTimerRef.current = null;
      }
    }
  }, [currentSong]);
  
  // Setup payment interval
  useEffect(() => {
    if (!currentSong || !isPlaying || !isConnected) return;
    
    // Clear any existing payment timer
    if (paymentTimerRef.current) {
      clearInterval(paymentTimerRef.current);
      paymentTimerRef.current = null;
    }
    
    // Start a new payment timer
    paymentTimerRef.current = setInterval(() => {
      if (listenTime > 0) {
        makePayment(listenTime);
      }
    }, paymentInterval * 1000); // Convert seconds to milliseconds
    
    return () => {
      if (paymentTimerRef.current) {
        clearInterval(paymentTimerRef.current);
        paymentTimerRef.current = null;
      }
    };
  }, [currentSong, isPlaying, paymentInterval, isConnected]);
  
  // Load new song
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    setIsLoading(true);
    audioRef.current.src = currentSong.audioUrl;
    audioRef.current.load();
    
    // Reset timer and payment status
    resetListenTime();
    setPaymentStatus('none');
    setPaymentMessage('');
    
  }, [currentSong, resetListenTime]);
  
  // Update the component's initial setup to set the duration from the song model
  useEffect(() => {
    if (currentSong) {
      // Set the initial duration from the song model
      setDuration(currentSong.duration);
    }
  }, [currentSong]);
  
  // Update the handleTimeUpdate function to calculate progress based on song model's duration
  const handleTimeUpdate = () => {
    if (!audioRef.current || !currentSong) return;
    
    const current = audioRef.current.currentTime;
    
    // Set current time based on the actual playback
    setCurrentTime(current);
    
    // Calculate progress based on model duration for consistency
    // This ensures the progress bar matches the displayed duration
    setProgress((current / currentSong.duration) * 100);
  };
  
  const handleLoadedMetadata = () => {
    if (!audioRef.current || !currentSong) return;
    
    // Get the actual duration from the audio element
    const actualDuration = audioRef.current.duration;
    
    // Set state with the actual duration from audio element
    setDuration(actualDuration);
    setIsLoading(false);
    
    // Check if there's a significant difference (more than 3 seconds)
    // between stored duration and actual duration
    const durationDifference = Math.abs(actualDuration - currentSong.duration);
    if (durationDifference > 3) {
      console.log(`Duration mismatch for ${currentSong.title}: 
        Model: ${currentSong.duration}s, 
        Actual: ${actualDuration.toFixed(1)}s`);
    }
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Failed to play:', err);
        pause();
      });
    }
  };
  
  // Update the handleProgressChange function to use the song model's duration
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !currentSong) return;
    
    const value = parseInt(e.target.value);
    
    // Calculate time based on the song model's duration, not the audio element duration
    const time = (value / 100) * currentSong.duration;
    
    audioRef.current.currentTime = time;
    setProgress(value);
  };
  
  const makePayment = async (seconds: number) => {
    if (!currentSong || !isConnected || !walletClient) return;
    
    setPaymentStatus('pending');
    setPaymentMessage('Processing payment...');
    
    try {
      // No need to check for Sub Account here as it's automatically handled by the wallet
      const result = await sendPayment(currentSong, seconds);
      
      if (result.success) {
        setPaymentStatus('success');
        const paymentAmount = (parseFloat(result.paymentDetails?.amount || '0') / 1e18).toFixed(8);
        
        // Store the explorer URL and create a rich HTML message for the UI
        const explorerUrl = result.paymentDetails?.explorerUrl || BASE_SCAN_URL;
        
        const successMessage = `Paid ${paymentAmount} ETH to ${DEFAULT_RECIPIENT_NAME}`;
        setPaymentMessage(successMessage);
        
        // Use basic message for toast notification
        showToast(successMessage, 'success');
        
        resetListenTime();
      } else {
        setPaymentStatus('error');
        setPaymentMessage(result.error || 'Payment failed');
        showToast(result.error || 'Payment failed', 'error');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
      setPaymentMessage(error.message || 'Payment failed');
      showToast(error.message || 'Payment failed', 'error');
    }
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setPaymentStatus('none');
      setPaymentMessage('');
    }, 5000);
  };
  
  const formatIntervalPrice = (pricePerMinute: number): string => {
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
  
  if (!currentSong) {
    return (
      <div className="w-full p-6 rounded-lg bg-white/10 text-center backdrop-blur-sm border border-white/10">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-16 h-16 rounded-full bg-miami-gradient opacity-20 flex items-center justify-center">
            <svg className="w-8 h-8 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
            </svg>
          </div>
          <p className="text-foreground/70 font-medium">Select a track to start the vibe</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full p-6">
      {/* Song info with album art */}
      <div className="flex flex-col md:flex-row items-center mb-6">
        <div className="relative w-36 h-36 md:w-44 md:h-44 mb-4 md:mb-0 md:mr-6 rounded-xl overflow-hidden group shadow-lg">
          <Image
            src={currentSong.coverArt}
            alt={`${currentSong.title} cover`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
          
          {/* Play/Pause overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity cursor-pointer"
            onClick={togglePlayPause}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/20 border border-white/40 transition-transform ${isPlaying ? 'scale-90' : 'scale-100'}`}>
              {isPlaying ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="mb-1 inline-block px-2 py-1 rounded-full bg-miami-gradient text-xs text-white">
            {currentSong.album}
          </div>
          <h2 className="text-2xl font-bold mb-1">{currentSong.title}</h2>
          <p className="text-foreground/70 mb-4">{currentSong.artist}</p>
          
          {/* Player controls for larger screens */}
          <div className="hidden md:block">
            {/* Progress bar */}
            <div className="mb-3">
              <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-miami-gradient rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-foreground/60 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile progress bar */}
      <div className="block md:hidden mb-5">
        <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-miami-gradient rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-foreground/60 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center md:hidden items-center mb-6">
        <button
          onClick={togglePlayPause}
          className="miami-button w-full py-3 flex items-center justify-center max-w-xs"
          disabled={isLoading}
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </>
          )}
        </button>
      </div>
      
      {/* Payment info */}
      <div className="mt-4 bg-white/20 dark:bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-primary">Payment Information</h3>
          {isSmartWallet && (
            <div className="px-2 py-1 rounded-full bg-miami-pink/10 text-miami-pink text-sm font-medium">
              Using Smart Wallet
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/80 font-medium">Current listening time:</span>
            <span className="text-sm font-medium bg-miami-blue/10 text-miami-blue px-3 py-1 rounded-full">
              {formatTime(listenTime)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/80 font-medium">Payment interval:</span>
            <span className="text-sm font-medium bg-miami-green/10 text-miami-green px-3 py-1 rounded-full">
              {formatTime(paymentInterval)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/80 font-medium">Price per interval:</span>
            <span className="text-sm font-medium bg-miami-yellow/10 text-miami-purple px-3 py-1 rounded-full">
              {formatIntervalPrice(currentSong.pricePerMinute)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/80 font-medium">Payments to:</span>
            <a 
              href={BASE_SCAN_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium bg-miami-purple/10 text-miami-blue px-3 py-1 rounded-full font-mono hover:bg-miami-purple/20 transition-colors"
            >
              {DEFAULT_RECIPIENT_NAME}
            </a>
          </div>
        </div>
        
        {!isConnected && (
          <div className="mt-4 p-3 rounded-lg text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/30">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span>Connect your wallet to enable automatic payments to artists.</span>
            </div>
          </div>
        )}
        
        {paymentStatus !== 'none' && isConnected && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            paymentStatus === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/30' :
            paymentStatus === 'error' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800/30' :
            'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/30'
          }`}>
            <div className="flex items-center">
              {paymentStatus === 'success' && (
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              )}
              {paymentStatus === 'error' && (
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              {paymentStatus === 'pending' && (
                <svg className="w-5 h-5 mr-2 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              )}
              <span>{paymentMessage}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Connect prompt overlay */}
      {showConnectPrompt && !isConnected && (
        <div className="mt-4 p-4 bg-miami-gradient/30 backdrop-blur-md rounded-lg border border-white/30 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Free Preview Ended</h3>
          <p className="text-white/90 mb-4">
            Connect your Base Account to continue listening to this track and support the artist.
          </p>
          <button 
            className="miami-button py-2 px-6"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Connect Wallet
          </button>
        </div>
      )}
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => pause()}
      />
    </div>
  );
};

export default MusicPlayer; 