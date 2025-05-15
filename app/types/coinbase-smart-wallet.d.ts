declare module '@coinbase/smart-wallet' {
  export type SmartWalletOptions = {
    projectId: string;
    accountEndpoint?: string;
    paymasterOptions?: {
      mode: 'coinbase' | 'none';
      autoPaygas?: boolean;
    };
    autoConnect?: boolean;
    devMode?: boolean;
  };
} 