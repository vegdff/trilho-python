/* Mundos 1 a 7: do primeiro print() aos operadores. */
(function (root) {
  var T = root.TH.T, L = root.TH.L;

  // ------------------------------------------------------------------ 1
  root.TRILHO_WORLDS.push({
    id: "w1",
    title: "Primeiros passos",
    subtitle: "print() e comentários",
    theory: T(
      "A função `print()` mostra uma mensagem no ecrã. O texto vai entre aspas, simples ou duplas, e é igual.",
      "Tudo o que vem depois de um `#` é um **comentário**: o Python ignora-o. Serve para explicares o código a quem o ler.",
      "Em Python não se usa ponto e vírgula no fim das linhas. O programa executa as linhas pela ordem em que estão escritas, de cima para baixo."
    ),
    exercises: [
      {
        type: "predict",
        title: "O que aparece?",
        prompt: "Lê o programa com atenção e prevê o que vai aparecer no ecrã. Depois podes correr o código para confirmar.",
        code: "print('Olá, mundo!')\n# print('Isto não aparece')\nprint(\"Estou a aprender Python\")",
        options: [
          "Olá, mundo!\nEstou a aprender Python",
          "Olá, mundo!\nIsto não aparece\nEstou a aprender Python",
          "Olá, mundo!",
          "Dá erro",
        ],
        answer: 0,
        explain: "A linha que começa por # é um comentário e o Python ignora-a. As outras duas executam pela ordem em que estão escritas.",
        hints: ["Procura o símbolo # no início de uma linha. O que acontece a essa linha?"],
      },
      {
        type: "recreate",
        title: "Recria de memória",
        prompt: "Estuda este programa. Quando estiveres pronto, esconde-o e escreve-o de memória. Não precisa de ficar letra a letra igual: tem de mostrar o mesmo resultado.",
        code: "# Apresentação\nprint('Olá, mundo!')\nprint(\"Estou a aprender Python\")\nprint('Três', 'palavras', 'juntas')",
        tests: [{ expected: "Olá, mundo!\nEstou a aprender Python\nTrês palavras juntas" }],
        hints: ["Quando um `print()` tem várias coisas separadas por vírgulas, mostra-as na mesma linha, separadas por um espaço."],
        explain: "Bom trabalho. Escrever de memória ajuda a fixar a sintaxe muito melhor do que apenas ler.",
      },
      {
        type: "debug",
        title: "Caça ao erro",
        prompt: "Este programa tem dois erros. Corrige-os para que mostre `Olá, mundo!` e `Bom dia`, cada um na sua linha.",
        starter: "Print('Olá, mundo!')\nprint(\"Bom dia')",
        solution: "print('Olá, mundo!')\nprint(\"Bom dia\")",
        tests: [{ expected: "Olá, mundo!\nBom dia" }],
        hints: [
          "O Python distingue maiúsculas de minúsculas: `print` escreve-se tudo em minúsculas.",
          "As aspas de abertura e de fecho têm de ser do mesmo tipo.",
        ],
        explain: "Os erros de maiúsculas e de aspas são dos mais comuns. A mensagem de erro diz-te a linha onde procurar.",
      },
      {
        type: "parsons",
        title: "Ordena as linhas",
        prompt: "Ordena as linhas para que o programa faça uma contagem decrescente e acabe com `Lançar!`.",
        parsons: "print('3')\nprint('2')\nprint('1')\nprint('Lançar!')",
        tests: [{ expected: "3\n2\n1\nLançar!" }],
        hints: ["O Python executa as linhas de cima para baixo, pela ordem em que estão."],
        explain: "A ordem das linhas é a ordem de execução.",
      },
      {
        type: "code",
        title: "Os teus três print()",
        prompt: T(
          "Escreve um programa com um comentário a explicar o que faz e três `print()` que mostrem exatamente estas linhas:",
          L("`Nome: Ana`", "`Turma: 10A`", "`Hobby: música`")
        ),
        starter: "# Escreve aqui o teu programa\n",
        solution: "# Mostra os meus dados\nprint('Nome: Ana')\nprint('Turma: 10A')\nprint('Hobby: música')",
        tests: [{ expected: "Nome: Ana\nTurma: 10A\nHobby: música" }],
        requires: ["comment"],
        hints: ["Cada `print()` mostra uma linha. O texto vai entre aspas."],
        explain: "Primeiro programa completo. Os comentários ajudam quem lê o código, incluindo tu daqui a um mês.",
      },
    ],
  });

  // ------------------------------------------------------------------ 2
  root.TRILHO_WORLDS.push({
    id: "w2",
    title: "Variáveis",
    subtitle: "Guardar valores com nomes",
    theory: T(
      "Uma **variável** é um nome que guarda um valor. Cria-se com o sinal `=`: o valor da direita é guardado no nome da esquerda.",
      "Regras para os nomes:\n" +
        L(
          "só letras, números e `_` (sublinhado), sem espaços nem símbolos como `#` ou `$`;",
          "não podem começar por um número (`10turma` não serve);",
          "maiúsculas e minúsculas são diferentes: `idade` e `Idade` são variáveis distintas;",
          "por convenção escrevem-se em minúsculas, separando as palavras com `_`, por exemplo `nome_completo`."
        ),
      "Se atribuíres outro valor ao mesmo nome, o valor antigo é substituído."
    ),
    exercises: [
      {
        type: "predict",
        title: "Valor que muda",
        prompt: "O que aparece no ecrã?",
        code: "idade = 16\nprint(idade)\nidade = 17\nprint(idade)",
        options: ["16\n17", "17\n17", "16\n16", "17\n16"],
        answer: 0,
        explain: "Quando atribuis um novo valor a uma variável, o valor antigo é substituído.",
        hints: ["Desenha uma tabela com o valor de `idade` depois de cada linha."],
      },
      {
        type: "recreate",
        title: "Recria de memória",
        prompt: "Estuda o programa, esconde-o e escreve-o de memória.",
        code: "nome = 'Rita'\nidade = 16\nprint(nome)\nidade = idade + 1\nprint(idade)\nnome_completo = 'Rita Sousa'\nprint(nome_completo)",
        tests: [{ expected: "Rita\n17\nRita Sousa" }],
        hints: ["`idade = idade + 1` calcula primeiro o lado direito (16 + 1) e guarda o resultado em `idade`."],
        explain: "Uma variável pode usar o seu próprio valor para calcular o novo.",
      },
      {
        type: "trace",
        title: "Quadro de traçagem: troca de valores",
        prompt: "Um **quadro de traçagem** regista o valor de cada variável depois de cada linha ser executada. Preenche o quadro. Escreve `-` se a variável ainda não existe.",
        code: "a = 4\nb = 7\na = a + b\nb = a - b\na = a - b\nprint(a, b)",
        columns: ["Depois da linha", "a", "b"],
        rows: [
          ["1", "4", "-"],
          ["2", ["4"], ["7"]],
          ["3", ["11"], ["7"]],
          ["4", ["11"], ["4"]],
          ["5", ["7"], ["4"]],
        ],
        finalOutput: { label: "O que mostra a linha 6?", answer: ["7 4"] },
        hints: ["Em `a = a + b`, usa os valores que a e b têm nesse momento: 4 + 7."],
        explain: "Este truque troca os valores de duas variáveis sem usar uma terceira. O quadro de traçagem ajuda a seguir o que o computador faz.",
      },
      {
        type: "debug",
        title: "Nomes inválidos",
        prompt: "Os nomes das variáveis neste programa não são válidos. Corrige-os (podes escolher outros nomes) para que mostre `10A` e `Rita Sousa`, cada um na sua linha.",
        starter: "10turma = '10A'\nnome completo = 'Rita Sousa'\nprint(10turma)\nprint(nome completo)",
        solution: "turma_10 = '10A'\nnome_completo = 'Rita Sousa'\nprint(turma_10)\nprint(nome_completo)",
        tests: [{ expected: "10A\nRita Sousa" }],
        hints: ["Um nome não pode começar por um número nem ter espaços.", "Usa o sublinhado `_` para separar palavras."],
        explain: "Nomes claros e válidos tornam o programa mais fácil de ler.",
      },
      {
        type: "code",
        title: "Cria as tuas variáveis",
        prompt: "Cria a variável `nome` com o texto `Rita` e a variável `idade` com o número `16`. Depois mostra o valor de cada uma, uma por linha.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "nome = 'Rita'\nidade = 16\nprint(nome)\nprint(idade)",
        tests: [{ expected: "Rita\n16" }],
        checkVars: [
          { name: "nome", value: "'Rita'" },
          { name: "idade", value: "16" },
        ],
        hints: ["O texto leva aspas e o número não."],
        explain: "Texto vai entre aspas, números não.",
      },
    ],
  });

  // ------------------------------------------------------------------ 3
  root.TRILHO_WORLDS.push({
    id: "w3",
    title: "Tipos de dados",
    subtitle: "int, float, str e bool",
    theory: T(
      "Cada valor tem um **tipo**:\n" +
        L(
          "`int`: números inteiros (`16`);",
          "`float`: números com parte decimal (`1.68`, com ponto e não vírgula);",
          "`str`: texto (`'Rita'`);",
          "`bool`: só pode ser `True` ou `False`."
        ),
      "A função `type()` diz-te o tipo de um valor. A função `len()` conta os caracteres de um texto. Com o `+` juntas textos.",
      "Os textos têm métodos, que se escrevem a seguir ao texto com um ponto: `upper()` (maiúsculas), `lower()` (minúsculas) e `replace('a', 'b')` (troca um pedaço do texto por outro)."
    ),
    exercises: [
      {
        type: "predict",
        title: "Que tipo é?",
        prompt: "O que aparece no ecrã?",
        code: "print(type(16))\nprint(type(1.68))\nprint(type('Rita'))\nprint(type(True))",
        options: [
          "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>",
          "<class 'int'>\n<class 'int'>\n<class 'str'>\n<class 'bool'>",
          "<class 'float'>\n<class 'float'>\n<class 'str'>\n<class 'str'>",
          "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'str'>",
        ],
        answer: 0,
        explain: "16 é inteiro, 1.68 tem parte decimal, 'Rita' está entre aspas (texto) e True é um booleano.",
        hints: ["O que distingue um `int` de um `float`? E o que significam as aspas?"],
      },
      {
        type: "parsons",
        title: "Ordena as linhas",
        prompt: "Ordena as linhas para mostrar o tamanho do texto, o texto em maiúsculas e o texto com um ponto de exclamação. Uma das linhas não pertence ao programa.",
        parsons: "frase = 'bom dia'\nprint(len(frase))\nprint(frase.upper())\nprint(frase + '!')",
        distractors: ["print(frase.upper)"],
        tests: [{ expected: "7\nBOM DIA\nbom dia!" }],
        hints: ["Os métodos levam sempre parênteses: `frase.upper()`."],
        explain: "Sem parênteses o método não é executado.",
      },
      {
        type: "code",
        title: "Os tipos das variáveis",
        prompt: "Mostra o tipo de cada uma das quatro variáveis, uma por linha, pela ordem em que aparecem.",
        starter: "a = 7\nb = 7.0\nc = '7'\nd = False\n# Mostra o tipo de cada variável\n",
        solution: "a = 7\nb = 7.0\nc = '7'\nd = False\nprint(type(a))\nprint(type(b))\nprint(type(c))\nprint(type(d))",
        tests: [{ expected: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>" }],
        requires: ["type"],
        hints: ["`7`, `7.0` e `'7'` parecem iguais, mas não são do mesmo tipo."],
        explain: "O valor 7 pode ser um int, um float ou um texto, consoante a forma como o escreves.",
      },
      {
        type: "predict",
        title: "Métodos de texto",
        prompt: "O que aparece no ecrã? Conta bem os caracteres, incluindo os espaços.",
        code: "frase = 'Python é fixe'\nprint(len(frase))\nprint(frase.upper())\nprint(frase.replace('fixe', 'poderoso'))",
        options: [
          "13\nPYTHON É FIXE\nPython é poderoso",
          "11\nPYTHON É FIXE\nPython é poderoso",
          "13\nPython é fixe\nPython é poderoso",
          "13\nPYTHON É FIXE\nPython é fixe",
        ],
        answer: 0,
        explain: "`len()` conta todos os caracteres, incluindo espaços. `upper()` e `replace()` devolvem um texto novo.",
        hints: ["P-y-t-h-o-n são 6, depois vem um espaço, o é, outro espaço e f-i-x-e."],
      },
      {
        type: "code",
        title: "Texto em ação",
        prompt: T(
          "Com a variável `nome` já criada, mostra, uma por linha:",
          L("o nome em maiúsculas;", "quantos caracteres tem;", "o texto `Olá, ` juntado ao nome (por exemplo `Olá, rita sousa`).")
        ),
        starter: "nome = 'rita sousa'\n# Escreve aqui o resto do programa\n",
        solution: "nome = 'rita sousa'\nprint(nome.upper())\nprint(len(nome))\nprint('Olá, ' + nome)",
        tests: [{ expected: "RITA SOUSA\n10\nOlá, rita sousa" }],
        requires: ["upper", "len"],
        checkVars: [{ name: "nome", value: "'rita sousa'" }],
        hints: ["Não alteres a variável `nome`: usa-a nos três `print()`.", "Para juntar textos usa `+`."],
        explain: "Já sabes usar métodos, `len()` e a concatenação com `+`.",
      },
    ],
  });

  // ------------------------------------------------------------------ 4
  root.TRILHO_WORLDS.push({
    id: "w4",
    title: "Converter tipos",
    subtitle: "int(), float() e str()",
    theory: T(
      "Às vezes é preciso mudar o tipo de um valor:\n" +
        L(
          "`int()` converte para inteiro (`int(3.9)` dá `3`, porque corta a parte decimal);",
          "`float()` converte para decimal;",
          "`str()` converte para texto."
        ),
      "Não se pode somar um número com um texto: `8 + '32'` dá erro (`TypeError`). É preciso converter primeiro. Somar um `int` com um `float` funciona e o resultado é `float`."
    ),
    exercises: [
      {
        type: "predict",
        title: "Converter e somar",
        prompt: "O que aparece no ecrã?",
        code: "texto = '32'\nnumero = 8\nprint(int(texto) + numero)\nprint(str(numero) + texto)\nprint(float(numero))\nprint(int(3.9))",
        options: ["40\n832\n8.0\n3", "40\n40\n8.0\n4", "832\n832\n8\n3", "Dá erro"],
        answer: 0,
        explain: "Com `int()` a soma é numérica (40). Com `str()` os dois textos são juntados (832). `int(3.9)` corta a parte decimal.",
        hints: ["`+` entre números soma; `+` entre textos junta."],
      },
      {
        type: "debug",
        title: "Número e texto",
        prompt: "Este programa dá erro. Corrige-o para mostrar `Tenho 16 anos`.",
        starter: "idade = 16\nprint('Tenho ' + idade + ' anos')",
        solution: "idade = 16\nprint('Tenho ' + str(idade) + ' anos')",
        tests: [{ expected: "Tenho 16 anos" }],
        hints: ["O `+` não junta texto com número. Converte o número com `str()`, ou usa vírgulas no `print()`."],
        explain: "Duas soluções possíveis: converter com `str()`, ou separar com vírgulas dentro do `print()`.",
      },
      {
        type: "parsons",
        title: "Ordena as linhas",
        prompt: "Ordena as linhas para somar os dois números (que estão guardados como texto) e mostrar o resultado, primeiro como número e depois com um ponto de exclamação.",
        parsons: "n1 = '10'\nn2 = '4'\nsoma = int(n1) + int(n2)\nprint(soma)\nprint(str(soma) + '!')",
        tests: [{ expected: "14\n14!" }],
        hints: ["As variáveis têm de existir antes de serem usadas."],
        explain: "Primeiro criam-se os valores, depois calcula-se, depois mostra-se.",
      },
      {
        type: "code",
        title: "Custo total",
        prompt: "A quantidade está guardada como texto. Mostra o custo total (quantidade vezes preço), fazendo a conversão necessária.",
        starter: "quantidade = '5'\npreco = 2.5\n# Mostra o custo total\n",
        solution: "quantidade = '5'\npreco = 2.5\nprint(int(quantidade) * preco)",
        tests: [{ expected: "12.5" }],
        requires: ["int|float"],
        hints: ["Se multiplicares um texto por um número, o Python repete o texto. Converte primeiro."],
        explain: "Converter antes de calcular evita erros e resultados estranhos.",
      },
      {
        type: "predict",
        title: "int com float",
        prompt: "O que aparece no ecrã?",
        code: "a = 3\nb = 2.5\nprint(a + b)\nprint(type(a + b))",
        options: ["5.5\n<class 'float'>", "5\n<class 'int'>", "5.5\n<class 'int'>", "Dá erro"],
        answer: 0,
        explain: "Quando se junta um int com um float, o Python usa float para não perder a parte decimal.",
        hints: ["O resultado tem parte decimal. Que tipo consegue guardá-la?"],
      },
    ],
  });

  // ------------------------------------------------------------------ 5
  root.TRILHO_WORLDS.push({
    id: "w5",
    title: "Perguntar ao utilizador",
    subtitle: "input()",
    theory: T(
      "A função `input()` mostra uma pergunta e espera que o utilizador escreva uma resposta. O que ela devolve é **sempre texto**, mesmo que o utilizador escreva um número.",
      "Se precisares de um número, converte com `int()` ou `float()`: `idade = int(input('Idade? '))`.",
      "Nos exercícios, o texto da pergunta é livre: só é verificado o que o programa mostra com `print()`."
    ),
    exercises: [
      {
        type: "predict",
        title: "Texto ou número?",
        prompt: "O utilizador escreve `16`. O que aparece no ecrã? (As respostas mostram a conversa completa.)",
        code: "idade = input('Idade? ')\nprint(type(idade))\nidade = int(idade)\nprint(type(idade))",
        inputs: ["16"],
        options: [
          "Idade? 16\n<class 'str'>\n<class 'int'>",
          "Idade? 16\n<class 'int'>\n<class 'int'>",
          "Idade? 16\n<class 'str'>\n<class 'str'>",
          "Idade? 16\n<class 'int'>\n<class 'str'>",
        ],
        answer: 0,
        explain: "O `input()` devolve sempre texto. Só depois de `int()` passa a número.",
        hints: ["O que devolve o `input()`, mesmo que escrevas um número?"],
      },
      {
        type: "recreate",
        title: "Recria de memória",
        prompt: "Estuda o programa, esconde-o e escreve-o de memória. O texto das perguntas pode ser diferente.",
        code: "pais = input('Em que país vives? ')\nprint('Vives em ' + pais)\nidade = int(input('Quantos anos tens? '))\nprint('Para os 18 anos faltam', 18 - idade, 'anos')",
        tests: [
          { inputs: ["Portugal", "16"], expected: "Vives em Portugal\nPara os 18 anos faltam 2 anos" },
          { inputs: ["França", "10"], expected: "Vives em França\nPara os 18 anos faltam 8 anos", hidden: true },
        ],
        hints: ["Podes escrever `int(input(...))` numa só linha."],
        explain: "Podes aninhar funções: o `input()` devolve texto e o `int()` converte-o logo.",
      },
      {
        type: "code",
        title: "Cumprimento",
        prompt: "Pergunta o nome ao utilizador e mostra `Olá, ` seguido do nome e de um ponto de exclamação. Por exemplo, para `Rita` mostra `Olá, Rita!`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "nome = input('Como te chamas? ')\nprint('Olá, ' + nome + '!')",
        tests: [
          { inputs: ["Rita"], expected: "Olá, Rita!" },
          { inputs: ["Tiago"], expected: "Olá, Tiago!", hidden: true },
        ],
        requires: ["input"],
        hints: ["Guarda a resposta numa variável e junta-a ao texto com `+`."],
        explain: "O programa funciona para qualquer nome, porque usa o valor que o utilizador escreveu.",
      },
      {
        type: "parsons",
        title: "Ordena as linhas",
        prompt: "Ordena as linhas para perguntar o nome e a cidade, por esta ordem, e mostrar uma frase.",
        parsons: "nome = input('Nome? ')\ncidade = input('Cidade? ')\nprint(nome + ' vive em ' + cidade)",
        tests: [{ inputs: ["Rita", "Aveiro"], expected: "Rita vive em Aveiro" }],
        hints: ["Só podes usar `nome` e `cidade` depois de as criares."],
        explain: "As perguntas são feitas pela ordem em que as linhas aparecem.",
      },
      {
        type: "code",
        title: "Idade a partir do ano",
        prompt: "Pergunta o ano de nascimento e mostra a idade que a pessoa faz em 2026 (apenas o número).",
        starter: "# Escreve aqui o teu programa\n",
        solution: "ano = int(input('Ano de nascimento? '))\nprint(2026 - ano)",
        tests: [
          { inputs: ["2010"], expected: "16" },
          { inputs: ["2008"], expected: "18", hidden: true },
          { inputs: ["1999"], expected: "27", hidden: true },
        ],
        requires: ["input", "int"],
        hints: ["O `input()` devolve texto. Para calcular precisas de um número."],
        explain: "Converter a resposta com `int()` permite fazer contas com ela.",
      },
      {
        type: "debug",
        title: "O dobro",
        prompt: "Este programa devia mostrar o dobro do número escrito (para `5` devia mostrar `10`), mas não funciona bem. Corrige-o.",
        starter: "n = input('Número: ')\ndobro = n * 2\nprint(dobro)",
        solution: "n = int(input('Número: '))\ndobro = n * 2\nprint(dobro)",
        tests: [
          { inputs: ["5"], expected: "10" },
          { inputs: ["21"], expected: "42", hidden: true },
        ],
        hints: ["O que acontece quando multiplicas um texto por 2?"],
        explain: "Um texto multiplicado por 2 repete-se: '5' * 2 dá '55'. Convertendo para int, a conta passa a ser numérica.",
      },
    ],
  });

  // ------------------------------------------------------------------ 6
  root.TRILHO_WORLDS.push({
    id: "w6",
    title: "Operadores aritméticos",
    subtitle: "Contas e atribuições",
    theory: T(
      "Operadores para fazer contas:\n" +
        L(
          "`+` `-` `*`: somar, subtrair, multiplicar;",
          "`/`: divisão (dá sempre decimal);",
          "`//`: divisão inteira (só a parte inteira do resultado);",
          "`%`: resto da divisão;",
          "`**`: potência."
        ),
      "Para atualizar uma variável há atalhos: `x += 2` é o mesmo que `x = x + 2`. Existem também `-=`, `*=`, `/=`, `//=`, `%=` e `**=`."
    ),
    exercises: [
      {
        type: "predict",
        title: "Contas",
        prompt: "O que aparece no ecrã?",
        code: "a = 17\nb = 5\nprint(a + b)\nprint(a // b)\nprint(a % b)\nprint(a ** 2)",
        options: ["22\n3\n2\n289", "22\n3.4\n2\n34", "22\n3\n3\n289", "12\n3\n2\n289"],
        answer: 0,
        explain: "17 dividido por 5 dá 3 (parte inteira) e sobram 2. 17 ao quadrado é 289.",
        hints: ["Quantas vezes cabe o 5 no 17? Quanto sobra?"],
      },
      {
        type: "code",
        title: "Chocolates",
        prompt: "Tens 47 chocolates para repartir igualmente por 6 amigos. Mostra quantos chocolates recebe cada amigo e, na linha seguinte, quantos sobram.",
        starter: "chocolates = 47\namigos = 6\n# Escreve aqui o resto do programa\n",
        solution: "chocolates = 47\namigos = 6\nprint(chocolates // amigos)\nprint(chocolates % amigos)",
        tests: [{ expected: "7\n5" }],
        requires: ["floordiv", "mod"],
        checkVars: [
          { name: "chocolates", value: "47" },
          { name: "amigos", value: "6" },
        ],
        hints: ["`//` dá a parte inteira da divisão e `%` dá o resto."],
        explain: "`//` e `%` formam um par: quociente e resto.",
      },
      {
        type: "trace",
        title: "Quadro de traçagem: atribuições",
        prompt: "Preenche o quadro com o valor de `pontos` depois de cada linha.",
        code: "pontos = 10\npontos += 5\npontos -= 3\npontos *= 2\npontos //= 5\nprint(pontos)",
        columns: ["Depois da linha", "pontos"],
        rows: [
          ["1", "10"],
          ["2", ["15"]],
          ["3", ["12"]],
          ["4", ["24"]],
          ["5", ["4"]],
        ],
        finalOutput: { label: "O que mostra a linha 6?", answer: ["4"] },
        hints: ["`pontos += 5` é o mesmo que `pontos = pontos + 5`."],
        explain: "Cada linha usa o valor deixado pela anterior.",
      },
      {
        type: "code",
        title: "Relógio",
        prompt: T(
          "Pergunta um número de segundos e mostra, uma por linha, as horas, os minutos e os segundos que correspondem.",
          "Por exemplo, para `3725` segundos: `1`, `2` e `5` (1 hora, 2 minutos e 5 segundos)."
        ),
        starter: "# Escreve aqui o teu programa\n",
        solution:
          "total = int(input('Segundos? '))\nhoras = total // 3600\nresto = total % 3600\nminutos = resto // 60\nsegundos = resto % 60\nprint(horas)\nprint(minutos)\nprint(segundos)",
        tests: [
          { inputs: ["3725"], expected: "1\n2\n5" },
          { inputs: ["7322"], expected: "2\n2\n2", hidden: true },
          { inputs: ["59"], expected: "0\n0\n59", hidden: true },
        ],
        requires: ["input", "int", "floordiv", "mod"],
        hints: ["Uma hora tem 3600 segundos. Depois de tirares as horas, o resto são os minutos e segundos.", "Usa `%` para ficares com o que sobra."],
        explain: "Dividir e tirar o resto, passo a passo, é um padrão muito útil.",
      },
      {
        type: "parsons",
        title: "Ordena as linhas",
        prompt: "Ordena as linhas para calcular o total de uma compra, aplicar um desconto de 2 euros e mostrar o resultado.",
        parsons: "preco = 4\nquantidade = 3\ntotal = preco * quantidade\ntotal -= 2\nprint(total)",
        tests: [{ expected: "10" }],
        hints: ["O total só pode ser calculado depois de o preço e a quantidade existirem."],
        explain: "Primeiro os dados, depois o cálculo, depois o resultado.",
      },
      {
        type: "debug",
        title: "Mesas e cadeiras",
        prompt: "Há 29 alunos e cada mesa tem 4 lugares. O programa devia mostrar quantas mesas ficam completas (`7`) e quantos alunos sobram (`1`), mas mostra outra coisa. Corrige-o.",
        starter: "total_alunos = 29\npor_mesa = 4\nmesas = total_alunos / por_mesa\nresto = total_alunos % por_mesa\nprint(mesas)\nprint(resto)",
        solution: "total_alunos = 29\npor_mesa = 4\nmesas = total_alunos // por_mesa\nresto = total_alunos % por_mesa\nprint(mesas)\nprint(resto)",
        tests: [{ expected: "7\n1" }],
        hints: ["A divisão normal `/` dá sempre um número com decimais."],
        explain: "Para contar \"quantas vezes cabe\" usa a divisão inteira `//`.",
      },
    ],
  });

  // ------------------------------------------------------------------ 7
  root.TRILHO_WORLDS.push({
    id: "w7",
    title: "Comparar e combinar",
    subtitle: "Comparação, and/or/not e in",
    theory: T(
      "Os operadores de **comparação** dão sempre `True` ou `False`: `==` (igual), `!=` (diferente), `>`, `<`, `>=`, `<=`.",
      "Atenção: `=` guarda um valor numa variável, `==` compara dois valores.",
      "Os operadores **lógicos** combinam condições: `and` (as duas verdadeiras), `or` (pelo menos uma verdadeira) e `not` (inverte).",
      "Os operadores de **pertença** perguntam se algo está numa sequência: `in` e `not in`. O texto tem de ser exatamente igual, incluindo maiúsculas."
    ),
    exercises: [
      {
        type: "predict",
        title: "Verdadeiro ou falso?",
        prompt: "O que aparece no ecrã?",
        code: "idade = 16\nprint(idade >= 18)\nprint(idade != 16)\nprint(idade >= 16 and idade < 18)\nprint(not idade < 12)",
        options: ["False\nFalse\nTrue\nTrue", "False\nTrue\nTrue\nTrue", "True\nFalse\nTrue\nFalse", "False\nFalse\nFalse\nTrue"],
        answer: 0,
        explain: "16 não é maior ou igual a 18; é igual a 16 (logo `!=` dá False); está entre 16 e 17; e não é menor que 12.",
        hints: ["Resolve cada linha separadamente, substituindo `idade` por 16."],
      },
      {
        type: "code",
        title: "Maior de idade?",
        prompt: "Pergunta a idade e mostra `True` se a pessoa tem 18 anos ou mais, ou `False` caso contrário.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "idade = int(input('Idade? '))\nprint(idade >= 18)",
        tests: [
          { inputs: ["16"], expected: "False" },
          { inputs: ["18"], expected: "True", hidden: true },
          { inputs: ["40"], expected: "True", hidden: true },
        ],
        requires: ["input", "int", "compare"],
        hints: ["Uma comparação já é um valor `True` ou `False`: podes mostrá-la diretamente com `print()`."],
        explain: "Não precisas de um `if` para mostrar o resultado de uma comparação.",
      },
      {
        type: "code",
        title: "Positiva nas duas?",
        prompt: "Pergunta duas notas e mostra `True` se **ambas** forem maiores ou iguais a 10, ou `False` caso contrário.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "nota1 = int(input('Nota 1? '))\nnota2 = int(input('Nota 2? '))\nprint(nota1 >= 10 and nota2 >= 10)",
        tests: [
          { inputs: ["12", "8"], expected: "False" },
          { inputs: ["12", "14"], expected: "True" },
          { inputs: ["9", "9"], expected: "False", hidden: true },
          { inputs: ["10", "10"], expected: "True", hidden: true },
        ],
        requires: ["input", "int", "and"],
        hints: ["Escreve cada comparação e junta-as com `and`."],
        explain: "`and` só dá True quando as duas condições são verdadeiras.",
      },
      {
        type: "predict",
        title: "Está na lista?",
        prompt: "O que aparece no ecrã?",
        code: "disciplinas = ['Python', 'Redes', 'Matemática']\nprint('Python' in disciplinas)\nprint('Física' not in disciplinas)\nprint('python' in disciplinas)",
        options: ["True\nTrue\nFalse", "True\nTrue\nTrue", "True\nFalse\nFalse", "True\nFalse\nTrue"],
        answer: 0,
        explain: "A pesquisa com `in` distingue maiúsculas de minúsculas: 'python' não é o mesmo que 'Python'.",
        hints: ["Repara na terceira linha: as letras são exatamente iguais?"],
      },
      {
        type: "parsons",
        title: "Ordena as linhas",
        prompt: "Ordena as linhas para verificar se uma nota chega ao mínimo e mostrar o resultado e o seu contrário.",
        parsons: "nota = 13\nminimo = 10\npassou = nota >= minimo\nprint(passou)\nprint(not passou)",
        tests: [{ expected: "True\nFalse" }],
        hints: ["Uma variável também pode guardar `True` ou `False`."],
        explain: "O resultado de uma comparação pode ser guardado numa variável.",
      },
      {
        type: "code",
        title: "Fim de semana?",
        prompt: "Pergunta o dia da semana (em minúsculas, por exemplo `sábado`) e mostra `True` se for `sábado` ou `domingo`, ou `False` caso contrário. Usa o operador `in`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "dia = input('Dia da semana? ')\nprint(dia in ['sábado', 'domingo'])",
        tests: [
          { inputs: ["sábado"], expected: "True" },
          { inputs: ["terça"], expected: "False" },
          { inputs: ["domingo"], expected: "True", hidden: true },
        ],
        requires: ["input", "in"],
        hints: ["Podes escrever a lista diretamente: `['sábado', 'domingo']`."],
        explain: "`in` é uma forma curta de comparar com vários valores.",
      },
    ],
  });
})(typeof window !== "undefined" ? window : globalThis);
