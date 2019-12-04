import React, { } from 'react';


const styles = {
  marginZero: { margin: '0' }
}


function App(props) {

  return (
    <>
      <div className="card">
        <div className="card-header">
          {props.userAccount.user}
        </div>
        <div className="card-body">
          <p className="card-text" style={{ ...styles.marginZero }}>Já foi contemplado: Sim</p>
          <p className="card-text" style={{ ...styles.marginZero }}>Quanto já foi pago: R$ 60,00</p>
          <p className="card-text" style={{ ...styles.marginZero }}>Quantos meses faltam: 75</p>
          <p className="card-text" style={{ ...styles.marginZero }}>Valor da parcela: R$ 20,00</p>
          <p className="card-text">Vencimento: 12/12/2019</p>
          <div className="text-center">
            <button className="btn btn-success">Pagar parcela</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
