// ========================================
// SimCity Minimalista (Cursor Edition)
// ========================================

// Constantes
const GRID_SIZE = 15;
const TIPOS = {
    VAZIO: 'VAZIO',
    R: 'R',           // Residencial
    C: 'C',           // Comercial
    I: 'I',           // Industrial
    ESTRADA: 'ESTRADA',
    POLICIA: 'POLICIA'
};

const CUSTOS = {
    R: 50,
    C: 75,
    I: 100,
    ESTRADA: 25,
    POLICIA: 200
};

// Estado do Jogo
const estado = {
    grade: [],
    tesouro: 1000,
    populacao: 0,
    empregos: 0,
    satisfacao: 50,
    ciclo: 0,
    acaoSelecionada: null
};

// ========================================
// Inicialização
// ========================================

function inicializarJogo() {
    // Inicializar grade 15x15 com células vazias
    estado.grade = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        estado.grade[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            estado.grade[i][j] = {
                tipo: TIPOS.VAZIO,
                populacao: 0,
                empregos: 0
            };
        }
    }
    
    renderizarGrade();
    atualizarInterface();
    configurarEventos();
}

// ========================================
// Renderização
// ========================================

function renderizarGrade() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const celula = document.createElement('div');
            celula.classList.add('cell');
            celula.classList.add(estado.grade[i][j].tipo);
            celula.dataset.row = i;
            celula.dataset.col = j;
            
            // Adicionar texto na célula (tipo ou população/empregos)
            const cell = estado.grade[i][j];
            if (cell.tipo === TIPOS.R && cell.populacao > 0) {
                celula.textContent = Math.floor(cell.populacao);
            } else if ((cell.tipo === TIPOS.C || cell.tipo === TIPOS.I) && cell.empregos > 0) {
                celula.textContent = Math.floor(cell.empregos);
            } else if (cell.tipo !== TIPOS.VAZIO && cell.tipo !== TIPOS.ESTRADA) {
                celula.textContent = cell.tipo;
            }
            
            celula.addEventListener('click', () => clicarCelula(i, j));
            gridElement.appendChild(celula);
        }
    }
}

function atualizarInterface() {
    document.getElementById('tesouro').textContent = Math.floor(estado.tesouro);
    document.getElementById('populacao').textContent = Math.floor(estado.populacao);
    document.getElementById('empregos').textContent = Math.floor(estado.empregos);
    document.getElementById('satisfacao').textContent = Math.floor(estado.satisfacao) + '%';
    document.getElementById('ciclo').textContent = estado.ciclo;
    
    // Atualizar texto da ação selecionada
    const acaoAtualElement = document.getElementById('acao-atual');
    if (estado.acaoSelecionada) {
        const nomes = {
            R: 'Zona Residencial',
            C: 'Zona Comercial',
            I: 'Zona Industrial',
            ESTRADA: 'Estrada',
            POLICIA: 'Polícia'
        };
        acaoAtualElement.textContent = nomes[estado.acaoSelecionada];
    } else {
        acaoAtualElement.textContent = 'Nenhuma';
    }
}

// ========================================
// Sistema de Cliques e Ações
// ========================================

function configurarEventos() {
    // Botões de ação
    document.getElementById('btn-residencial').addEventListener('click', () => selecionarAcao('R'));
    document.getElementById('btn-comercial').addEventListener('click', () => selecionarAcao('C'));
    document.getElementById('btn-industrial').addEventListener('click', () => selecionarAcao('I'));
    document.getElementById('btn-estrada').addEventListener('click', () => selecionarAcao('ESTRADA'));
    document.getElementById('btn-policia').addEventListener('click', () => selecionarAcao('POLICIA'));
    
    // Botão de avançar ciclo
    document.getElementById('btn-avancar').addEventListener('click', avancarCiclo);
}

function selecionarAcao(tipo) {
    estado.acaoSelecionada = tipo;
    
    // Remover classe active de todos os botões
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adicionar classe active ao botão selecionado
    const btnId = {
        R: 'btn-residencial',
        C: 'btn-comercial',
        I: 'btn-industrial',
        ESTRADA: 'btn-estrada',
        POLICIA: 'btn-policia'
    };
    document.getElementById(btnId[tipo]).classList.add('active');
    
    atualizarInterface();
}

function clicarCelula(row, col) {
    if (!estado.acaoSelecionada) {
        alert('Selecione uma ação primeiro!');
        return;
    }
    
    const celula = estado.grade[row][col];
    
    // Verificar se a célula está vazia
    if (celula.tipo !== TIPOS.VAZIO) {
        alert('Esta célula já está ocupada!');
        return;
    }
    
    // Verificar se há tesouro suficiente
    const custo = CUSTOS[estado.acaoSelecionada];
    if (estado.tesouro < custo) {
        alert('Tesouro insuficiente!');
        return;
    }
    
    // Construir/Zonear
    celula.tipo = estado.acaoSelecionada;
    estado.tesouro -= custo;
    
    // Resetar ação selecionada
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    estado.acaoSelecionada = null;
    
    renderizarGrade();
    atualizarInterface();
}

// ========================================
// Loop de Simulação
// ========================================

function avancarCiclo() {
    // 1. Incrementar Ciclo
    estado.ciclo++;
    
    // 2. Calcular Demanda RCI
    const demanda = calcularDemanda();
    
    // 3. Crescimento (População e Empregos)
    aplicarCrescimento(demanda);
    
    // 4. Calcular Satisfação
    calcularSatisfacao();
    
    // 5. Finanças
    aplicarFinancas();
    
    // 6. Atualizar Interface
    renderizarGrade();
    atualizarInterface();
}

function calcularDemanda() {
    const demanda = {
        R: false,
        C: false,
        I: false
    };
    
    // Demanda R: Alta se Empregos > População e Satisfação > 50%
    demanda.R = estado.empregos > estado.populacao && estado.satisfacao > 50;
    
    // Demanda C: Alta se População > Empregos
    demanda.C = estado.populacao > estado.empregos;
    
    // Demanda I: Alta se População > Empregos e Demanda C for alta
    demanda.I = estado.populacao > estado.empregos && demanda.C;
    
    return demanda;
}

function aplicarCrescimento(demanda) {
    let populacaoTotal = 0;
    let empregosTotal = 0;
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const celula = estado.grade[i][j];
            
            // Crescimento Residencial
            if (celula.tipo === TIPOS.R && demanda.R) {
                if (temEstradaAdjacente(i, j)) {
                    if (Math.random() < 0.1) { // 10% de chance
                        celula.populacao += 5;
                    }
                }
            }
            
            // Crescimento Comercial
            if (celula.tipo === TIPOS.C && demanda.C) {
                if (temEstradaAdjacente(i, j)) {
                    if (Math.random() < 0.1) { // 10% de chance
                        celula.empregos += 5;
                    }
                }
            }
            
            // Crescimento Industrial
            if (celula.tipo === TIPOS.I && demanda.I) {
                if (temEstradaAdjacente(i, j)) {
                    if (Math.random() < 0.1) { // 10% de chance
                        celula.empregos += 5;
                    }
                }
            }
            
            // Somar totais
            if (celula.tipo === TIPOS.R) {
                populacaoTotal += celula.populacao;
            }
            if (celula.tipo === TIPOS.C || celula.tipo === TIPOS.I) {
                empregosTotal += celula.empregos;
            }
        }
    }
    
    estado.populacao = populacaoTotal;
    estado.empregos = empregosTotal;
}

function temEstradaAdjacente(row, col) {
    const adjacentes = [
        [row - 1, col],     // Cima
        [row + 1, col],     // Baixo
        [row, col - 1],     // Esquerda
        [row, col + 1]      // Direita
    ];
    
    for (let [r, c] of adjacentes) {
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
            if (estado.grade[r][c].tipo === TIPOS.ESTRADA) {
                return true;
            }
        }
    }
    
    return false;
}

function calcularSatisfacao() {
    let satisfacao = 50; // Base
    
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const celula = estado.grade[i][j];
            
            // Bônus de Polícia (raio de 3)
            if (celula.tipo === TIPOS.POLICIA) {
                const celulasDentroRaio = contarCelulasDentroRaio(i, j, 3, TIPOS.R);
                satisfacao += celulasDentroRaio * 0.5; // 5% dividido pelas células no raio
            }
            
            // Punição de Indústria (raio de 3)
            if (celula.tipo === TIPOS.I) {
                const celulasDentroRaio = contarCelulasDentroRaio(i, j, 3, TIPOS.R);
                satisfacao -= celulasDentroRaio * 0.2; // 2% dividido pelas células no raio
            }
        }
    }
    
    // Limitar entre 0 e 100
    estado.satisfacao = Math.max(0, Math.min(100, satisfacao));
}

function contarCelulasDentroRaio(row, col, raio, tipo) {
    let count = 0;
    
    for (let i = -raio; i <= raio; i++) {
        for (let j = -raio; j <= raio; j++) {
            const r = row + i;
            const c = col + j;
            
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
                if (estado.grade[r][c].tipo === tipo) {
                    count++;
                }
            }
        }
    }
    
    return count;
}

function aplicarFinancas() {
    // Receita: População x 0.1 (10% de imposto)
    const receita = estado.populacao * 0.1;
    
    // Despesa: Número de SERVIÇOS (POLÍCIA) x 5
    let numServicos = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (estado.grade[i][j].tipo === TIPOS.POLICIA) {
                numServicos++;
            }
        }
    }
    const despesa = numServicos * 5;
    
    // Atualizar tesouro
    estado.tesouro = estado.tesouro + receita - despesa;
}

// ========================================
// Iniciar o Jogo
// ========================================

window.addEventListener('DOMContentLoaded', inicializarJogo);

