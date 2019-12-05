import React, { } from 'react';


function App(props) {

  const { etherConfig, userAccount, actionPostCadastrado } = props

  const actionCadastrarNoConsorcio = async () => {
    await etherConfig.contrato.methods.cadastrarConsorciado().send({
      from: userAccount.user
    })

    const isConsorciadoCadastrado = await etherConfig.contrato.methods.isConsorciadoCadastrado().call({
      from: userAccount.user
    })

    console.log(isConsorciadoCadastrado)

    if (isConsorciadoCadastrado) {
      actionPostCadastrado()
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          {userAccount.user}
        </div>
        <div className="card-body">
          <h5 className="card-title text-center">Valor do crédito: 800 ether</h5>
          <div>
            <h6 className="my-0">Valor Parcela</h6>
            <small className="text-muted">20 wie</small>
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
