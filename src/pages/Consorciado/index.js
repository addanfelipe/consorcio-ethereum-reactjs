import React, { } from 'react';


const styles = {
  marginZero: { margin: '0' }
}


function App(props) {

  // const { contrato } = props


  return (
    <>
      <div className="card">
        <div className="card-header">
          {props.userAccount.user}
        </div>
        <div className="card-body">
          <h5 className="card-title">Valor do crédito: 800 ether</h5>
          <p className="card-text" style={{ ...styles.marginZero }}>Já foi contemplado: Sim</p>
          <p className="card-text" style={{ ...styles.marginZero }}>Quanto já foi pago: 60 wei</p>
          <p className="card-text" style={{ ...styles.marginZero }}>Quantos meses faltam: 75</p>
          <p className="card-text" style={{ ...styles.marginZero }}>Valor da parcela: 20 wei</p>
          <p className="card-text" style={{ ...styles.marginZero }}></p>
          <p className="card-text">Vencimento: dia 12</p>
          <div className="text-center">
            <button className="btn btn-success">Pagar parcela</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
