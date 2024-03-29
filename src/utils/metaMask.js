import Web3 from "web3"

const etherWeb3 = new Web3(window.ethereum)

export const metaMaskIsInstalled = () => Boolean(window.ethereum && window.ethereum.isMetaMask)

export const getMetaMaskMyAccount = async () => {
    const response = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return response[0]
}

export const metaMaskGetBlock = async () => {
    return await etherWeb3.eth.getBlock(`latest`)
}

export const metaMaskSendTx = obj => {
    return etherWeb3.eth.sendTransaction(obj)
}