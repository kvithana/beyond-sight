import Head from "next/head";
import { useEffect } from "react";

export default function SaveToHomescreen() {
  useEffect(() => {
    const run = () => {
      if ("addToHomescreen" in window) {
        // @ts-ignore
        window.AddToHomeScreenInstance = new window.AddToHomeScreen({
          appName: "Aardvark",
          appIconUrl: "apple-touch-icon.png",
          assetUrl:
            "https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@1.8/dist/assets/img/",
          showErrorMessageForUnsupportedBrowsers:
            // @ts-ignore
            window.AddToHomeScreen.SHOW_ERRMSG_UNSUPPORTED.ALL,
          allowUserToCloseModal: false,
          maxModalDisplayCount: -1,
        });
        // @ts-ignore
        const ret = window.AddToHomeScreenInstance.show();
      }
    };

    if (document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run);
    }
  }, []);

  return (
    <Head>
      <script src="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@1.8/dist/add-to-homescreen.min.js" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/philfung/add-to-homescreen@1.8/dist/add-to-homescreen.min.css"
      />
    </Head>
  );
}
