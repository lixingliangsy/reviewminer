import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

export default function App({ Component, pageProps }: AppProps) {
  return       <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ReviewMiner" />
        <meta property="og:description" content="Paste a batch of product reviews and get the recurring themes, a sentiment split, and three concrete improvement ideas you can ship." />
        <meta property="og:url" content="https://reviewminer.lxsaihub.com/" />
        <meta property="og:image" content="https://reviewminer.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ReviewMiner" />
        <meta name="twitter:description" content="Paste a batch of product reviews and get the recurring themes, a sentiment split, and three concrete improvement ideas you can ship." />
        <meta name="twitter:image" content="https://reviewminer.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"ReviewMiner","url":"https://reviewminer.lxsaihub.com/","description":"Paste a batch of product reviews and get the recurring themes, a sentiment split, and three concrete improvement ideas you can ship.","applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","priceCurrency":"USD","price":"0","availability":"https://schema.org/OnlineOnly"}}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
}
