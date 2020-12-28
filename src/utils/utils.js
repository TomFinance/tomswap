export const accountLocalStorage = {
    getMyAccountAddress: () => {
        return localStorage.getItem('accountAddress')
    },

    setMyAccountAddress: value => {
        return localStorage.setItem('accountAddress', value)
    },

    removeMyAccountAddress: () => {
        return localStorage.removeItem('accountAddress')
    }
}

export const conventDecimal = (accountBalance, decimals) => {
    return (accountBalance / Math.pow(10, decimals)).toFixed(decimals)
}