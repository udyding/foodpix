import { Provider } from 'next-auth/client'

function FoodpixApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default FoodpixApp
