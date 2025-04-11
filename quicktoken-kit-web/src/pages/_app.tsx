import '../styles/globals.css';
import '../styles/animations.css';
import 'aos/dist/aos.css';
import type { AppProps } from 'next/app';
import { Web3ReactProvider } from '@web3-react/core';
import { ThemeProvider } from 'next-themes';
import { getLibrary } from '../utils/web3';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </Web3ReactProvider>
  );
} 