import { create } from 'zustand';
import { Song } from '../models/Song';

// Define SubAccount interface locally since it was removed from cryptoPayment.ts
export interface SubAccount {
  address: string;
  parentAddress: string;
  spendLimitAmount: string;
  spendLimitPeriod: number;
  isActive: boolean;
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  listenTime: number; // in seconds
  lastPaymentTime: number; // timestamp of last payment
  paymentInterval: number; // how often to make payments in seconds
  walletConnected: boolean;
  walletAddress: string | null;
  isSmartWallet: boolean;
  activeSubAccount: SubAccount | null;
  
  // Actions
  setCurrentSong: (song: Song) => void;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  addToPlaylist: (song: Song) => void;
  removeFromPlaylist: (songId: string) => void;
  updateListenTime: (seconds: number) => void;
  resetListenTime: () => void;
  setPaymentInterval: (seconds: number) => void;
  setWalletConnected: (connected: boolean, address?: string | null) => void;
  setIsSmartWallet: (isSmartWallet: boolean) => void;
  setActiveSubAccount: (subAccount: SubAccount | null) => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],
  listenTime: 0,
  lastPaymentTime: 0,
  paymentInterval: 5, // Make payments every 5 seconds for faster testing
  walletConnected: false,
  walletAddress: null,
  isSmartWallet: false,
  activeSubAccount: null,
  
  // Actions
  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
  
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  addToPlaylist: (song) => set((state) => ({
    playlist: [...state.playlist, song]
  })),
  
  removeFromPlaylist: (songId) => set((state) => ({
    playlist: state.playlist.filter(song => song.id !== songId)
  })),
  
  updateListenTime: (seconds) => set((state) => ({
    listenTime: state.listenTime + seconds
  })),
  
  resetListenTime: () => set({ listenTime: 0, lastPaymentTime: Date.now() }),
  
  setPaymentInterval: (seconds) => set({ paymentInterval: seconds }),
  
  setWalletConnected: (connected, address = null) => set((state) => ({ 
    walletConnected: connected, 
    walletAddress: address,
    // Reset sub account if disconnecting
    activeSubAccount: connected ? state.activeSubAccount : null
  })),
  
  setIsSmartWallet: (isSmartWallet) => set({ isSmartWallet }),
  
  setActiveSubAccount: (subAccount) => set({ activeSubAccount: subAccount }),
}));

export default usePlayerStore; 