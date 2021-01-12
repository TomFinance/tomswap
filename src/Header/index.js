import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMetaMaskMyAccount } from 'utils/metaMask'
import { convertDecimal } from 'utils/utils'
import { getBalance } from 'utils/web3Utils'

const Header = ({ myAccount, setMyAccount, history }) => {
    const [showMyAccount, setShowMyAccount] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)

    const getMyBalance = useCallback(async () => {
        setMyAccount({
            ...myAccount,
            balance: await getBalance(await getMetaMaskMyAccount())
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getMyBalance()
    }, [getMyBalance])

    useEffect(() => {
        setMobileMenu(false)
        setShowMyAccount(false)
    }, [history.location.pathname])

    return (
        <>
            <header>
                <h1><Link to={'/'}><img src="/images/ico/ico_logo.png" alt="" /></Link></h1>
                <nav>
                    <h2 onClick={() => setMobileMenu(!mobileMenu)}>메뉴</h2>
                    <div className={`${mobileMenu ? '' : 'mb_hidden'}`}>
                        <ul>
                            <li className={`${history.location.pathname.includes('farm') && 'on'}`}><Link to={'/farm'}>FARM</Link></li>
                            <li className={`${history.location.pathname.includes('exchange') && 'on'}`}><Link to={'/exchange/swap'}>Exchange</Link></li>
                            {/* <li><a href="#;">Staking</a></li>
                            <li><a href="#;">Investmeat</a></li>
                            <li><a href="#;">Info</a></li> */}
                        </ul>
                        {myAccount.address ? (
                            <button onClick={() => setShowMyAccount(true)}>My Wallet</button>
                        ) : (
                                <button onClick={() => window.location.reload()}>Unlock wallet</button>
                            )}
                    </div>
                </nav>
            </header>
            {showMyAccount && (
                <div id="my_pop" className="popup_wrap">
                    <div className="popup">
                        <div className="pop_con">
                            <h3>My Account</h3>
                            <div className="my_icon">
                                <i><img src="../assets/images/ico/ico_my_account.png" alt="" /></i>
                                <strong>{convertDecimal(myAccount.balance, 18)}</strong>
                                <p>TOM2 Balance</p>
                            </div>
                            <a href={myAccount.address ? `https://etherscan.io/address/${myAccount.address}` : '#'} target="_blank" rel="noreferrer">View on Etherscan</a>
                        </div>
                        <a href="#;" className="pop_close" onClick={() => setShowMyAccount(false)}>Cancel</a>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header