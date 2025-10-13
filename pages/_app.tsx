import type { AppProps } from "next/app";
import "../styles/globals.css";
import { NinetailedProvider } from "@ninetailed/experience.js-next";

export default function App({ Component, pageProps }: AppProps) {
  const clientId = process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? "";
  return (
    <NinetailedProvider clientId={clientId}>
      <Component {...pageProps} />
    </NinetailedProvider>
  );
}


