import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = ({ currentAccount, history }) => {
    const [showMyAccount, setShowMyAccount] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)

    return (
        <>
            <header>
                <h1><Link to={'/'}><img src="/images/ico/ico_logo.png" alt="" /></Link></h1>
                <nav>
                    <h2 onClick={() => setMobileMenu(!mobileMenu)}>메뉴</h2>
                    <div className={`${mobileMenu ? '' : 'mb_hidden'}`}>
                        <ul>
                            <li className={`${history.location.pathname.includes('tom2') && 'on'}`}><Link to={'/tom2'}>TOM2</Link></li>
                            <li className={`${history.location.pathname.includes('exchange') && 'on'}`}><Link to={'/exchange/swap'}>Exchange</Link></li>
                            {/* <li><a href="#;">Staking</a></li>
                            <li><a href="#;">Investmeat</a></li>
                            <li><a href="#;">Info</a></li> */}
                        </ul>
                        {currentAccount ? (
                            <button onClick={() => setShowMyAccount(true)}>My Wallet</button>
                        ) : (
                                <button >Unlock wallet</button>
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
                                <strong>0.000</strong>
                                <p>TOM2 Balance</p>
                            </div>
                            <a href="#;">View on Etherscan</a>
                        </div>
                        <a href="#;" className="pop_close" onClick={() => setShowMyAccount(false)}>Cancel</a>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header