import React, { useEffect, useState } from 'react'

import Consorciado from './pages/Consorciado/Index'
import DonoContrato from './pages/DonoContrato'
import abi from './services/abi'


const styles = {
  fullSize: {
    height: '100%',
    minHeight: '100%'
  }
}

const ENUM_TYPE_LOGGED = {
  DONO_CONTRATO: 2,
  CONSORCIADO: 3,
}

let etherConfig = null


function App() {
  const [classAlignContainer, setClassAlignContainer] = useState('')
  const [userAccount, setUserAccount] = useState(null)

  const NotLogged = () => (<h1 style={{ textAlign: 'center' }}>Entre no MetaMask para continuar...</h1>)

  const PageHome = () => {
    if (!userAccount) {
      setClassAlignContainer('justify-content-center align-items-center')
      return <NotLogged />
    }

    switch (userAccount.typePerfil) {
      case ENUM_TYPE_LOGGED.CONSORCIADO:
        setClassAlignContainer('justify-content-center align-items-center')
        return <Consorciado userAccount={userAccount} etherConfig={etherConfig} />
      case ENUM_TYPE_LOGGED.DONO_CONTRATO:
        setClassAlignContainer('justify-content-center align-items-center')
        return <DonoContrato userAccount={userAccount} etherConfig={etherConfig} />
      default:
        setClassAlignContainer('justify-content-center align-items-center')
        return <NotLogged />
    }
  }

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
    if (!etherConfig) {
      const web3 = await startEthereum()
      const contratoAddress = process.env.REACT_APP_HASH_CONTRATO
      const contrato = new web3.eth.Contract(abi, contratoAddress)
      etherConfig = { web3, contrato }
    }

    try {
      const [acc] = await etherConfig.web3.eth.getAccounts()
      if (acc && (!userAccount || acc !== userAccount.user)) {
        const isDono = await etherConfig.contrato.methods.isDono().call({ from: acc })
        const typePerfil = isDono ? ENUM_TYPE_LOGGED.DONO_CONTRATO : ENUM_TYPE_LOGGED.CONSORCIADO
        setUserAccount({ user: acc, typePerfil })
      } else if (!acc && userAccount) {
        setUserAccount(null)
      }
    } catch (error) {
      console.error(error)
      setUserAccount(null)
    }
    // }, 1000)
  }

  useEffect(() => {
    startContrato()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccount])

  return (
    <>
      <div className="container" style={styles.fullSize}>
        <div style={styles.fullSize} className={`row ${classAlignContainer}`}>
          <div className="col-sm-12 col-lg-8">
            <PageHome />
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
