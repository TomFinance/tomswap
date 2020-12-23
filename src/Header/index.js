import React from 'react'
import { Link } from 'react-router-dom'

const Header = ({ currentAccount, history }) => {
    return (
        <>
            <header>
                <h1><Link to={'/'}><img src="/images/ico/ico_logo.png" alt="" /></Link></h1>
                <nav>
                    <h2>메뉴</h2>
                    <div className="mb_hidden">
                        <ul>
                            <li className={`${history.location.pathname.includes('tom2') && 'on'}`}><Link to={'/tom2'}>TOM2</Link></li>
                            <li className={`${history.location.pathname.includes('exchange') && 'on'}`}><Link to={'/exchange/swap'}>Exchange</Link></li>
                            {/* <li><a href="#;">Staking</a></li>
                            <li><a href="#;">Investmeat</a></li>
                            <li><a href="#;">Info</a></li> */}
                        </ul>
                        {currentAccount ? (
                            <button >My Wallet</button>
                        ) : (
                                <button >Unlock wallet</button>
                            )}
                    </div>
                </nav>
            </header>
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
                    <a href="#;" className="pop_close">Cancel</a>
                </div>
            </div>
        </>
    )
}

export default Header