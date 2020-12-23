import React, { useState } from 'react'

const SettingModal = ({ currentAccount, currentBalance }) => {
    const [showSetting, setShowSetting] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [showUpdate, setShowUpdate] = useState(true)

    return currentAccount ? (
        <div className="global">
            <div className="menu_bar">
                <p className="eth">{`${currentBalance.toFixed(4)} ETH`}</p>
                <p className="eth_num">{`${currentAccount.slice(0, 8)}...${currentAccount.slice(-4)}`}</p>
                <div className="setting">
                    <a href="#;" className="set_icon" onClick={() => setShowSetting(!showSetting)}> </a>
                    {showSetting && (
                        <div className="set_box">
                            <strong>Transaction Settings</strong>
                            <div className="set_tit">Slippage Toference
                                <a href="#;" className="q_ico">
                                    <div className="help_box">
                                        Find a token...
                                    </div>
                                </a>
                            </div>
                            <ul>
                                <li className="on"><a href="#;">0.1%</a></li>
                                <li><a href="#;">0.5%</a></li>
                                <li><a href="#;">1%</a></li>
                                <li>
                                    <input type="text" placeholder="0.50" />
                                    <p>%</p>
                                </li>
                            </ul>
                            <div className="set_tit">Transaction deadline
                                <a href="#;" className="q_ico">
                                    <div className="help_box">
                                        Find a token...
                                    </div>
                                </a>
                            </div>
                            <div className="min">
                                <input type="text" placeholder="0.50" />
                                <span>Minutes</span>
                            </div>
                            <strong>Interface Settings</strong>
                            <div className="inter">
                                <ul>
                                    <li>
                                        <div className="set_tit">Toggle Expert Mode
                                            <a href="#;" className="q_ico">
                                                <div className="help_box">
                                                    Find a token...
                                                </div>
                                            </a>
                                        </div>
                                        <div className="mode">
                                            <label>
                                                <input type="checkbox" />
                                                <i></i>
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="set_tit">Toggle Dark Mode</div>
                                        <div className="mode">
                                            <label>
                                                <input type="checkbox" />
                                                <i></i>
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <a href="#;" className="close" onClick={() => setShowSetting(false)}>닫기</a>
                        </div>
                    )}
                </div>
                <div className="more" onClick={() => setShowMore(!showMore)}>
                    {showMore && (
                        <ul>
                            <li className="set01"><a href="#;">Analytics</a></li>
                            <li className="set02"><a href="#;">Stake</a></li>
                            <li className="set03"><a href="#;">Farm</a></li>
                            <li className="set04"><a href="#;">Discord</a></li>
                            <li className="set05"><a href="#;">Code</a></li>
                        </ul>
                    )}
                </div>
            </div>
            {showUpdate && (
                <div className="update_box">
                    <p>An update is …<br />“1inch” …</p>
                    <ul>
                        <li>TOMOE, LUA …</li>
                        <li>HEX2T …</li>
                        <li>1 token updated</li>
                    </ul>
                    <div className="up_btn">
                        <a href="#;" className="up_btn01">Accept update</a>
                        <a href="#;" className="up_btn02">Dismiss</a>
                    </div>
                    <a href="#;" className="close" onClick={() => setShowUpdate(false)}>닫기</a>
                </div>
            )}
        </div>
    ) : null
}

export default SettingModal