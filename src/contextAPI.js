import { createContext } from "react"

const initMyAccount = {
    address: '',
    balance: 0
}

const myAccountReducer = (account, updateMyAccount) => {
    return {
        ...account,
        ...updateMyAccount
    }
}

const myAccountDispatch = createContext(null)

export { initMyAccount, myAccountReducer, myAccountDispatch }