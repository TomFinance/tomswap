import React from 'react'

import Litepapaer_TOM2 from 'assets/Litepapaer_TOM2 Finance_Jan 14th (ENG).pdf'

const Footer = () => {
    return (
        <footer>
            <a href="https://etherscan.io/address/0xdEB7B15eCc6c8F2e22A22e2252789A0E4713A7A8" target="_blank" rel="noreferrer">Contract</a>
            <a href="https://discord.gg/T7Xgc8f" target="_blank" rel="noreferrer">Discord</a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#">Telegram</a>
            <a href="https://twitter.com/defi_tom" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://github.com/TomFinance" target="_blank" rel="noreferrer">Github</a>
            <a href={Litepapaer_TOM2} target="_blank" rel="noreferrer">Docs</a>
        </footer>
    )
}

export default Footer