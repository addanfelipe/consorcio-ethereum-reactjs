import React, { useEffect, useState } from 'react'
import { useInterval } from './utils/react'

import Consorciado from './pages/Consorciado/Index'
import DonoContrato from './pages/DonoContrato'
import connectionEthereum from './services/connectionEthereum'


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

  const loginUserAccount = async (userAddres) => {
    const isDono = await etherConfig.contrato.methods.isDono().call({ from: userAddres })
    const typePerfil = isDono ? ENUM_TYPE_LOGGED.DONO_CONTRATO : ENUM_TYPE_LOGGED.CONSORCIADO
    setUserAccount({ user: userAddres, typePerfil })
  }

  const startContrato = async () => {
    if (!etherConfig) {
      etherConfig = await connectionEthereum()
    }
    try {
      const [acc] = await etherConfig.web3.eth.getAccounts()
      if (acc && (!userAccount || acc !== userAccount.user)) {
        console.log('login: ', acc)
        loginUserAccount(acc)
      } else if (!acc && userAccount) {
        console.log('logout: ', userAccount)
        setUserAccount(null)
      }
    } catch (error) {
      console.error(error)
      setUserAccount(null)
    }
  }

  useEffect(() => {
    startContrato()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useInterval(() => {
    startContrato()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [2000])

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
