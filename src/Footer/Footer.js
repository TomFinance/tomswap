import React from 'react'

import TOM_Finance_Litepaper_Ver from 'assets/TOM_Finance_Litepaper_Ver2.0.0.pdf'

const Footer = () => {
    return (
        <footer>
            <a href="https://etherscan.io/address/0xF7970499814654CD13Cb7B6E7634A12a7A8A9ABc">Contract</a>
            <a href="https://discord.gg/T7Xgc8f">Discord</a>
            <a href="#">Telegram</a>
            <a href="https://twitter.com/defi_tom">Twitter</a>
            <a href="https://github.com/TomFinance">Github</a>
            <a href={TOM_Finance_Litepaper_Ver} target="_blank" rel="noreferrer">Docs</a>
        </footer>
    )
}

export default Footer