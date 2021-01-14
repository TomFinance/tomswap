import React, { useCallback, useEffect, useReducer } from 'react'
import { withRouter } from 'react-router-dom'

import Header from './Header'
import SettingModal from 'Header/Setting'
import Body from 'Body'
import Footer from 'Footer/Footer'
import { getBalance } from 'utils/web3Utils'
import { accountLocalStorage, networkLocalStorage } from 'utils/utils'
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
              const perAccount = accountLocalStorage.getMyAccount()

              if (perAccount !== tempCurrentAccount) {
                accountLocalStorage.setMyAccount(tempCurrentAccount)
                window.location.reload()
              } else {
                setMyAccount({
                  address: tempCurrentAccount,
                  balance: await getBalance(tempCurrentAccount)
                })
              }
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
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleIsUnlocked)
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleIsUnlocked)
      }
    }
  }, [handleIsUnlocked])

  const handleIsNetwork = useCallback(() => {
    const newNewwork = window.ethereum.chainId

    if (newNewwork) {
      const perNetwork = networkLocalStorage.getMyNetwork()

      if (perNetwork !== newNewwork) {
        networkLocalStorage.setMyNetwork(newNewwork)
        window.location.reload()
      } else {
        // Ethereum Mainnet
        if (newNewwork !== '0x1') {
          if (!process.env.REACT_APP_ENV && process.env.NODE_ENV === 'production') {
            alert('Mainnet으로 변경해주십시오.')
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('networkChanged', handleIsNetwork)
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('networkChanged', handleIsNetwork)
      }
    }
  }, [handleIsNetwork])

  useEffect(() => {
    // if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    //   alert('현재 모바일은 지원하지 않고 있습니다. PC로 접속해주시길 바랍니다.')
    // }
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false
      handleIsNetwork()
      handleConnectMetaMask()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
