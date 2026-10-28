/* Mundos de decisão (if, if/else, elif, lógica) e coleções (listas, tuplos, conjuntos, dicionários). */
(function (root) {
  var T = root.TH.T, L = root.TH.L;
  var W = root.TRILHO_WORLDS;

  // ================================================================ DECISÕES
  W.push({
    id: "if",
    title: "Decisões: if",
    subtitle: "Só faz se a condição for verdadeira",
    theory: T(
      "Até aqui o programa executava todas as linhas. Com `if` o programa passa a **decidir**: o bloco só é executado se a condição for verdadeira.",
      "```\nif nota >= 10:\n    print('Positiva')\n```",
      "Três regras: a condição termina com dois pontos `:`; as linhas do bloco ficam **indentadas** (4 espaços, ou a tecla Tab); e a primeira linha sem indentação já está fora do `if`.",
      "Se a condição for falsa, o bloco é simplesmente ignorado."
    ),
    exercises: [
      {
        type: "predict", title: "Entra ou não entra?", prompt: "O que aparece no ecrã?",
        code: "nota = 12\nif nota >= 10:\n    print('Positiva')\nprint('Fim')",
        options: ["Positiva\nFim", "Fim", "Positiva", "Dá erro"], answer: 0,
        explain: "12 >= 10 é verdadeiro, por isso o bloco executa. O `print('Fim')` não está indentado, logo executa sempre.",
        hints: ["Qual é o valor da condição `nota >= 10`? Que linhas estão dentro do `if`?"],
      },
      {
        type: "parsons", title: "Ordena e indenta",
        prompt: "Ordena as linhas. A indentação já está certa: repara que a linha dentro do `if` está mais à direita.",
        parsons: "temperatura = 31\nif temperatura > 30:\n    print('Está calor')\nprint('Fim')",
        tests: [{ expected: "Está calor\nFim" }],
        hints: ["A variável tem de existir antes do `if` que a usa."],
        explain: "A indentação mostra que linhas pertencem ao `if`.",
      },
      {
        type: "code", title: "Maior de idade",
        prompt: "Pergunta a idade. Se for 18 ou mais, mostra `Maior de idade`. Se não for, o programa não mostra nada.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "idade = int(input('Idade? '))\nif idade >= 18:\n    print('Maior de idade')",
        tests: [
          { inputs: ["20"], expected: "Maior de idade" },
          { inputs: ["15"], expected: "" },
          { inputs: ["18"], expected: "Maior de idade", hidden: true },
        ],
        requires: ["input", "int", "if"],
        hints: ["Não te esqueças dos dois pontos e da indentação."],
        explain: "Combinaste `input()`, conversão e `if`.",
      },
      {
        type: "debug", title: "Igual a quê?",
        prompt: "Este programa devia mostrar `Ok`, mas dá erro. Corrige-o.",
        starter: "resposta = 'sim'\nif resposta = 'sim':\n    print('Ok')",
        solution: "resposta = 'sim'\nif resposta == 'sim':\n    print('Ok')",
        tests: [{ expected: "Ok" }],
        hints: ["`=` guarda um valor; para comparar usa `==`."],
        explain: "Confundir `=` com `==` é um dos erros mais frequentes.",
      },
      {
        type: "trace", title: "Quadro de traçagem: if",
        prompt: "Segue o programa passo a passo. Na coluna da condição escreve `True` ou `False` quando a linha é um `if`, e `-` nas restantes.",
        code: "x = 8\nif x > 5:\n    x = x * 2\nif x > 10:\n    x = x - 3\nprint(x)",
        columns: ["Linha executada", "Condição", "x"],
        rows: [
          ["1", "-", "8"],
          ["2", ["True"], "8"],
          ["3", "-", ["16"]],
          ["4", ["True"], "16"],
          ["5", "-", ["13"]],
        ],
        finalOutput: { label: "O que mostra a linha 6?", answer: ["13"] },
        hints: ["O segundo `if` usa o valor de `x` depois de o primeiro bloco ter executado."],
        explain: "O valor de `x` mudou dentro do primeiro `if`, e isso afetou a condição do segundo.",
      },
    ],
  });

  W.push({
    id: "ifelse",
    title: "Decisões: if e else",
    subtitle: "Dois caminhos possíveis",
    theory: T(
      "Com `else` dizes o que fazer quando a condição é falsa. Executa-se **um** dos dois blocos, nunca os dois.",
      "```\nif idade >= 18:\n    print('Pode votar')\nelse:\n    print('Ainda não pode votar')\n```",
      "O `else` não tem condição: alinha-se com o `if` e também termina com `:`."
    ),
    exercises: [
      {
        type: "predict", title: "Qual dos caminhos?", prompt: "O que aparece no ecrã?",
        code: "idade = 15\nif idade >= 18:\n    print('Pode votar')\nelse:\n    print('Ainda não pode votar')\nprint('Obrigado')",
        options: ["Ainda não pode votar\nObrigado", "Pode votar\nObrigado", "Pode votar\nAinda não pode votar\nObrigado", "Obrigado"],
        answer: 0, explain: "A condição é falsa, por isso executa o `else`. A última linha está fora e executa sempre.",
        hints: ["15 >= 18 é verdadeiro ou falso?"],
      },
      {
        type: "code", title: "Par ou ímpar",
        prompt: "Pergunta um número inteiro e mostra `par` se for par ou `ímpar` se for ímpar.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "n = int(input('Número? '))\nif n % 2 == 0:\n    print('par')\nelse:\n    print('ímpar')",
        tests: [
          { inputs: ["8"], expected: "par" },
          { inputs: ["7"], expected: "ímpar" },
          { inputs: ["0"], expected: "par", hidden: true },
          { inputs: ["13"], expected: "ímpar", hidden: true },
        ],
        requires: ["input", "int", "if", "else", "mod"],
        hints: ["Um número é par quando o resto da divisão por 2 é 0."],
        explain: "O operador `%` é a ferramenta certa para testar divisibilidade.",
      },
      {
        type: "debug", title: "Dois erros de sintaxe",
        prompt: "Este programa devia mostrar `Negativa`. Corrige-o.",
        starter: "nota = 8\nif nota >= 10\nprint('Positiva')\nelse:\nprint('Negativa')",
        solution: "nota = 8\nif nota >= 10:\n    print('Positiva')\nelse:\n    print('Negativa')",
        tests: [{ expected: "Negativa" }],
        hints: ["Falta algo no fim da linha do `if`.", "As linhas dentro de cada bloco têm de estar indentadas."],
        explain: "Dois pontos e indentação: as duas coisas que mais esquecemos.",
      },
      {
        type: "code", title: "Palavra-passe",
        prompt: "Pergunta a palavra-passe. Se for exatamente `python123`, mostra `Acesso permitido`; caso contrário mostra `Acesso negado`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "senha = input('Palavra-passe? ')\nif senha == 'python123':\n    print('Acesso permitido')\nelse:\n    print('Acesso negado')",
        tests: [
          { inputs: ["python123"], expected: "Acesso permitido" },
          { inputs: ["Python123"], expected: "Acesso negado" },
          { inputs: ["abc"], expected: "Acesso negado", hidden: true },
        ],
        requires: ["input", "if", "else"],
        hints: ["Usa `==` para comparar textos. Maiúsculas e minúsculas contam."],
        explain: "Comparar textos exige igualdade exata, incluindo maiúsculas.",
      },
    ],
  });

  W.push({
    id: "elif",
    title: "Decisões: elif",
    subtitle: "Mais do que dois caminhos",
    theory: T(
      "Quando há mais de duas hipóteses, usa `elif` (\"senão se\"). O Python testa as condições **de cima para baixo** e executa só o bloco da primeira que for verdadeira. As restantes nem chegam a ser testadas.",
      "```\nif nota >= 18:\n    print('Excelente')\nelif nota >= 14:\n    print('Bom')\nelse:\n    print('A melhorar')\n```",
      "Por isso a **ordem** das condições importa. Podes ter quantos `elif` quiseres; o `else` final é opcional."
    ),
    exercises: [
      {
        type: "predict", title: "Que hora é?", prompt: "O que aparece no ecrã?",
        code: "hora = 15\nif hora < 12:\n    print('Bom dia')\nelif hora < 20:\n    print('Boa tarde')\nelse:\n    print('Boa noite')",
        options: ["Boa tarde", "Bom dia\nBoa tarde", "Boa tarde\nBoa noite", "Boa noite"], answer: 0,
        explain: "15 < 12 é falso; 15 < 20 é verdadeiro, por isso mostra 'Boa tarde' e o resto é ignorado.",
        hints: ["Testa as condições por ordem e pára na primeira verdadeira."],
      },
      {
        type: "trace", title: "Quadro de traçagem: elif",
        prompt: "Para cada condição escreve `True` ou `False`. Se o Python nunca chega a testar essa condição, escreve `-`. No fim indica o valor de `nivel`.",
        code: "nota = 16\nif nota >= 18:\n    nivel = 'excelente'\nelif nota >= 14:\n    nivel = 'bom'\nelif nota >= 10:\n    nivel = 'suficiente'\nelse:\n    nivel = 'insuficiente'\nprint(nivel)",
        columns: ["Condição", "Resultado"],
        rows: [
          ["nota >= 18", ["False"]],
          ["nota >= 14", ["True"]],
          ["nota >= 10", ["-"]],
          ["Valor final de nivel", ["bom"]],
        ],
        hints: ["Depois de uma condição verdadeira, as seguintes já não são testadas."],
        explain: "A terceira condição nunca é avaliada, porque a segunda já foi verdadeira.",
      },
      {
        type: "parsons", title: "Ordena e indenta",
        prompt: "Ordena as linhas para classificar a temperatura. A indentação já está certa.",
        parsons: "tempo = 22\nif tempo < 10:\n    print('Frio')\nelif tempo < 25:\n    print('Ameno')\nelse:\n    print('Quente')",
        tests: [{ expected: "Ameno" }],
        hints: ["Um `elif` vem sempre depois de um `if` e antes do `else`."],
        explain: "A estrutura é sempre if, depois elif (quantos quiseres), e por fim else.",
      },
      {
        type: "code", title: "Nível da nota",
        prompt: T(
          "Pergunta uma nota (0 a 20) e mostra o nível:",
          L("menos de 10: `Insuficiente`", "de 10 a 13: `Suficiente`", "de 14 a 17: `Bom`", "18 ou mais: `Muito bom`")
        ),
        starter: "# Escreve aqui o teu programa\n",
        solution: "nota = int(input('Nota? '))\nif nota < 10:\n    print('Insuficiente')\nelif nota < 14:\n    print('Suficiente')\nelif nota < 18:\n    print('Bom')\nelse:\n    print('Muito bom')",
        tests: [
          { inputs: ["5"], expected: "Insuficiente" },
          { inputs: ["12"], expected: "Suficiente" },
          { inputs: ["15"], expected: "Bom" },
          { inputs: ["19"], expected: "Muito bom" },
          { inputs: ["10"], expected: "Suficiente", hidden: true },
          { inputs: ["14"], expected: "Bom", hidden: true },
          { inputs: ["18"], expected: "Muito bom", hidden: true },
        ],
        requires: ["input", "int", "if", "elif", "else"],
        hints: ["Começa pelo caso mais pequeno e vai subindo. Cada `elif` só é testado se os anteriores falharam."],
        explain: "Como as condições são testadas por ordem, basta usar um limite em cada passo.",
      },
    ],
  });

  W.push({
    id: "logica",
    title: "Decisões avançadas",
    subtitle: "and, or, if dentro de if e if numa linha",
    theory: T(
      "Podes combinar condições com `and` e `or` numa só linha do `if`.",
      "Também podes pôr um `if` **dentro** de outro (decisões aninhadas): o segundo só é testado se o primeiro for verdadeiro. Repara que a indentação aumenta.",
      "Por fim, o **if numa linha** (expressão condicional) escolhe um valor: `texto = 'par' if n % 2 == 0 else 'ímpar'`."
    ),
    exercises: [
      {
        type: "predict", title: "and e or", prompt: "O que aparece no ecrã?",
        code: "idade = 70\nbilhete = 'normal'\nif idade < 12 or idade >= 65:\n    bilhete = 'reduzido'\nif idade >= 18 and bilhete == 'normal':\n    print('Preço total')\nelse:\n    print('Preço especial')",
        options: ["Preço especial", "Preço total", "Preço total\nPreço especial", "Dá erro"], answer: 0,
        explain: "70 >= 65 torna a primeira condição verdadeira, logo bilhete passa a 'reduzido'. A segunda exige 'normal', por isso vai para o else.",
        hints: ["Primeiro descobre o valor final de `bilhete`."],
      },
      {
        type: "code", title: "Bilhete",
        prompt: "Pergunta a idade. Quem tem menos de 12 anos ou 65 ou mais paga `Bilhete reduzido`; os restantes pagam `Bilhete normal`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "idade = int(input('Idade? '))\nif idade < 12 or idade >= 65:\n    print('Bilhete reduzido')\nelse:\n    print('Bilhete normal')",
        tests: [
          { inputs: ["8"], expected: "Bilhete reduzido" },
          { inputs: ["70"], expected: "Bilhete reduzido" },
          { inputs: ["30"], expected: "Bilhete normal" },
          { inputs: ["12"], expected: "Bilhete normal", hidden: true },
          { inputs: ["65"], expected: "Bilhete reduzido", hidden: true },
        ],
        requires: ["input", "int", "if", "else", "or"],
        hints: ["Escreve as duas condições completas, uma de cada lado do `or`."],
        explain: "Com `or` basta uma das condições ser verdadeira.",
      },
      {
        type: "code", title: "Condução",
        prompt: T(
          "Pergunta a idade e depois pergunta se tem carta (`sim` ou `não`). Usa um `if` dentro de outro:",
          L("menos de 18 anos: `Menor de idade`", "18 ou mais com carta: `Pode conduzir`", "18 ou mais sem carta: `Falta a carta`")
        ),
        starter: "# Escreve aqui o teu programa\n",
        solution: "idade = int(input('Idade? '))\ncarta = input('Tem carta? ')\nif idade >= 18:\n    if carta == 'sim':\n        print('Pode conduzir')\n    else:\n        print('Falta a carta')\nelse:\n    print('Menor de idade')",
        tests: [
          { inputs: ["20", "sim"], expected: "Pode conduzir" },
          { inputs: ["20", "não"], expected: "Falta a carta" },
          { inputs: ["16", "sim"], expected: "Menor de idade" },
          { inputs: ["16", "não"], expected: "Menor de idade", hidden: true },
        ],
        requires: ["input", "int", "if", "else", "nested_if"],
        hints: ["Dentro do primeiro `if` (maior de idade) precisas de outra decisão."],
        explain: "A decisão sobre a carta só faz sentido para quem já é maior de idade.",
      },
      {
        type: "code", title: "If numa linha",
        prompt: "Pergunta um número inteiro e mostra `positivo` se for maior que 0 ou `não positivo` caso contrário. Usa o if numa linha dentro do `print()`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "n = int(input('Número? '))\nprint('positivo' if n > 0 else 'não positivo')",
        tests: [
          { inputs: ["5"], expected: "positivo" },
          { inputs: ["-2"], expected: "não positivo" },
          { inputs: ["0"], expected: "não positivo", hidden: true },
        ],
        requires: ["input", "int", "ifexp"],
        hints: ["A forma é `valor1 if condição else valor2`."],
        explain: "É um atalho para decisões simples que só escolhem um valor.",
      },
    ],
  });

  // ================================================================ LISTAS
  W.push({
    id: "listas",
    title: "Listas",
    subtitle: "Várias coisas numa só variável",
    theory: T(
      "Uma **lista** guarda vários valores, entre parênteses retos: `frutas = ['maçã', 'pera', 'uva']`.",
      "Cada elemento tem uma **posição** (índice) e a contagem começa em **0**. `frutas[0]` é o primeiro, `frutas[-1]` é o último. Pedir uma posição que não existe dá `IndexError`.",
      "Podes alterar listas: `frutas[1] = 'kiwi'` substitui; `append(x)` junta no fim; `insert(i, x)` põe na posição `i`; `remove(x)` retira o valor `x`. `len()` diz quantos elementos existem e `in` verifica se um valor lá está."
    ),
    exercises: [
      {
        type: "predict", title: "Posições", prompt: "O que aparece no ecrã?",
        code: "frutas = ['maçã', 'pera', 'uva', 'kiwi']\nprint(frutas[0])\nprint(frutas[-1])\nprint(frutas[2])\nprint(len(frutas))",
        options: ["maçã\nkiwi\nuva\n4", "pera\nkiwi\nuva\n4", "maçã\nkiwi\npera\n3", "maçã\nuva\nuva\n4"], answer: 0,
        explain: "Índice 0 é o primeiro, -1 é o último e o índice 2 é o terceiro elemento.",
        hints: ["Escreve os índices por baixo de cada fruta: 0, 1, 2, 3."],
      },
      {
        type: "code", title: "Primeiro e último",
        prompt: "Mostra o primeiro e o último elemento da lista, cada um na sua linha.",
        starter: "notas = [14, 9, 17, 12, 19]\n# Escreve aqui o resto do programa\n",
        solution: "notas = [14, 9, 17, 12, 19]\nprint(notas[0])\nprint(notas[-1])",
        tests: [{ expected: "14\n19" }],
        requires: ["index"],
        checkVars: [{ name: "notas", value: "[14, 9, 17, 12, 19]" }],
        hints: ["O último pode ser `notas[-1]`."],
        explain: "Os índices negativos contam a partir do fim.",
      },
      {
        type: "predict", title: "Alterar a lista", prompt: "O que aparece no ecrã?",
        code: "l = [3, 1, 2]\nl.append(5)\nl.insert(0, 9)\nl.remove(1)\nprint(l)\nprint(len(l))",
        options: ["[9, 3, 2, 5]\n4", "[9, 3, 1, 2, 5]\n5", "[3, 2, 5]\n3", "[9, 3, 2, 5]\n5"], answer: 0,
        explain: "[3,1,2] → [3,1,2,5] → [9,3,1,2,5] → remove o 1 → [9,3,2,5].",
        hints: ["Escreve a lista depois de cada linha."],
      },
      {
        type: "trace", title: "Quadro de traçagem: lista",
        prompt: "Regista o conteúdo da lista e o seu tamanho depois de cada linha.",
        code: "l = [2, 4]\nl.append(6)\nl[0] = 1\nl.insert(1, 3)\nl.remove(4)",
        columns: ["Depois da linha", "l", "len(l)"],
        rows: [
          ["1", "[2, 4]", "2"],
          ["2", ["[2, 4, 6]"], ["3"]],
          ["3", ["[1, 4, 6]"], ["3"]],
          ["4", ["[1, 3, 4, 6]"], ["4"]],
          ["5", ["[1, 3, 6]"], ["3"]],
        ],
        hints: ["`insert(1, 3)` põe o 3 na posição 1 e empurra os restantes."],
        explain: "Cada método altera a mesma lista, por isso o estado vai-se acumulando.",
      },
      {
        type: "code", title: "Três nomes",
        prompt: "Cria uma lista vazia, pergunta três nomes (um de cada vez) e junta cada um à lista com `append`. No fim mostra a lista.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "nomes = []\nnomes.append(input('Nome 1? '))\nnomes.append(input('Nome 2? '))\nnomes.append(input('Nome 3? '))\nprint(nomes)",
        tests: [
          { inputs: ["Ana", "Rui", "Eva"], expected: "['Ana', 'Rui', 'Eva']" },
          { inputs: ["X", "Y", "Z"], expected: "['X', 'Y', 'Z']", hidden: true },
        ],
        requires: ["input", "append"],
        hints: ["Podes pôr o `input()` dentro do `append()`."],
        explain: "É o início do padrão \"recolher dados numa lista\".",
      },
      {
        type: "code", title: "Substituir e remover",
        prompt: "Substitui o segundo elemento por `25`, remove o valor `40` e mostra a lista.",
        starter: "valores = [10, 20, 30, 40]\n# Escreve aqui o resto do programa\n",
        solution: "valores = [10, 20, 30, 40]\nvalores[1] = 25\nvalores.remove(40)\nprint(valores)",
        tests: [{ expected: "[10, 25, 30]" }],
        requires: ["remove"],
        hints: ["O segundo elemento está no índice 1."],
        explain: "Lembra-te: `remove` recebe o valor, não a posição.",
      },
      {
        type: "parsons", title: "Ordena as linhas",
        prompt: "Ordena as linhas para criar uma lista de tarefas, juntar duas, remover uma e mostrar o resultado.",
        parsons: "tarefas = []\ntarefas.append('estudar')\ntarefas.append('treinar')\ntarefas.remove('estudar')\nprint(tarefas)",
        tests: [{ expected: "['treinar']" }],
        hints: ["Só podes remover algo que já tenha sido adicionado."],
        explain: "A lista tem de existir e ter o elemento antes do `remove`.",
      },
      {
        type: "code", title: "Lista de convidados",
        prompt: "Pergunta um nome. Se estiver na lista de convidados mostra `Convidado`, senão mostra `Não convidado`.",
        starter: "convidados = ['Ana', 'Rui', 'Eva']\n# Escreve aqui o resto do programa\n",
        solution: "convidados = ['Ana', 'Rui', 'Eva']\nnome = input('Nome? ')\nif nome in convidados:\n    print('Convidado')\nelse:\n    print('Não convidado')",
        tests: [
          { inputs: ["Rui"], expected: "Convidado" },
          { inputs: ["Carlos"], expected: "Não convidado" },
          { inputs: ["rui"], expected: "Não convidado", hidden: true },
        ],
        requires: ["input", "in", "if"],
        hints: ["`nome in convidados` já dá `True` ou `False`."],
        explain: "Juntaste `input`, lista e decisão.",
      },
      {
        type: "debug", title: "Dois erros",
        prompt: "Este programa devia mostrar `rosa` e depois a lista com a cor `preto` no fim. Corrige-o.",
        starter: "cores = ['verde', 'azul', 'rosa']\nprint(cores[3])\ncores.add('preto')\nprint(cores)",
        solution: "cores = ['verde', 'azul', 'rosa']\nprint(cores[2])\ncores.append('preto')\nprint(cores)",
        tests: [{ expected: "rosa\n['verde', 'azul', 'rosa', 'preto']" }],
        hints: ["Uma lista com 3 elementos tem índices 0, 1 e 2.", "O método para juntar no fim chama-se `append`."],
        explain: "`IndexError` aparece quando pedes uma posição que não existe.",
      },
    ],
  });

  // ================================================================ TUPLOS
  W.push({
    id: "tuplos",
    title: "Tuplos",
    subtitle: "Listas que não mudam",
    theory: T(
      "Um **tuplo** parece uma lista, mas usa parênteses curvos e **não pode ser alterado**: `dias = ('seg', 'ter', 'qua')`.",
      "Podes consultar por índice, usar `len()` e `in`, e usar os métodos `count(x)` (quantas vezes aparece) e `index(x)` (em que posição está). Tentar alterar um elemento dá `TypeError`."
    ),
    exercises: [
      {
        type: "predict", title: "Consultar um tuplo", prompt: "O que aparece no ecrã?",
        code: "t = (5, 3, 9, 3)\nprint(t[0])\nprint(len(t))\nprint(t.count(3))\nprint(t.index(9))",
        options: ["5\n4\n2\n2", "5\n4\n2\n3", "3\n4\n2\n2", "5\n3\n2\n2"], answer: 0,
        explain: "O 3 aparece 2 vezes e o 9 está no índice 2.",
        hints: ["Escreve os índices por baixo: 0, 1, 2, 3."],
      },
      {
        type: "recreate", title: "Recria de memória",
        prompt: "Estuda o programa, esconde-o e escreve-o de memória.",
        code: "dias = ('seg', 'ter', 'qua')\nprint(dias[0])\nprint(len(dias))\nprint('qua' in dias)",
        tests: [{ expected: "seg\n3\nTrue" }],
        hints: ["O tuplo usa parênteses curvos."],
        explain: "Quase tudo o que sabes das listas serve para consultar tuplos.",
      },
      {
        type: "debug", title: "Não se pode alterar",
        prompt: "Este programa dá erro porque os tuplos não podem ser alterados. Corrige-o para mostrar `(7, 5)`, sem mexer na primeira linha.",
        starter: "coords = (2, 5)\ncoords[0] = 7\nprint(coords)",
        solution: "coords = (2, 5)\ncoords = (7, coords[1])\nprint(coords)",
        tests: [{ expected: "(7, 5)" }],
        hints: ["Em vez de alterar um elemento, cria um tuplo novo."],
        explain: "Para \"alterar\" um tuplo, cria-se outro e guarda-se na variável.",
      },
      {
        type: "code", title: "Semáforo",
        prompt: "Pergunta uma cor. Se for uma das cores do tuplo `semaforo`, mostra `Cor válida`, senão mostra `Cor inválida`.",
        starter: "semaforo = ('verde', 'amarelo', 'vermelho')\n# Escreve aqui o resto do programa\n",
        solution: "semaforo = ('verde', 'amarelo', 'vermelho')\ncor = input('Cor? ')\nif cor in semaforo:\n    print('Cor válida')\nelse:\n    print('Cor inválida')",
        tests: [
          { inputs: ["verde"], expected: "Cor válida" },
          { inputs: ["azul"], expected: "Cor inválida" },
          { inputs: ["vermelho"], expected: "Cor válida", hidden: true },
        ],
        requires: ["input", "in", "if", "else"],
        hints: ["Funciona como com as listas."],
        explain: "O `in` funciona em listas, tuplos e outras coleções.",
      },
    ],
  });

  // ================================================================ CONJUNTOS
  W.push({
    id: "conjuntos",
    title: "Conjuntos",
    subtitle: "Sem repetidos",
    theory: T(
      "Um **conjunto** (`set`) guarda valores **sem repetições** e **sem ordem**, por isso não tem índices. Cria-se com chavetas, `{1, 2, 3}`, ou com `set()` (um conjunto vazio nunca se escreve `{}`).",
      "Usa `add(x)` para juntar e `remove(x)` para retirar. `len()` e `in` funcionam como nas listas.",
      "Truque útil: `set(lista)` elimina os repetidos de uma lista."
    ),
    exercises: [
      {
        type: "predict", title: "Repetidos desaparecem", prompt: "O que aparece no ecrã?",
        code: "s = {1, 2, 2, 3}\nprint(len(s))\ns.add(3)\ns.add(4)\nprint(len(s))\nprint(2 in s)",
        options: ["3\n4\nTrue", "4\n5\nTrue", "3\n5\nTrue", "3\n4\nFalse"], answer: 0,
        explain: "{1, 2, 2, 3} tem 3 elementos diferentes. Juntar o 3 não muda nada; juntar o 4 faz subir para 4.",
        hints: ["Num conjunto cada valor só conta uma vez."],
      },
      {
        type: "code", title: "Quantos diferentes?",
        prompt: "Mostra quantos valores **diferentes** existem na lista.",
        starter: "idades = [15, 16, 15, 17, 16, 15]\n# Escreve aqui o resto do programa\n",
        solution: "idades = [15, 16, 15, 17, 16, 15]\nprint(len(set(idades)))",
        tests: [{ expected: "3" }],
        requires: ["set", "len"],
        hints: ["Converte a lista num conjunto e conta."],
        explain: "Converter para `set` é a forma mais rápida de eliminar repetidos.",
      },
      {
        type: "parsons", title: "Ordena as linhas",
        prompt: "Ordena as linhas para criar um conjunto vazio, juntar três nomes (um repetido) e mostrar quantos nomes diferentes existem.",
        parsons: "amigos = set()\namigos.add('Ana')\namigos.add('Rui')\namigos.add('Ana')\nprint(len(amigos))",
        tests: [{ expected: "2" }],
        hints: ["Primeiro cria o conjunto, depois junta, por fim conta."],
        explain: "O segundo 'Ana' não aumenta o conjunto.",
      },
      {
        type: "code", title: "Palavras diferentes",
        prompt: "Pergunta três palavras (uma de cada vez), guarda-as num conjunto e mostra quantas palavras diferentes foram escritas.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "palavras = set()\npalavras.add(input('Palavra 1? '))\npalavras.add(input('Palavra 2? '))\npalavras.add(input('Palavra 3? '))\nprint(len(palavras))",
        tests: [
          { inputs: ["sol", "mar", "sol"], expected: "2" },
          { inputs: ["a", "b", "c"], expected: "3", hidden: true },
          { inputs: ["x", "x", "x"], expected: "1", hidden: true },
        ],
        requires: ["input", "add", "set"],
        hints: ["Começa com `set()` para criar o conjunto vazio."],
        explain: "Assim contas valores únicos sem escreveres nenhuma comparação.",
      },
    ],
  });

  // ================================================================ DICIONÁRIOS
  W.push({
    id: "dicionarios",
    title: "Dicionários",
    subtitle: "Pares chave e valor",
    theory: T(
      "Um **dicionário** guarda pares **chave: valor**, entre chavetas: `aluno = {'nome': 'Rita', 'idade': 16}`.",
      "Consulta-se pela chave, não pela posição: `aluno['nome']`. Para alterar ou juntar usa a mesma forma: `aluno['idade'] = 17` (se a chave existe, muda; se não existe, é criada). `pop(chave)` retira um par. Pedir uma chave inexistente dá `KeyError`.",
      "`len()` conta os pares e `in` verifica se uma **chave** existe."
    ),
    exercises: [
      {
        type: "predict", title: "Chaves e valores", prompt: "O que aparece no ecrã?",
        code: "d = {'nome': 'Rita', 'idade': 16}\nprint(d['nome'])\nd['idade'] = 17\nprint(d['idade'])\nprint(len(d))\nprint('turma' in d)",
        options: ["Rita\n17\n2\nFalse", "Rita\n16\n2\nFalse", "Rita\n17\n3\nFalse", "nome\n17\n2\nTrue"], answer: 0,
        explain: "Atribuir a uma chave existente substitui o valor, sem criar um par novo. 'turma' não é uma chave.",
        hints: ["O `in` olha para as chaves."],
      },
      {
        type: "code", title: "Preço de um produto",
        prompt: "Pergunta o nome de um produto e mostra o seu preço, consultando o dicionário.",
        starter: "precos = {'sandes': 2.5, 'sumo': 1.2, 'bolo': 1.8}\n# Escreve aqui o resto do programa\n",
        solution: "precos = {'sandes': 2.5, 'sumo': 1.2, 'bolo': 1.8}\nproduto = input('Produto? ')\nprint(precos[produto])",
        tests: [
          { inputs: ["sumo"], expected: "1.2" },
          { inputs: ["bolo"], expected: "1.8", hidden: true },
          { inputs: ["sandes"], expected: "2.5", hidden: true },
        ],
        requires: ["input", "index"],
        hints: ["Usa o texto escrito como chave dentro dos parênteses retos."],
        explain: "A chave pode ser uma variável.",
      },
      {
        type: "trace", title: "Quadro de traçagem: dicionário",
        prompt: "Regista o tamanho do dicionário e o valor de cada chave depois de cada linha. Escreve `-` se a chave não existe.",
        code: "d = {}\nd['a'] = 1\nd['b'] = 2\nd['a'] = d['a'] + 5\nd.pop('b')",
        columns: ["Depois da linha", "len(d)", "d['a']", "d['b']"],
        rows: [
          ["1", "0", "-", "-"],
          ["2", ["1"], ["1"], ["-"]],
          ["3", ["2"], ["1"], ["2"]],
          ["4", ["2"], ["6"], ["2"]],
          ["5", ["1"], ["6"], ["-"]],
        ],
        hints: ["Na linha 4 o novo valor de 'a' é o valor antigo mais 5."],
        explain: "Atribuir a uma chave existente substitui; a chave nova cria um par.",
      },
      {
        type: "code", title: "Atualizar o stock",
        prompt: "No dicionário `stock`: muda a quantidade de `maçã` para 8, junta `uva` com 2 e retira `pera`. Mostra o dicionário.",
        starter: "stock = {'maçã': 5, 'pera': 3}\n# Escreve aqui o resto do programa\n",
        solution: "stock = {'maçã': 5, 'pera': 3}\nstock['maçã'] = 8\nstock['uva'] = 2\nstock.pop('pera')\nprint(stock)",
        tests: [{ expected: "{'maçã': 8, 'uva': 2}" }],
        requires: ["pop"],
        hints: ["Alterar e juntar escrevem-se da mesma forma: `dic[chave] = valor`."],
        explain: "Três operações com a mesma ideia: chave e valor.",
      },
      {
        type: "parsons", title: "Ordena as linhas",
        prompt: "Ordena as linhas para criar um dicionário de notas, mostrar a nota da Ana e quantos alunos existem.",
        parsons: "notas = {}\nnotas['Ana'] = 15\nnotas['Rui'] = 12\nprint(notas['Ana'])\nprint(len(notas))",
        tests: [{ expected: "15\n2" }],
        hints: ["Só podes consultar uma chave depois de a criares."],
        explain: "Primeiro criar, depois consultar.",
      },
      {
        type: "debug", title: "Chave inexistente",
        prompt: "Este programa devia mostrar o preço do sumo e do bolo, mas dá `KeyError`. Corrige-o.",
        starter: "precos = {'sumo': 1.2, 'bolo': 1.8}\nprint(precos['sumo'])\nprint(precos['bola'])",
        solution: "precos = {'sumo': 1.2, 'bolo': 1.8}\nprint(precos['sumo'])\nprint(precos['bolo'])",
        tests: [{ expected: "1.2\n1.8" }],
        hints: ["Lê a chave com atenção: está escrita exatamente como no dicionário?"],
        explain: "`KeyError` quase sempre é uma chave mal escrita.",
      },
      {
        type: "code", title: "Lista de contactos",
        prompt: "Pergunta um nome. Se existir no dicionário `contactos`, mostra o número; senão mostra `Desconhecido`.",
        starter: "contactos = {'Ana': '912345678', 'Rui': '923456789'}\n# Escreve aqui o resto do programa\n",
        solution: "contactos = {'Ana': '912345678', 'Rui': '923456789'}\nnome = input('Nome? ')\nif nome in contactos:\n    print(contactos[nome])\nelse:\n    print('Desconhecido')",
        tests: [
          { inputs: ["Ana"], expected: "912345678" },
          { inputs: ["Eva"], expected: "Desconhecido" },
          { inputs: ["Rui"], expected: "923456789", hidden: true },
        ],
        requires: ["input", "in", "if", "else"],
        hints: ["Verifica primeiro com `in` para evitar o `KeyError`."],
        explain: "Verificar antes de consultar é o padrão seguro.",
      },
    ],
  });
})(typeof window !== "undefined" ? window : globalThis);
