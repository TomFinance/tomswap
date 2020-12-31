import Web3 from "web3"
import { accountLocalStorage } from "./utils"

const etherWeb3 = new Web3(window.ethereum)

export const metaMaskIsInstalled = () => Boolean(window.ethereum && window.ethereum.isMetaMask)

export const getMetaMaskMyAccount = async () => {
    const response = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return response[0]
}

export const metaMaskGetAccount = async () => {
    return accountLocalStorage.getMyAccountAddress()
}

export const metaMaskGetBalance = async (account) => {
    const response = await window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
    document.querySelector("#balancePanel>.value").innerHTML = `${(Number(response) / 1e18).toFixed(4)} ETH`
    return Number(response) / 1e18
}

export const metaMaskGetBlock = async () => {
    return await etherWeb3.eth.getBlock(`latest`)
}

export const metaMaskSendTx = obj => {
    return etherWeb3.eth.sendTransaction(obj)

    // etherWeb3.eth.subscribe('pendingTransactions', (err, result) => {
    //     if (err) console.log("🚀 ~ file: AddLiquidity.js ~ line 144 ~ subscription ~ result", result)
    // }).on("data", transaction => {
    //     console.log("🚀 ~ file: AddLiquidity.js ~ line 147 ~ subscription ~ transaction", transaction)
    // })
}

export const metaMaskCall = async (address, method, args) => {

    // const response = await window.ethereum.request({method : 'eth_call', params : [{to : address, data : ''}]});
}