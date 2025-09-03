import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="de">
        <Head>
          {/* Google Analytics */}
          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}

          {/* Facebook Pixel */}
          {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
          )}

          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="preconnect" href="https://www.paypal.com" />
          <link rel="preconnect" href="https://api.paypal.com" />
          
          {/* Load Inter font with display=swap for better performance */}
          <link 
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;750&display=swap" 
            rel="stylesheet" 
          />
          
          {/* DNS prefetch for performance */}
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//api.sandbox.paypal.com" />
          
          {/* Prefetch critical resources */}
          <link rel="prefetch" href="/_next/static/chunks/framework.js" />
          
          {/* Viewport meta should not be in _document.tsx - moved to _app.tsx if needed */}
          <meta name="theme-color" content="#FF6B35" />
          
          {/* Performance hints */}
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="format-detection" content="telephone=no" />
          
          {/* Basic SEO Meta Tags */}
          <meta name="robots" content="index,follow" />
          <meta name="googlebot" content="index,follow" />
          <link rel="canonical" href="https://youshark.de" />
          
          {/* Language and Geographic Targeting */}
          <meta name="language" content="German" />
          <meta name="geo.region" content="DE" />
          <meta name="geo.placename" content="Germany" />
          
          {/* Favicon and App Icons */}
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          
          {/* Additional SEO Tags */}
          <meta name="author" content="YouShark" />
          <meta name="publisher" content="YouShark" />
          <meta name="copyright" content="© 2024 YouShark. All rights reserved." />
          <meta name="revisit-after" content="1 days" />
          <meta name="distribution" content="web" />
          <meta name="rating" content="general" />
        </Head>
        <body>
          <Main />
          <NextScript />
          
          {/* No-JS fallback for Facebook Pixel */}
          {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          )}
        </body>
      </Html>
    )
  }
}