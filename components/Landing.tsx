import React, { ReactElement } from 'react'
import styles from 'styles/Landing.module.css'

const Landing = (): ReactElement => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Upload and browse pictures of meals from your favourite restaurants.
          </h1>
          <h3 className={styles.subtitle}>Sign in to get started!</h3>
        </div>
        <img src="tasting.svg" className={styles.illustration}></img>
      </div>
    </>
  )
}

export default Landing
