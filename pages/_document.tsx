import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="alternate" hrefLang="x-default" href="https://reviewminer.lxsaihub.com/" />
        <link rel="alternate" hrefLang="en" href="https://reviewminer.lxsaihub.com/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
