import abi from './abi'

const startEthereum = async () => {
    let web3Provider = null
    if (window.ethereum) { // Modern dapp browsers...
        window.ethereum.autoRefreshOnNetworkChange = false // remove alert
        web3Provider = window.ethereum
        try { // Request account access
            window.ethereum.enable()
        } catch (error) { // User denied account access...
            console.error("User denied account access")
        }
    } else if (window.web3) { // Legacy dapp browsers...
        web3Provider = window.web3.currentProvider
    } else { // If no injected web3 instance is detected, fall back to Ganache
        console.log('No web3? You should consider trying MetaMask!')
        web3Provider = new window.Web3.providers.HttpProvider('http://localhost:7545')
    }

    return new window.Web3(web3Provider)
}

const startContrato = async () => {
    const web3 = await startEthereum()
    const contratoAddress = process.env.REACT_APP_HASH_CONTRATO
    const contrato = new web3.eth.Contract(abi, contratoAddress)
    return { web3, contrato }
}

export default startContrato