import React from 'react'

import Litepapaer_TOM2 from 'assets/Litepapaer_TOM2 Finance_Jan 14th (ENG).pdf'

const Footer = () => {
    return (
        <footer>
            <a href="https://etherscan.io/address/0xF7970499814654CD13Cb7B6E7634A12a7A8A9ABc">Contract</a>
            <a href="https://discord.gg/T7Xgc8f">Discord</a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#">Telegram</a>
            <a href="https://twitter.com/defi_tom">Twitter</a>
            <a href="https://github.com/TomFinance">Github</a>
            <a href={Litepapaer_TOM2} target="_blank" rel="noreferrer">Docs</a>
        </footer>
    )
}

export default Footer