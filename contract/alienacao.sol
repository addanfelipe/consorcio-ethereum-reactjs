pragma  solidity  ^0.4.25;

contract Alienacao{
    
    address[] enderecosAlienados;

    function liberarAlienacao(address enderecoContemplado) public{
        enderecosAlienados.push(enderecoContemplado);
    }
}