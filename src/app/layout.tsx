import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webhook 日志系统",
  description: "一个接受 webhook 的日志信息展示系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
