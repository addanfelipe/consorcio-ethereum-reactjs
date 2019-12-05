import React, { useEffect, useState } from 'react';

import Cadastrar from './../Cadastrar'
import Home from './../Home'

function App(props) {

  const { etherConfig, userAccount } = props

  const [isConsorciadoCadastrado, setIsConsorciadoCadastrado] = useState(null)

  const actionIsConsorciadoCadastrado = async () => {
    const isConsorciadoCadastrado = await etherConfig.contrato.methods.isConsorciadoCadastrado().call({
      from: userAccount.user
    })
    setIsConsorciadoCadastrado(isConsorciadoCadastrado)
  }

  const Page = () => {
    if (isConsorciadoCadastrado === null) {
      return <div className="text-center">Carregando...</div>
    } else if (!isConsorciadoCadastrado) {
      return <Cadastrar etherConfig={etherConfig} userAccount={userAccount} 
                  actionPostCadastrado={actionIsConsorciadoCadastrado} />
    } else {
      return <Home etherConfig={etherConfig} userAccount={userAccount} />
    }
  }

  useEffect(() => {
    actionIsConsorciadoCadastrado()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Page />
    </>
  );
}

export default App;
