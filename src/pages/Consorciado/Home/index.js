import React, { useEffect, useState } from 'react';


function App(props) {

  const { etherConfig, userAccount } = props

  const [dadosConsorciado, setDadosConsorciado] = useState(null)
  const [listContemplados, setListContemplados] = useState(null)


  const actionGetDadosConsorciado = async () => {
    const _dadosConsorciado = await etherConfig.contrato.methods.dadosConsorciado().call({
      from: userAccount.user
    })
    setDadosConsorciado(_dadosConsorciado)
  }

  const actionPagarParcela = async () => {
    await etherConfig.contrato.methods.pagarParcela().send({
      from: userAccount.user, value: dadosConsorciado.valorParcela
    })
    // await etherConfig.contrato.methods.pagarParcela(dadosConsorciado.valorParcela).send({ from: userAccount })
    await actionGetDadosConsorciado()
  }

  const actionShowListContemplados = async () => {
    const lista = await etherConfig.contrato.methods.listaConsorciadoContemplado().call({
      from: userAccount.user
    })
    setListContemplados(lista)
    window.$('#modalShowListContemplados').modal('show')
  }

  const ModalShowListContemplados = () => {
    if (!listContemplados) {
      return <></>
    }

    return (
      <div className="modal fade" id="modalShowListContemplados" role="dialog" aria-labelledby="modalShowListContempladosLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalShowListContempladosLabel">Contemplados</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="list-group">
                {listContemplados.map((item, index) => (
                  <button key={index} type="button" className="list-group-item list-group-item-action">
                    {index + 1} - {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  useEffect(() => {
    actionGetDadosConsorciado()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!dadosConsorciado) {
    return (
      <>
        <h5 className="text-center">Carregando dados...</h5>
      </>
    )
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          {userAccount.user}
        </div>
        <div className="card-body">
          <h5 className="card-title text-center">Valor do crédito: {dadosConsorciado.valorPremio / 1000000000000000000} ether</h5>
          <div className="text-center">
            <button className="btn btn-success"
              onClick={actionPagarParcela}>
              {dadosConsorciado.isMesAtualPago ? 'Adiantar parcela' : 'Pagar parcela'}
            </button>
          </div>
          <div>
            <h6 className="my-0">Valor Parcela</h6>
            <small className="text-muted">{dadosConsorciado.valorParcela / 1000000000000000000} ether</small>
          </div>
          <div>
            <h6 className="my-0">Já foi contemplado</h6>
            <small className="text-muted">{dadosConsorciado.isConsorciadoContemplada ? 'Sim' : 'Não'}</small>
          </div>
          <div>
            <h6 className="my-0">Parcelas pendentes</h6>
            <small className="text-muted">
              {dadosConsorciado.qtdParcelaPendente}/{dadosConsorciado.qtdTotalParcela}
            </small>
          </div>
          <div>
            <h6 className="my-0">Vencimento (dia)</h6>
            <small className="text-muted">
              {dadosConsorciado.diaVencimentoPagamento}
            </small>
          </div>
        </div>
        <div className="card-footer text-muted text-center">
          <button className="btn btn-outline-dark btn-sm"
            onClick={actionShowListContemplados}>
            Contemplados
          </button>
        </div>
      </div>

      <ModalShowListContemplados />
    </>
  );
}

export default App;
