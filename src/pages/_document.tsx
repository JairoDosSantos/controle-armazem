import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    {/**    <link rel="manifest" href="/manifest.json" /> */}
                    <link rel="apple-touch-icon" href="/icon.png"></link>
                    <meta name="theme-color" content="#fff" />

                    <meta name="application-name" content="PWA App" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content="PWA App" />
                    <meta name="description" content="Sistema de gestão de custo" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                    <meta name="msapplication-TileColor" content="#2B5797" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#000000" />

                    <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
                    <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

                    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />

                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:url" content="https://controle-armazem.vercel.app/" />
                    <meta name="twitter:title" content="SCA- NOAH" />
                    <meta name="twitter:description" content="Sistema de controle de armazem" />
                    <meta name="twitter:image" content="https://controle-armazem.vercel.app/icons/android-chrome-192x192.png" />
                    <meta name="twitter:creator" content="@JairoSantos" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="SCA- NOAH" />
                    <meta property="og:description" content="Sistema de controle de armazem" />
                    <meta property="og:site_name" content="SCA- NOAH" />
                    <meta property="og:url" content="https://controle-armazem.vercel.app/" />
                    <meta property="og:image" content="https://controle-armazem.vercel.app/icons/apple-touch-icon.png" />

                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;