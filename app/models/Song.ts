export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverArt: string;
  audioUrl: string;
  duration: number; // in seconds
  creatorAddress: string; // Ethereum address of the creator
  pricePerMinute: number; // Price in wei per minute of listening
}

// SoundHelix sample songs have these actual durations:
// Song-1.mp3 - 372 seconds (6:12)
// Song-2.mp3 - 320 seconds (5:20)
// Song-3.mp3 - 387 seconds (6:27)

export const sampleSongs: Song[] = [
  {
    id: '1',
    title: 'Crypto Beats',
    artist: 'BlockchainDJ',
    album: 'Web3 Vibes',
    coverArt: '/songs/cover1.jpg',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372, // 6:12
    creatorAddress: '0x1234567890123456789012345678901234567890',
    pricePerMinute: 10000000000000 // 0.00001 ETH in wei
  },
  {
    id: '2',
    title: 'Decentralized Dreams',
    artist: 'ETH Voice',
    album: 'Blockchain Beats',
    coverArt: '/songs/cover2.jpg',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 320, // 5:20
    creatorAddress: '0x2345678901234567890123456789012345678901',
    pricePerMinute: 5000000000000 // 0.000005 ETH in wei
  },
  {
    id: '3',
    title: 'Smart Contract Symphony',
    artist: 'Solidity Sound',
    album: 'Gas Fee Grooves',
    coverArt: '/songs/cover3.jpg',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 387, // 6:27
    creatorAddress: '0x3456789012345678901234567890123456789012',
    pricePerMinute: 7500000000000 // 0.0000075 ETH in wei
  }
]; 