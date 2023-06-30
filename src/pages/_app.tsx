import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import Head from "next/head";
import { TopMenu } from "~/components/topmenu";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Cookbook</title>
        <meta name="description" content="Ash's best recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <TopMenu />
        <div className="min-h-screen">
          <Component {...pageProps} />
        </div>
      </div>
      <Analytics />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
