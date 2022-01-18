import React from "react";
import { BrowserView, MobileView } from "react-device-detect";
import BrowsersList from "./BrowsersList";

export default function BrowserCompabilities() {
  function createData(browser: string, version: number | string, compatible: boolean) {
    return { browser, version, compatible };
  }

  const mobileBrowsers = [
    createData("WebView Android", 44, true),
    createData("Chrome Android", 44, true),
    createData("Firefox for Android", 58, true),
    createData("Opera Android", 44, true),
    createData("Safari on iOS", "X", false),
    createData("Samsung Internet", "5.0", true),
  ];

  const desktopBrowsers = [
    createData("Chrome", 44, true),
    createData("Edge", 44, true),
    createData("Firefox", "X", false),
    createData("Internet Explorer", "X", false),
    createData("Opera", 31, true),
    createData("Safari", "X", false),
  ];

  return (
    <>
      <BrowserView>
        <BrowsersList data={desktopBrowsers} />
      </BrowserView>
      <MobileView>
        <BrowsersList data={mobileBrowsers} />
      </MobileView>
    </>
  );
}
