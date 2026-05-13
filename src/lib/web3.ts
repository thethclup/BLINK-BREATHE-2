import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Use a placeholder project ID for RainbowKit
const projectId = 'BLINK_BREATHE_2_PROJECT_ID';

export const config = getDefaultConfig({
  appName: 'Blink & Breathe 2',
  projectId,
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});
