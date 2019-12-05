const abi = [
    {
        "constant": false,
        "inputs": [],
        "name": "isDono",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "isConsorciadoCadastrado",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "cadastrarConsorciado",
        "outputs": [
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "dadosConsorciado",
        "outputs": [
            {
                "name": "isConsorciadoContemplada",
                "type": "bool"
            },
            {
                "name": "qtdTotalParcela",
                "type": "uint256"
            },
            {
                "name": "valorAGanhar",
                "type": "uint256"
            },
            {
                "name": "valorDoPremio",
                "type": "uint256"
            },
            {
                "name": "qtdParcelaPendente",
                "type": "uint256"
            },
            {
                "name": "isMesAtualPago",
                "type": "bool"
            },
            {
                "name": "diaVencimentoPagamento",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "pagarParcela",
        "outputs": [
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    // Dono
    {
        "constant": false,
        "inputs": [],
        "name": "dadosDono",
        "outputs": [
            {
                "name": "qtdTotalParcela",
                "type": "uint256"
            },
            {
                "name": "saldoSorteioDisponivel",
                "type": "uint256"
            },
            {
                "name": "valorDoPremioPorConsorciado",
                "type": "uint256"
            },
            {
                "name": "valorTaxaDonoPorParcela",
                "type": "uint256"
            },
            {
                "name": "diaVencimentoPagamento",
                "type": "uint256"
            },
            {
                "name": "qtdTotalConsorciado",
                "type": "uint256"
            },
            {
                "name": "qtdSorteioRealizado",
                "type": "uint256"
            },
            {
                "name": "totalValorTaxaDonoDisponivel",
                "type": "uint256"
            },
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "sacarTaxaTotal",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "listaConsorciadoContemplado",
        "outputs": [
            {
                "name": "",
                "type": "address[]",
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
]

export default abi