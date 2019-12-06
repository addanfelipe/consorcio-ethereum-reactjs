pragma  solidity  ^0.4.25;

contract DateTime {
        function getDay(uint timestamp) public constant returns (uint8);
}

contract Alienacao {
    function liberarAlienacao(address enderecoContemplado) public;
}

contract Consorcio{
    
    Alienacao alienacao;
    address enderecoAlienecao; 
    DateTime dateTime = DateTime(0x691F48972e9317BD04f4BE2Fe84f5737a8Af8669);

    address dono;            // dono do contrato
    uint prazoComum;         // prazo comum para todos os consorciados
    uint saldoAtual;         // saldo atual do contrato
    uint creditoComum;       // credito comum para todos os consorciados
    uint taxaComum;          // taxa de administração do consorcio
    uint diaVencimento;      // dia vencimento das parcelas
    uint qntdParticipantes;  // quantidade necessária de participantes
    uint sorteiosRealizados; // quantidade de sorteios já realizados
    uint saldoTaxas;         // saldo taxas
    uint valorParcelaComum;
    
    struct Cota{
        uint prazo;              // prazo em meses das parcelas do consorciado
        uint valorContrado;      // valor contratado pelo consorciado
        uint valorPago;          // valor já pago pelo consorciado
        uint valorParcela;       // valor da parcela mensal 310000000000000000
        uint parcelasFaltantes;  // número de parcelas faltantes
        uint parcelasPagas;      // número de parcelas pagas
        bool cotaContemplada;    // booleano para saber se a cota já foi contemplada
        bool mesAtualPago;       // booleano para saber se a parcela já foi pago
    }

    mapping (address => Cota) cotas;
    address[] enderecoCotas;
    address[] cotasContempladas;
    mapping (uint => address) enderecosValidos;
 
    constructor() public{
        enderecoAlienecao = 0x9Ab36840516659083f41e9eF5b1E0Ba7977A6757;
        
        alienacao = Alienacao(enderecoAlienecao);
        dono = msg.sender;
        prazoComum = 1;
        creditoComum = 1 finney;
        taxaComum = uint(creditoComum*3/1000);
        diaVencimento = 6;
        qntdParticipantes = 2;
        sorteiosRealizados = 0;
        valorParcelaComum = (creditoComum/prazoComum)+taxaComum;
    }

    modifier onlyDono {
        require(msg.sender == dono, "You are not authorized");
        _;
    }

    // funcao que permite um endereco ethereum se cadastrar no consorcio    
    function cadastrarConsorciado() public {
        require(dono != msg.sender, "you are not authorized");
        require(enderecoCotas.length != qntdParticipantes, "O consorcio está lotado");

        enderecoCotas.push(msg.sender);

        cotas[msg.sender].prazo = prazoComum;
        cotas[msg.sender].valorContrado = creditoComum;
        cotas[msg.sender].valorPago = 0;
        cotas[msg.sender].parcelasFaltantes = prazoComum;
        cotas[msg.sender].valorParcela = valorParcelaComum;
        cotas[msg.sender].cotaContemplada = false;
        cotas[msg.sender].parcelasPagas = 0;
        
    }
    
    function isDono() public view returns (bool){
       if(msg.sender != dono){ return false; }else{ return true; }
    }
    
    function isConsorciadoCadastrado() public view returns (bool){
        if(cotas[msg.sender].prazo == 0){ return false; }else{ return true; }
    }
    
    function pagarParcela() payable public{
        require(cotas[msg.sender].prazo != 0, "Você não está cadastrado nesse consorcio");
        require(cotas[msg.sender].parcelasFaltantes != 0, "Você já quitou seu consorcio");
        require(msg.value == cotas[msg.sender].valorParcela, "Valor da parcela diferente do contratado");
        saldoAtual += msg.value-taxaComum;
        saldoTaxas += taxaComum;
        cotas[msg.sender].valorPago += msg.value;
        cotas[msg.sender].parcelasFaltantes -= 1;
        cotas[msg.sender].parcelasPagas += 1;
        cotas[msg.sender].mesAtualPago = true;
    }
    
    function dadosConsorciado() public view returns(bool, uint, uint, uint, uint, bool, uint){
        return (cotas[msg.sender].cotaContemplada, cotas[msg.sender].prazo, cotas[msg.sender].valorContrado, 
        cotas[msg.sender].valorParcela, cotas[msg.sender].parcelasFaltantes, cotas[msg.sender].mesAtualPago, diaVencimento);
    }
    
    function dadosDono() onlyDono view returns(uint, uint, uint, uint, uint, uint, uint, uint, uint, uint){
        return (prazoComum, saldoAtual, creditoComum, taxaComum, diaVencimento, qntdParticipantes, sorteiosRealizados, 
        saldoTaxas, enderecoCotas.length, diaVencimento);
    }
    
    function dadosConsorcio() public view returns (uint, uint, uint){
        return(creditoComum, valorParcelaComum, prazoComum);   
    }
    
    function sacarTaxaTotal() external onlyDono {
        msg.sender.transfer(saldoTaxas);
        saldoTaxas = 0;
    }
    
    function day() public view returns(uint8){
        return dateTime.getDay(now);
    }
    
    function contempla() public view returns(uint){
        return saldoAtual/creditoComum;
    }
    
    function sortear() external onlyDono {
        require(enderecoCotas.length == qntdParticipantes, "O consorcio ainda não atingiu a quantidade necessária de pessoas");
        require(saldoAtual >= creditoComum, "Não há saldo suficiente no consorcio");
        require(dateTime.getDay(now) == diaVencimento, "Ainda não é o dia do sorteio");
      
        uint qntdCotasValidas = 0;
        
        for(uint i = 0; i < enderecoCotas.length; i++){
            if(cotas[enderecoCotas[i]].parcelasPagas > sorteiosRealizados && !cotas[enderecoCotas[i]].cotaContemplada){
                enderecosValidos[i] = enderecoCotas[i];
                qntdCotasValidas += 1;
            }else if(cotas[enderecoCotas[i]].parcelasPagas <= sorteiosRealizados){
                cotas[enderecoCotas[i]].mesAtualPago = false;
            }
        }

        uint qntdContemplacoes = saldoAtual/creditoComum;
        
        for(i = 0; i < qntdContemplacoes; i++){
            
            uint random = uint(keccak256(abi.encodePacked(now, msg.sender))) % (qntdCotasValidas+1);
            
            if(!cotas[enderecosValidos[random]].cotaContemplada){
                cotas[enderecosValidos[random]].cotaContemplada = true;
                //enderecoAlienecao.transfer(creditoComum);
                saldoAtual -= creditoComum;
                //alienacao.liberarAlienacao(enderecosValidos[random]);
                cotasContempladas.push(enderecosValidos[random]);
            }
        }
        
    }
    
    function listaConsorciadoContemplado() public view returns(address[]){ 
        return cotasContempladas; 
    }
}