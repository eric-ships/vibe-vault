'use client';

import React, { useEffect, useState } from 'react';
import { useConnect, useAccount, useDisconnect, useBalance } from 'wagmi';
import usePlayerStore from '../hooks/usePlayerStore';
import { formatEther } from 'viem';
import { baseSepolia } from 'wagmi/chains';

const WalletConnect: React.FC = () => {
  const { 
    walletConnected, 
    walletAddress,
    isSmartWallet, 
    activeSubAccount,
    setWalletConnected,
    setIsSmartWallet,
    setActiveSubAccount
  } = usePlayerStore();
  
  // Use Wagmi hooks
  const { connectors, connect, isPending: isConnecting, error: connectError } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Only fetch balance when we have an address
  const { data: balanceData, isLoading: isBalanceLoading, refetch: refetchBalance } = useBalance(
    address ? {
      address: address as `0x${string}`,
      chainId: baseSepolia.id, // Specify Base Sepolia chain
    } : undefined
  );
  
  const [error, setError] = useState<string | null>(null);
  
  // Add periodic balance refresh
  useEffect(() => {
    // Refresh balance every 10 seconds while connected
    if (isConnected && address) {
      const refreshInterval = setInterval(() => {
        refetchBalance?.();
      }, 10000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [isConnected, address, refetchBalance]);
  
  // Sync Wagmi connection state with our store
  useEffect(() => {
    if (isConnected && address) {
      setWalletConnected(true, address);
      setIsSmartWallet(true); // Smart Wallet Only mode is enabled in the connector
    } else if (!isConnected && walletConnected) {
      setWalletConnected(false, null);
      setActiveSubAccount(null);
      setIsSmartWallet(false);
    }
  }, [isConnected, address, setWalletConnected, setIsSmartWallet, setActiveSubAccount, walletConnected]);
  
  // Handle connect error
  useEffect(() => {
    if (connectError) {
      setError(connectError.message);
    } else {
      setError(null);
    }
  }, [connectError]);
  
  const connectWallet = async () => {
    setError(null);
    
    try {
      // Use the first connector (Coinbase Wallet)
      const coinbaseConnector = connectors[0];
      connect({ connector: coinbaseConnector });
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet.');
    }
  };
  
  const disconnectWallet = () => {
    disconnect();
    setWalletConnected(false, null);
    setActiveSubAccount(null);
    setIsSmartWallet(false);
  };
  
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Format balance for display with fixed decimals
  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return '0.0000';
    const ethBalance = formatEther(balance);
    return parseFloat(ethBalance).toFixed(4);
  };
  
  // Manual balance refresh
  const refreshBalance = () => {
    refetchBalance?.();
  };
  
  // Update the CopyableAddress component to include a BaseScan link
  const CopyableAddress: React.FC<{ address: string }> = ({ address }) => {
    const [copied, setCopied] = useState(false);
    
    const copyToClipboard = () => {
      navigator.clipboard.writeText(address).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
    };
    
    // Generate BaseScan URL dynamically
    const baseScanUrl = `https://sepolia.basescan.org/address/${address}#internaltx`;
    
    return (
      <div className="relative w-full">
        <div className="flex flex-col items-center">
          <div 
            onClick={copyToClipboard}
            className="font-mono text-sm cursor-pointer hover:bg-white/10 transition-colors py-1.5 px-3 rounded inline-flex items-center justify-center w-full break-all"
            title="Click to copy address"
          >
            <span>{address}</span>
            <svg 
              className={`w-4 h-4 ml-1.5 flex-shrink-0 transition-opacity ${copied ? 'opacity-100' : 'opacity-50'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
              )}
            </svg>
          </div>
          
          <a 
            href={baseScanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-xs text-miami-blue hover:text-miami-pink transition-colors flex items-center"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on BaseScan
          </a>
        </div>
        
        {copied && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 bg-miami-blue/90 text-white text-xs py-1 px-2 rounded-md z-10">
            Address copied!
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="mb-6">
      {walletConnected && walletAddress ? (
        <div className="miami-card p-5 flex flex-col items-center">
          <div className="flex items-center mb-3 w-full justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-miami-green rounded-full mr-2 animate-pulse"></div>
              <span className="font-medium text-primary">
                {isSmartWallet ? 'Base Account' : 'Connected Wallet'}
              </span>
            </div>
            <div className="bg-miami-yellow/10 px-2 py-1 rounded-full">
              <span className="text-xs text-miami-yellow font-medium">ETH</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-miami-pink/10 to-miami-blue/10 w-full py-3 px-4 rounded-xl border border-white/20 mb-3">
            <CopyableAddress address={walletAddress} />
          </div>
          
          {/* Balance Display */}
          <div className="bg-miami-purple/10 w-full py-3 px-4 rounded-xl border border-miami-purple/20 mb-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground/80">Base Sepolia Balance:</span>
              <div className="flex items-center">
                {isBalanceLoading ? (
                  <span className="text-sm opacity-70">Loading...</span>
                ) : (
                  <span className="text-sm font-bold">{formatBalance(balanceData?.value)} ETH</span>
                )}
                <button 
                  onClick={refreshBalance}
                  className="ml-2 p-1 rounded-full hover:bg-white/10 text-foreground/70"
                  title="Refresh Balance"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {isSmartWallet && (
            <div className="bg-miami-blue/10 w-full py-2 px-3 rounded-xl border border-miami-blue/20 mb-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-miami-blue font-medium">Smart Wallet Status:</span>
                <span className="px-2 py-0.5 bg-miami-green/10 text-miami-green rounded-full">Active</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-miami-blue font-medium">Sub Account:</span>
                <span className="px-2 py-0.5 bg-miami-green/10 text-miami-green rounded-full">Enabled</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-1">
                <span className="text-miami-blue font-medium">Daily Spend Limit:</span>
                <span className="px-2 py-0.5 bg-miami-green/10 text-miami-green rounded-full">0.005 ETH</span>
              </div>
            </div>
          )}
          
          <button
            onClick={disconnectWallet}
            className="text-sm text-miami-pink hover:text-miami-blue transition-colors duration-300 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Disconnect
          </button>
        </div>
      ) : (
        <div className="miami-card p-5 flex flex-col items-center">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold text-primary mb-2">Sign in with Base Account</h3>
            <p className="text-sm text-foreground/70">
              Connect your Base Account to pay artists directly for their music.
            </p>
          </div>
          
          <div className="w-20 h-20 mx-auto mb-5 relative">
            <div className="absolute inset-0 bg-miami-gradient rounded-xl opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48ZM24 8C15.1634 8 8 15.1634 8 24C8 32.8366 15.1634 40 24 40C32.8366 40 40 32.8366 40 24C40 15.1634 32.8366 8 24 8Z" fill="#0052FF"/>
                <path d="M24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32Z" fill="#0052FF"/>
              </svg>
            </div>
          </div>
          
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="miami-button w-full flex items-center justify-center"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Sign in with Base Account</span>
              </>
            )}
          </button>
          
          <div className="mt-4 text-xs text-center text-foreground/60">
            <p>
              Connect your wallet to enable automatic streaming payments to artists
            </p>
          </div>
          
          {error && (
            <div className="mt-3 text-sm text-red-500 bg-red-100 px-3 py-2 rounded-lg w-full text-center">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 