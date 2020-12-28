import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'

import Header from './Header'
import SettingModal from 'Header/Setting'
import Body from 'Body'
import Footer from 'Footer/Footer'
import { accountLocalStorage } from 'utils/utils'


function App({ history }) {
  const [currentAccount, setCurrentAccount] = useState(null)
  const [currentBalance, setCurrentBalance] = useState(0)

  const getBalance = async account => {
    const response = await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
    setCurrentBalance(Number(response) / 1e18)
  }

  const handleConnectMetaMask = async () => {
    try {
      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async res => {
          if (res.length) {
            const tempCurrentAccount = res[0]
            setCurrentAccount(tempCurrentAccount)
            accountLocalStorage.setMyAccountAddress(tempCurrentAccount)

            return tempCurrentAccount
          }
        })
        .then(tempAccount => {
          if (tempAccount) {
            getBalance(tempAccount)
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
  }

  const handleIsUnlocked = () => {
    if (window.ethereum._state.isUnlocked) {
      handleConnectMetaMask()
    } else {
      setCurrentAccount(null)
      setCurrentBalance(0)
      accountLocalStorage.removeMyAccountAddress()
      console.log('Please connect to MetaMask.')
    }
  }

  useEffect(() => {
    handleConnectMetaMask()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleIsUnlocked)
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
