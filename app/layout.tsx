import type { Metadata } from "next";
import "@fontsource-variable/noto-sans-kr";
import "@fontsource-variable/noto-serif-kr";
import "katex/dist/katex.min.css";
import "./globals.css";
import { getCatalog } from "@/lib/content";
import { assetPath } from "@/lib/paths";
import { ProgressProvider } from "@/components/ProgressProvider";
import { Shell } from "@/components/Shell";
export const metadata: Metadata = {
  metadataBase: new URL("https://jrohsc.github.io/knowledge/"),
  title: {
    default: "다시, 지식 — 매일 만나는 작은 백과사전",
    template: "%s | 다시, 지식",
  },
  description:
    "조금씩 읽고, 오래 기억하고, 서로 연결하기. 역사·철학·과학·수학을 시각적으로 이해하는 개인 지식 백과사전.",
  icons: { icon: assetPath("icon.svg") },
};
const themeScript = `try{var t=localStorage.getItem('knowledge.theme');document.documentElement.dataset.theme=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){}`;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ProgressProvider>
          <Shell topics={getCatalog()}>{children}</Shell>
        </ProgressProvider>
      </body>
    </html>
  );
}
