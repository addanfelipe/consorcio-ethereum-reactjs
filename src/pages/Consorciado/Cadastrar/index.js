import React, { useEffect, useState } from 'react';


function App(props) {

  const { etherConfig, userAccount, actionPostCadastrado } = props
  const [dadosConsorcio, setDadosConsorcio] = useState(null)

  const actionCadastrarNoConsorcio = async () => {
    await etherConfig.contrato.methods.cadastrarConsorciado().send({
      from: userAccount.user
    })

    const isConsorciadoCadastrado = await etherConfig.contrato.methods.isConsorciadoCadastrado().call({
      from: userAccount.user
    })

    if (isConsorciadoCadastrado) {
      actionPostCadastrado()
    }
  }

  const init = async () => {
    const _dadosConsorcio = await etherConfig.contrato.methods.dadosConsorcio().call({
      from: userAccount.user
    })
    console.log(dadosConsorcio)
    setDadosConsorcio(_dadosConsorcio)
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!dadosConsorcio) {
    return <h1>Carregando dados...</h1>
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          {userAccount.user}
        </div>
        <div className="card-body">
          <h5 className="card-title text-center">Valor do crédito: {dadosConsorcio.valorPremio / 1000000000000000000} ether</h5>
          <div>
            <h6 className="my-0">Valor Parcela</h6>
            <small className="text-muted">{dadosConsorcio.valorParcela} wei</small>
          </div>
          <div>
            <h6 className="my-0">Qtd. Parcelas</h6>
            <small className="text-muted">{dadosConsorcio.qtdTotalParcela}</small>
          </div>
          <div className="text-center">
            <button className="btn btn-success"
              onClick={actionCadastrarNoConsorcio}>
              Entrar no consorcio
          </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
