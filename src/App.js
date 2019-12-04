import React, { useEffect, useState } from 'react'

import Consorciado from './pages/Consorciado'
import DonoContrato from './pages/DonoContrato'
import abi from './services/abi'


const styles = {
  fullSize: {
    height: '100%',
    minHeight: '100%'
  }
}


const ENUM_TYPE_LOGGED = {
  NOT_LOGGED: 1,
  DONO_CONTRATO: 2,
  CONSORCIADO: 3,
}


function App() {
  let contrato = null
  const [classAlignContainer, setClassAlignContainer] = useState('')
  const [userAccount, setUserAccount] = useState(null)

  const CarregandoLogin = () => (<h1 style={{ textAlign: 'center' }}>Logando...</h1>)
  const NotLogged = () => (<h1 style={{ textAlign: 'center' }}>Não está logado...</h1>)

  const PageHome = () => {
    if (!userAccount) {
      setClassAlignContainer('justify-content-center align-items-center')
      return <CarregandoLogin />
    }

    switch (userAccount.typePerfil) {
      case ENUM_TYPE_LOGGED.CONSORCIADO:
        setClassAlignContainer('justify-content-center align-items-center')
        return <Consorciado userAccount={userAccount} />
      case ENUM_TYPE_LOGGED.NOT_LOGGED:
        setClassAlignContainer('justify-content-center align-items-center')
        return <NotLogged />
      case ENUM_TYPE_LOGGED.DONO_CONTRATO:
        setClassAlignContainer('justify-content-center align-items-center')
        return <DonoContrato userAccount={userAccount} />
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
    const web3 = await startEthereum()

    const contratoAddress = process.env.REACT_APP_HASH_CONTRATO
    contrato = new web3.eth.Contract(abi, contratoAddress)
    console.log('Contrato: ', contrato)

    // setInterval(async function () {
    try {
      const [acc] = await web3.eth.getAccounts()
      if (!userAccount || acc !== userAccount.user) {
        // TODO: Verificar se é o dono ou consorciado
        const typePerfil = ENUM_TYPE_LOGGED.CONSORCIADO
        setUserAccount({
          user: acc,
          typePerfil
        })
      }
    } catch (error) {
      setUserAccount({
        user: null,
        typePerfil: ENUM_TYPE_LOGGED.NOT_LOGGED
      })
    }
    // }, 100)
  }

  useEffect(() => {
    startContrato()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="container" style={styles.fullSize}>
        <div style={styles.fullSize} className={`row ${classAlignContainer}`}>
          <div className="col-sm-12 col-lg-6">
            <PageHome />
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
