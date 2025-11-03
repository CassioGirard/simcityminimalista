# SimCity Minimalista (Cursor Edition)

Um jogo de simulação de construção de cidades minimalista, desenvolvido com HTML, CSS e JavaScript puros.

## 🎮 Como Jogar

1. Abra o arquivo `index.html` em seu navegador
2. Selecione uma ação no painel de controle (Zonar Residencial, Comercial, Industrial, Construir Estrada ou Polícia)
3. Clique em uma célula vazia da grade para construir
4. Clique em "Avançar Ciclo" para simular o crescimento da cidade

## 🏗️ Mecânicas do Jogo

### Zonas Disponíveis

- **Residencial (R)**: Onde os Sims vivem. Gera população.
- **Comercial (C)**: Onde os Sims trabalham. Gera empregos.
- **Industrial (I)**: Onde os Sims trabalham. Gera empregos.
- **Estrada**: Necessária para o crescimento. Células adjacentes a estradas têm 10% de chance de crescer a cada ciclo.
- **Polícia**: Aumenta a satisfação da população em um raio de 3 células.

### Custos

| Ação | Custo |
|------|-------|
| Zona Residencial | 50 |
| Zona Comercial | 75 |
| Zona Industrial | 100 |
| Estrada | 25 |
| Polícia | 200 |

### Sistema de Crescimento

A cada ciclo:
- **População**: Cresce se houver demanda (Empregos > População e Satisfação > 50%)
- **Empregos**: Crescem se houver demanda (População > Empregos)
- Apenas células adjacentes a estradas podem crescer
- 10% de chance de crescimento por célula elegível
- Crescimento adiciona +5 população/empregos por célula

### Finanças

- **Receita**: População × 0.1 (10% de imposto)
- **Despesa**: Número de Polícias × 5
- O tesouro é atualizado a cada ciclo

### Satisfação

- **Base**: 50%
- **Bônus**: +5% por Polícia (raio de 3 células)
- **Penalidade**: -2% por Indústria próxima a Residências (raio de 3 células)

## 📁 Estrutura do Projeto

```
simcityminimalista/
│
├── index.html      # Estrutura HTML e interface
├── style.css       # Estilização da grade e painel
├── script.js       # Lógica do jogo e simulação
└── README.md       # Este arquivo
```

## 🚀 Deploy no GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos (`index.html`, `style.css`, `script.js`)
3. Vá em Settings > Pages
4. Selecione a branch main/master como fonte
5. O jogo estará disponível em: `https://seu-usuario.github.io/nome-do-repositorio`

## 🎨 Design

O jogo usa um design minimalista com formas geométricas e cores:
- Grade de 15×15 células (225 células no total)
- Cada célula tem 30px × 30px
- Cores distintas para cada tipo de zona

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Sem dependências externas

## 📝 Regras de Demanda (RCI)

- **Demanda R (Residencial)**: Alta quando Empregos > População e Satisfação > 50%
- **Demanda C (Comercial)**: Alta quando População > Empregos Comerciais
- **Demanda I (Industrial)**: Alta quando População > Empregos Industriais e Demanda C está alta

## 💡 Dicas

1. Sempre construa estradas primeiro - elas são essenciais para o crescimento
2. Equilibre zonas residenciais com comerciais/industriais
3. Construa polícias próximas a áreas residenciais para aumentar a satisfação
4. Mantenha indústrias longe de áreas residenciais para evitar queda na satisfação
5. Monitore seu tesouro - o crescimento gera receita através de impostos

## 🎯 Objetivo

Construir uma cidade próspera, equilibrando crescimento populacional, emprego, satisfação e finanças!

---

Desenvolvido como parte do projeto SimCity Minimalista (Cursor Edition)

