import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";
import { parseEther, toHex } from 'viem';

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [
      coinbaseWallet({
        appName: "Vibe Vault",
        appLogoUrl: '/favicon.ico',
        preference: {
          keysUrl: "https://keys-dev.coinbase.com/connect",
          options: "smartWalletOnly",
        },
        // @ts-ignore - Using the latest Coinbase Wallet features
        subAccounts: {
          enableAutoSubAccounts: true,
          defaultSpendLimits: {
            84532: [
              {
                token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                allowance: toHex(parseEther('0.005')),
                period: 86400,
              },
            ],
          },
        },
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}

// Export the config for use in other files
export const config = getConfig();

// Export the connector for easy access
export const connector = config.connectors[0];

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
} 