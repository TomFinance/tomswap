import React, { useCallback, useEffect, useReducer } from 'react'
import { withRouter } from 'react-router-dom'

import Header from './Header'
import SettingModal from 'Header/Setting'
import Body from 'Body'
import Footer from 'Footer/Footer'
import { getBalance } from 'utils/web3Utils'
import { myAccountReducer, myAccountDispatch } from 'contextAPI'

function App({ history }) {
  const [myAccount, setMyAccount] = useReducer(myAccountReducer, myAccountDispatch)

  const handleConnectMetaMask = async () => {
    try {
      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async res => {
          if (res.length) {
            const tempCurrentAccount = res[0]

            if (tempCurrentAccount) {
              setMyAccount({
                address: tempCurrentAccount,
                balance: await getBalance(tempCurrentAccount)
              })
            }
          }
        }).catch((err) => {
          if (err.code === 4001) {
            console.log('Please connect to MetaMask.')
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  const handleIsUnlocked = useCallback(() => {
    if (window.ethereum._state.isUnlocked) {
      handleConnectMetaMask()
    } else {
      setMyAccount({
        address: '',
        balance: 0
      })
      console.log('Please connect to MetaMask.')
    }
  }, [])

  useEffect(() => {
    handleConnectMetaMask()

    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false
      window.ethereum.on('accountsChanged', handleIsUnlocked)
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleIsUnlocked)
      }
    }
  }, [handleIsUnlocked])

  return (
    <div id="wrap" className={`${history.location.pathname === '/' ? '' : 'sub'}`}>
      <Header myAccount={myAccount} setMyAccount={setMyAccount} history={history} />
      <div id="container">
        <SettingModal myAccount={myAccount} />
        <Body />
      </div>
      <Footer />
    </div>
  )
}

export default withRouter(App)
