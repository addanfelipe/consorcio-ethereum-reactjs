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
  DONO_CONTRATO: 2,
  CONSORCIADO: 3,
}


function App() {
  let contrato = null
  const [classAlignContainer, setClassAlignContainer] = useState('')
  const [userAccount, setUserAccount] = useState(null)

  const NotLogged = () => (<h1 style={{ textAlign: 'center' }}>Entre no MetaMask para continuar..</h1>)

  const PageHome = () => {
    if (!userAccount) {
      setClassAlignContainer('justify-content-center align-items-center')
      return <NotLogged />
    }

    switch (userAccount.typePerfil) {
      case ENUM_TYPE_LOGGED.CONSORCIADO:
        setClassAlignContainer('justify-content-center align-items-center')
        return <Consorciado userAccount={userAccount} />
      case ENUM_TYPE_LOGGED.DONO_CONTRATO:
        setClassAlignContainer('justify-content-center align-items-center')
        return <DonoContrato userAccount={userAccount} contrato={contrato} />
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
    // console.log('Contrato: ', contrato)

    // setInterval(async function () {
    try {
      const [acc] = await web3.eth.getAccounts()
      // console.log('User load: ', acc)
      // console.log('User system: ', userAccount)
      if (acc && (!userAccount || acc !== userAccount.user)) {
        // console.log('User load: ', acc)
        // console.log('User system: ', userAccount)
        // console.log('usuario entrou')
        // TODO: Verificar se é o dono ou consorciado
        const isDono = await contrato.methods.isDono().call({ from: acc })
        console.log(isDono)
        console.log('a')
        const lista = await contrato.methods.listaConsorciadoContemplado().call({ from: acc })
        console.log('b')
        console.log(lista)
        const typePerfil = isDono ? ENUM_TYPE_LOGGED.DONO_CONTRATO : ENUM_TYPE_LOGGED.CONSORCIADO
        setUserAccount({ user: acc, typePerfil })
      } else if (!acc && userAccount) {
        console.log('usuario saiu')
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
          <div className="col-sm-12 col-lg-6">
            <PageHome />
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
