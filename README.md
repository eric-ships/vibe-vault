# Vibe Vault

A decentralized music streaming platform that enables direct payments from listeners to artists based on listening time.

## Overview

Vibe Vault reimagines music streaming by leveraging blockchain technology to create a more equitable system for artists. Instead of receiving minimal royalties through traditional platforms, artists on Vibe Vault receive direct cryptocurrency payments from listeners based on the duration of their listening sessions.

### Key Features

- **Stream Music**: Browse and stream high-quality music from various artists
- **Direct Payments**: Automatically pay artists in cryptocurrency based on listening time
- **Wallet Integration**: Connect your Ethereum wallet (like MetaMask) to enable payments
- **Transparent Payment System**: See exactly how much you're paying and when payments are made

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **State Management**: Zustand
- **Blockchain Interaction**: ethers.js, Web3.js
- **Audio Playback**: HTML5 Audio API, React Audio Player

## How It Works

1. **Connect Wallet**: Users connect their Ethereum wallet to the platform
2. **Browse and Listen**: Users browse available songs and start listening
3. **Automatic Payments**: As users listen, small cryptocurrency payments are automatically sent to the artists at regular intervals
4. **Payment Calculation**: Payment amount is calculated based on the song's price per minute and the listening duration

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- MetaMask or another Ethereum wallet browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vibe-vault.git
cd vibe-vault

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at http://localhost:3000.

### Using the App

1. **Connect Your Wallet**: Click the "Connect Wallet" button to connect your Ethereum wallet
2. **Browse Songs**: Look through the available songs in the library
3. **Play Music**: Click on a song to begin playback
4. **Monitor Payments**: Watch as payments are automatically sent to artists as you listen

## Development Roadmap

- **Playlist Creation**: Allow users to create and share playlists
- **Artist Profiles**: Dedicated pages for artists with bios and all their music
- **Multiple Payment Options**: Support for multiple cryptocurrencies
- **Subscription Model**: Optional subscription for reduced per-stream costs
- **Mobile App**: Native mobile applications for iOS and Android

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the artists who contributed music
- The Web3 and Ethereum communities for making decentralized applications possible
- Open source audio and blockchain libraries that power this application
