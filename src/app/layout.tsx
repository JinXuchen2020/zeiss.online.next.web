import type { Metadata } from 'next'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Script from 'next/script'
 
export const metadata: Metadata = {
  title: '蔡司资源管理系统',
  description: 'Web site created using create-react-app',
  icons: "assets/images/zeiss.png",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* <base href="%PUBLIC_URL%/" /> */}
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" href="assets/images/zeiss.png" />
        <link rel="manifest" href="manifest.json" />
        <link href="assets/azuremediaplayer.min.css" rel="stylesheet" />
      </head>
      <body>
        <div id="root"><AntdRegistry>{children}</AntdRegistry></div>
        <Script src="assets/azuremediaplayer.min.js" />
        <Script src="//res.wx.qq.com/open/js/jweixin-1.2.0.js" referrerPolicy='origin' />
        <Script src="//open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js" referrerPolicy='origin' />
      </body>
    </html>
  )
}