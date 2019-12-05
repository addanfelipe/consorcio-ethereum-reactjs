import React, { useEffect, useState } from 'react';


function App(props) {

  const { etherConfig, userAccount } = props
  const [dadosDono, setDadosDono] = useState(null)
  const [listContemplados, setListContemplados] = useState(null)

  const actionSortear = async () => {
    await etherConfig.contrato.methods.sortear().send({
      from: userAccount.user
    })
  }

  const actionSacarTaxa = async () => {
    await etherConfig.contrato.methods.sacarTaxaTotal().send({
      from: userAccount.user
    })
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

  const Sortear = () => {
    if (new Date().getDay() + 1 !== parseInt(dadosDono.daySorteio)) {
      return <h5 className="text-center text-success">O sorteio ocorre no dia dadosDono.daySorteio de todo mês</h5>    
    } else if (dadosDono.saldoSorteioDisponivel < dadosDono.valorDoPremioPorConsorciado) {
      return <h5 className="text-center text-success">Saldo insuficiente</h5>
    } else if (dadosDono.qtdConsorciadoInscritos !== dadosDono.qtdTotalConsorciado) {
      return <h5 className="text-center text-success">Qtd. de consorciados insuficiente</h5>
    } else {
      return (
        <button className="btn btn-primary"
              onClick={actionSortear}>
          Sortear
        </button>
      )
    }
  }

  const init = async () => {
    const _dadosDono = await etherConfig.contrato.methods.dadosDono().call({
      from: userAccount.user
    })
    console.log(_dadosDono)
    setDadosDono(_dadosDono)
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!dadosDono) {
    return <h1>Carregando dados...</h1>
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          {userAccount.user}
        </div>
        <div className="card-body">
          <h5 className="card-title text-center">
            Taxa disponivel para saque: {dadosDono.totalValorTaxaDonoDisponivel} wei
          </h5>
          <div className="text-center">
            <button className="btn btn-success"
              onClick={actionSacarTaxa}>
              Sacar taxa
            </button>
          </div>

          <div>
            <h6 className="my-0">Valor do crédito por consorciado</h6>
            <small className="text-muted">{dadosDono.valorPremioPorConsorciado / 1000000000000000000} ether</small>
          </div>
          <div>
            <h6 className="my-0">Saldo disponivel para sorteio</h6>
            <small className="text-muted">{dadosDono.saldoSorteioDisponivel / 1000000000000000000} ether</small>
          </div>
          <div>
            <h6 className="my-0">Qtd de consorciados</h6>
            <small className="text-muted">
              {dadosDono.qtdTotalConsorciado}
            </small>
          </div>
          <div>
            <h6 className="my-0">Qtd de consorciados cadastrados</h6>
            <small className="text-muted">
              {dadosDono.qtdConsorciadoInscritos}
            </small>
          </div>
          <div>
            <h6 className="my-0">Qtd de sorteios realizados</h6>
            <small className="text-muted">
              {dadosDono.qtdSorteioRealizado}
            </small>
          </div>
          <div>
            <h6 className="my-0">Valor da taxa por parcela</h6>
            <small className="text-muted">
              {dadosDono.valorTaxaDonoPorParcela} wei
            </small>
          </div>
          <div className="text-center">
            <Sortear />
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
