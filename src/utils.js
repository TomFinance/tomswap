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