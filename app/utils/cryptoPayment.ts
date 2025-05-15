import { Song } from '../models/Song';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { getAccount, sendTransaction } from 'wagmi/actions';
import { config } from '../wagmi';

// Default recipient ENS name (for display purposes)
export const DEFAULT_RECIPIENT_NAME = 'ericliu.base.eth';

// Actual wallet address to receive payments
export const DEFAULT_RECIPIENT_ADDRESS = '0xbAAcd6217604199b7eB0925E8404C0B49E935EaA';

// Basic payment interface
export interface PaymentDetails {
  recipientName: string; // Display name (ENS)
  recipientAddress: string; // Actual address where payment was sent
  amount: string; // in wei
  timestamp: number;
  songId: string;
  duration: number; // in seconds
}

// Keep a record of all payments made in the current session
export const paymentHistory: PaymentDetails[] = [];

// Calculate payment amount based on listen time
export const calculatePayment = (song: Song, listenTimeSeconds: number): string => {
  // Convert listen time from seconds to minutes (or fraction of a minute)
  const listenTimeMinutes = listenTimeSeconds / 60;
  
  // Calculate payment amount in wei
  const paymentAmount = Math.floor(song.pricePerMinute * listenTimeMinutes);
  
  return paymentAmount.toString();
};

// Send payment to creator using wagmi
export const sendPayment = async (
  song: Song, 
  listenTimeSeconds: number
): Promise<{ success: boolean, error?: string, paymentDetails?: PaymentDetails }> => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'No Ethereum wallet found. Please install Coinbase Wallet.' };
  }

  try {
    // Get the connected account (must pass config)
    const account = getAccount(config);
    if (!account || !account.address) {
      return { success: false, error: 'No accounts found. Please connect your wallet.' };
    }
    
    // Calculate payment
    const paymentAmount = calculatePayment(song, listenTimeSeconds);
    
    // Skip if payment amount is zero or negligible
    if (BigInt(paymentAmount) <= BigInt(0)) {
      return { success: false, error: 'Payment amount is too small' };
    }
    
    // Use the hardcoded recipient address (we don't need to resolve ENS)
    const recipientAddress = DEFAULT_RECIPIENT_ADDRESS;
    
    // Send transaction with wagmi (must pass config)
    const hash = await sendTransaction(config, {
      to: recipientAddress as `0x${string}`,
      value: BigInt(paymentAmount),
    });
    
    // Create payment record
    const payment: PaymentDetails = {
      recipientName: DEFAULT_RECIPIENT_NAME,
      recipientAddress: recipientAddress,
      amount: paymentAmount,
      timestamp: Date.now(),
      songId: song.id,
      duration: listenTimeSeconds
    };
    
    // Add to payment history
    paymentHistory.push(payment);
    
    return { success: true, paymentDetails: payment };
  } catch (error: any) {
    console.error('Payment failed:', error);
    return { success: false, error: error.message || 'Payment failed' };
  }
}; 