import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return <div>
    <div >
      <nav className=" p-6 bg-opacity-100 bg-blue-900">
        <div className="flex justify-center">
          <p className="text-4xl font-bold">
          Poly Market
          </p>
        </div>
      </nav>
    </div>
    <Component {...pageProps} /></div>;
}
