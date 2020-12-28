import React from 'react'

const LoadingModal = ({ setShowModal }) => {
    return (
        <div id="loading_pop" className="popup_wrap">
            <div className="popup">
                <div className="pop_con">
                    <div className="loader loader--style3" title="2">
                        <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg"
                            xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="100px"
                            viewBox="0 0 50 50"
                            // style="enable-background:new 0 0 50 50;"
                            space="preserve">
                            <path fill="#000"
                                d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">
                                <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25"
                                    to="360 25 25" dur="0.6s" repeatCount="indefinite" />
                            </path>
                        </svg>
                    </div>
                    <strong>Waiting For Confirmation</strong>
                    {/* <p>Swapping 0.1 ETH for 60.0000 USDT</p> */}
                    {/* <span>Confirm this transaction in your wallet</span> */}
                </div>
                <button className="pop_close" onClick={() => setShowModal({ confirm: false, loading: false })}>닫기</button>
            </div>
        </div >
    )
}

export default LoadingModal