import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Script from "next/script"
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PersonalizeProvider } from "@/components/context/PersonalizeContext"
import { LyticsProvider } from "@/components/context/LyticsContext"
import { Suspense } from "react"
import { PageLoader } from "@/components/ui/loader"

export const metadata: Metadata = {
  title: "PhoneFront",
  description: "Created with AI and Mind Combine",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-gradient-to-r from-primary/10 via-background to-background`}>
        {/* Start Lytics Tracking Tag Version 3 */}
        <Script
          id="lytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
 !function(){"use strict";var o=window.jstag||(window.jstag={}),r=[];function n(e){o[e]=function(){for(var n=arguments.length,t=new Array(n),i=0;i<n;i++)t[i]=arguments[i];r.push([e,t])}}n("send"),n("mock"),n("identify"),n("pageView"),n("unblock"),n("getid"),n("setid"),n("loadEntity"),n("getEntity"),n("on"),n("once"),n("call"),o.loadScript=function(n,t,i){var e=document.createElement("script");e.async=!0,e.src=n,e.onload=t,e.onerror=i;var o=document.getElementsByTagName("script")[0],r=o&&o.parentNode||document.head||document.body,c=o||r.lastChild;return null!=c?r.insertBefore(e,c):r.appendChild(e),this},o.init=function n(t){return this.config=t,this.loadScript(t.src,function(){if(o.init===n)throw new Error("Load error!");o.init(o.config),function(){for(var n=0;n<r.length;n++){var t=r[n][0],i=r[n][1];o[t].apply(o,i)}r=void 0}()}),this}}();
  // Define config and initialize Lytics tracking tag.
  // - The setup below will disable the automatic sending of Page Analysis Information (to prevent duplicative sends, as this same information will be included in the jstag.pageView() call below, by default)
  jstag.init({
    src: 'https://c.lytics.io/api/tag/a98b8f6463f08c3a8bf669d3d80a462f/latest.min.js'
  });
  
  // You may need to send a page view, depending on your use-case
  jstag.pageView();
            `
          }}
        />
        <PersonalizeProvider>
          <LyticsProvider>
            <Suspense fallback={<PageLoader text="Loading PhoneFront..." variant="spinner" />}>
              <div className="min-h-screen bg-gradient-to-r from-primary/10 via-background to-background">
                <SiteHeader />
                <main className="min-h-[60vh]">{children}</main>
                <SiteFooter />
              </div>
            </Suspense>
          </LyticsProvider>
        </PersonalizeProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
