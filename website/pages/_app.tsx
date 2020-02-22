import 'cross-fetch/polyfill';
import { AppProps } from 'next/app';

import '../styles/index.css';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

// App.getInitialProps = async ({ Component, ctx }) => {
//   const pageProps = {};
//   if (Component.getInitialProps) {
//     Object.assign(
//       pageProps,
//       await Component.getInitialProps({ ctx }),
//     );
//   }
//   return { pageProps };
// };

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps({ ctx });
  }
  return { pageProps };
};

export default App;
