import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import Header from './Header'
import SettingModal from 'Header/Setting'
import Body from 'Body'
import Footer from 'Footer/Footer'

import { accountLocalStorage } from './utils'

function App({ history }) {
  const [currentAccount, setCurrentAccount] = useState(accountLocalStorage.getMyAccountAddress())
  const [currentBalance, setCurrentBalance] = useState(0)

  useEffect(() => {
    try {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async res => {
          if (res.length) {
            const tempCurrentAccount = res[0]
            setCurrentAccount(tempCurrentAccount)
            accountLocalStorage.setMyAccountAddress(tempCurrentAccount)
            console.log(`${currentAccount.slice(0, 8)}...${currentAccount.slice(-4)}`)

            const response = await window.ethereum.request({ method: 'eth_getBalance', params: [currentAccount, 'latest'] })
            setCurrentBalance(Number(response) / 1e18)
          }
        })
        .catch((err) => {
          if (err.code === 4001) {
            console.log('Please connect to MetaMask.')
          } else {
            if (err.message === 'Already processing eth_requestAccounts. Please wait.') {
              window.location.reload()
            }
          }
        })
    } catch (error) {
      console.log(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="wrap" className={`${history.location.pathname === '/' ? '' : 'sub'}`}>
      <Header currentAccount={currentAccount} history={history} />
      <div id="container">
        <SettingModal currentAccount={currentAccount} currentBalance={currentBalance} />
        <Body />
      </div>
      <Footer />
    </div>
  )
}

export default withRouter(App)
