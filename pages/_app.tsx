import { ReactElement } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import 'bootstrap/dist/css/bootstrap.min.css'

function FoodpixApp({ Component, pageProps }: AppProps): ReactElement {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default FoodpixApp
