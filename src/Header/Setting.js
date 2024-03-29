import React, { useState } from 'react'
import { convertDecimal } from 'utils/utils'

const SettingModal = ({ myAccount }) => {
    // const [showSetting, setShowSetting] = useState(false)
    // const [showMore, setShowMore] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)

    return myAccount.address ? (
        <div className="global">
            <div className="menu_bar">
                <p className="eth">{`${convertDecimal(myAccount.balance, 18)} ETH`}</p >
                <p className="eth_num">{`${myAccount.address.slice(0, 8)}...${myAccount.address.slice(-4)}`}</p>
                {/* <div className="setting">
                    <a href="#;" className="set_icon" onClick={() => setShowSetting(!showSetting)}> </a>
                    {showSetting && (
                        <div className="set_box">
                            <strong>Transaction Settings</strong>
                            <div className="set_tit">Slippage Toference
                            <HelpBox id={1} helpText={''}/>
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
                            <HelpBox id={2} helpText={''}/>
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
                                        <HelpBox id={3} helpText={''}/>
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
                </div> */}
                {/* <div className="more" onClick={() => setShowMore(!showMore)}>
                    {showMore && (
                        <ul>
                            <li className="set01"><a href="#;">Analytics</a></li>
                            <li className="set02"><a href="#;">Stake</a></li>
                            <li className="set03"><a href="#;">Farm</a></li>
                            <li className="set04"><a href="#;">Discord</a></li>
                            <li className="set05"><a href="#;">Code</a></li>
                        </ul>
                    )}
                </div> */}
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