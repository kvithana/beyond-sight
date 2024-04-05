import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="manifest" href="manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-title" content="Beyond Sight" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
