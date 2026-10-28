/* Mundos de repetição: while (3 passos) e for (4 passos). */
(function (root) {
  var T = root.TH.T, L = root.TH.L;
  var W = root.TRILHO_WORLDS;

  function tabuada(n) {
    var out = [];
    for (var i = 1; i <= 10; i++) out.push(n + " x " + i + " = " + n * i);
    return out.join("\n");
  }

  // ================================================================ WHILE 1
  W.push({
    id: "while1",
    title: "Repetir com while",
    subtitle: "Enquanto a condição for verdadeira",
    theory: T(
      "O `while` repete um bloco **enquanto** a condição for verdadeira. Antes de cada volta o Python testa a condição; se for falsa, o ciclo termina.",
      "```\nn = 1\nwhile n <= 3:\n    print(n)\n    n = n + 1\n```",
      "Atenção: algo dentro do ciclo tem de mudar a condição (aqui, o `n`). Se nada mudar, o ciclo nunca acaba: é um **ciclo infinito**."
    ),
    exercises: [
      {
        type: "predict", title: "Quantas voltas?", prompt: "O que aparece no ecrã?",
        code: "n = 1\nwhile n <= 3:\n    print(n)\n    n = n + 1\nprint('Fim')",
        options: ["1\n2\n3\nFim", "1\n2\n3\n4\nFim", "0\n1\n2\n3\nFim", "3\nFim"], answer: 0,
        explain: "Quando n chega a 4 a condição é falsa e o ciclo termina, sem mostrar o 4.",
        hints: ["Em que valor de `n` a condição deixa de ser verdadeira?"],
      },
      {
        type: "trace", title: "Quadro de traçagem: while",
        prompt: "Preenche o quadro com os valores no fim de cada volta e se a condição `i <= 3` continua verdadeira.",
        code: "i = 1\nsoma = 0\nwhile i <= 3:\n    soma = soma + i\n    i = i + 1\nprint(soma)",
        columns: ["Momento", "i", "soma", "i <= 3"],
        rows: [
          ["Antes do ciclo", "1", "0", "True"],
          ["Fim da volta 1", ["2"], ["1"], ["True"]],
          ["Fim da volta 2", ["3"], ["3"], ["True"]],
          ["Fim da volta 3", ["4"], ["6"], ["False"]],
        ],
        finalOutput: { label: "O que mostra o último print?", answer: ["6"] },
        hints: ["Em cada volta soma-se o valor de `i` antes de ele aumentar."],
        explain: "Este padrão (acumular num `soma` enquanto um contador avança) usa-se muito.",
      },
      {
        type: "code", title: "Contar até 5",
        prompt: "Usa um `while` para mostrar os números de 1 a 5, um por linha.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "n = 1\nwhile n <= 5:\n    print(n)\n    n = n + 1",
        tests: [{ expected: "1\n2\n3\n4\n5" }],
        requires: ["while"], forbid: ["for"],
        hints: ["Precisas de uma variável contadora que começa em 1 e aumenta em cada volta."],
        explain: "Os três ingredientes: iniciar, testar, atualizar.",
      },
      {
        type: "code", title: "Contagem decrescente",
        prompt: "Pergunta um número `n` e mostra a contagem decrescente de `n` até 1. No fim mostra `Lançar!`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "n = int(input('Número? '))\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Lançar!')",
        tests: [
          { inputs: ["3"], expected: "3\n2\n1\nLançar!" },
          { inputs: ["0"], expected: "Lançar!" },
          { inputs: ["5"], expected: "5\n4\n3\n2\n1\nLançar!", hidden: true },
        ],
        requires: ["input", "int", "while"],
        hints: ["Aqui o contador desce em vez de subir."],
        explain: "Se o utilizador escrever 0, o ciclo nem chega a executar.",
      },
      {
        type: "predict", title: "Acumulador", prompt: "O que aparece no ecrã?",
        code: "total = 0\nn = 1\nwhile n <= 4:\n    total = total + n * 2\n    n = n + 1\nprint(total)",
        options: ["20", "10", "8", "12"], answer: 0,
        explain: "2 + 4 + 6 + 8 = 20.",
        hints: ["Em cada volta soma-se o dobro de `n`."],
      },
      {
        type: "parsons", title: "Ordena e indenta",
        prompt: "Ordena as linhas para simular um jogo com três vidas. A indentação já está certa.",
        parsons: "vidas = 3\nwhile vidas > 0:\n    print('Vidas:', vidas)\n    vidas -= 1\nprint('Game over')",
        tests: [{ expected: "Vidas: 3\nVidas: 2\nVidas: 1\nGame over" }],
        hints: ["A variável tem de existir antes do `while`."],
        explain: "O `print` final não está indentado, logo só executa quando o ciclo acaba.",
      },
      {
        type: "debug", title: "Ciclo infinito",
        prompt: "Este programa nunca termina. Corrige-o para mostrar 3, 2, 1 e `Fim`.",
        starter: "n = 3\nwhile n > 0:\n    print(n)\nprint('Fim')",
        solution: "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint('Fim')",
        tests: [{ expected: "3\n2\n1\nFim" }],
        hints: ["Dentro do ciclo, algo tem de mudar o valor de `n`."],
        explain: "Se a condição nunca muda, o ciclo nunca acaba.",
      },
      {
        type: "code", title: "Soma de 1 até n",
        prompt: "Pergunta um número `n` e mostra a soma de 1 até `n`. Usa `while` (sem `for` e sem `sum`).",
        starter: "# Escreve aqui o teu programa\n",
        solution: "n = int(input('n? '))\nsoma = 0\ni = 1\nwhile i <= n:\n    soma = soma + i\n    i = i + 1\nprint(soma)",
        tests: [
          { inputs: ["5"], expected: "15" },
          { inputs: ["1"], expected: "1" },
          { inputs: ["10"], expected: "55", hidden: true },
          { inputs: ["100"], expected: "5050", hidden: true },
        ],
        requires: ["input", "int", "while"], forbid: ["for", "sum"],
        hints: ["Precisas de duas variáveis: um contador e um acumulador."],
        explain: "Contador e acumulador: o padrão mais clássico do `while`.",
      },
    ],
  });

  // ================================================================ WHILE 2
  W.push({
    id: "while2",
    title: "while e input",
    subtitle: "Repetir até a resposta estar certa",
    theory: T(
      "O `while` é ótimo para **repetir uma pergunta** até o utilizador responder bem. Não sabes quantas voltas vão ser, e isso é a grande diferença para o `for`.",
      "Padrão: pergunta uma vez antes do ciclo e repete a pergunta dentro dele.",
      "```\nsenha = input('Palavra-passe? ')\nwhile senha != 'python':\n    print('Errada')\n    senha = input('Palavra-passe? ')\n```"
    ),
    exercises: [
      {
        type: "predict", title: "Tentativas", prompt: "O utilizador escreve `x`, `y` e `ok`, por esta ordem. O que aparece no ecrã? (As respostas mostram a conversa completa.)",
        code: "resp = input('Resposta? ')\nwhile resp != 'ok':\n    print('Tenta outra vez')\n    resp = input('Resposta? ')\nprint('Certo')",
        inputs: ["x", "y", "ok"],
        options: [
          "Resposta? x\nTenta outra vez\nResposta? y\nTenta outra vez\nResposta? ok\nCerto",
          "Resposta? x\nResposta? y\nResposta? ok\nCerto",
          "Resposta? x\nTenta outra vez\nResposta? y\nCerto",
          "Resposta? x\nTenta outra vez\nTenta outra vez\nCerto",
        ],
        answer: 0, explain: "Duas respostas erradas dão duas mensagens. À terceira, o ciclo termina e mostra 'Certo'.",
        hints: ["Cada resposta errada mostra a mensagem e faz nova pergunta."],
      },
      {
        type: "code", title: "Palavra-passe",
        prompt: "Pergunta a palavra-passe até o utilizador escrever `python`. Por cada erro mostra `Errada`. Quando acertar mostra `Entraste`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "senha = input('Palavra-passe? ')\nwhile senha != 'python':\n    print('Errada')\n    senha = input('Palavra-passe? ')\nprint('Entraste')",
        tests: [
          { inputs: ["abc", "123", "python"], expected: "Errada\nErrada\nEntraste" },
          { inputs: ["python"], expected: "Entraste" },
          { inputs: ["Python", "python"], expected: "Errada\nEntraste", hidden: true },
        ],
        requires: ["input", "while"],
        hints: ["Pergunta uma vez antes do ciclo e outra dentro dele."],
        explain: "A primeira pergunta é necessária para a condição ter um valor para testar.",
      },
      {
        type: "code", title: "Nota válida",
        prompt: "Pergunta uma nota. Enquanto não estiver entre 0 e 20 (inclusive), mostra `Inválida` e pergunta de novo. No fim mostra `Nota: ` seguido da nota (ex.: `Nota: 14`).",
        starter: "# Escreve aqui o teu programa\n",
        solution: "nota = int(input('Nota? '))\nwhile nota < 0 or nota > 20:\n    print('Inválida')\n    nota = int(input('Nota? '))\nprint('Nota:', nota)",
        tests: [
          { inputs: ["14"], expected: "Nota: 14" },
          { inputs: ["25", "-3", "18"], expected: "Inválida\nInválida\nNota: 18" },
          { inputs: ["0"], expected: "Nota: 0", hidden: true },
          { inputs: ["21", "20"], expected: "Inválida\nNota: 20", hidden: true },
        ],
        requires: ["input", "int", "while", "or"],
        hints: ["A condição do ciclo descreve o que está **errado**."],
        explain: "Usar a condição \"inválido\" no `while` é uma forma natural de validar entradas.",
      },
    ],
  });

  // ================================================================ WHILE 3
  W.push({
    id: "while3",
    title: "break e continue",
    subtitle: "Sair do ciclo ou saltar uma volta",
    theory: T(
      "`break` **termina** o ciclo imediatamente. `continue` **salta** o resto desta volta e passa à seguinte.",
      "É comum usar `while True:` (um ciclo que só acaba com `break`) quando a saída depende de algo que o utilizador escreve.",
      "```\nwhile True:\n    n = int(input('Número (0 para sair)? '))\n    if n == 0:\n        break\n```"
    ),
    exercises: [
      {
        type: "predict", title: "Quando sai?", prompt: "O que aparece no ecrã?",
        code: "n = 0\nwhile True:\n    n = n + 1\n    if n == 2:\n        continue\n    if n == 5:\n        break\n    print(n)",
        options: ["1\n3\n4", "1\n2\n3\n4", "1\n3\n4\n5", "1\n3"], answer: 0,
        explain: "Em n = 2 o `continue` salta o `print`. Em n = 5 o `break` termina antes de mostrar.",
        hints: ["Segue o valor de `n` volta a volta."],
      },
      {
        type: "code", title: "Soma até zero",
        prompt: "Pergunta números repetidamente e vai somando. Quando o utilizador escrever `0`, termina e mostra a soma total (sem contar o 0).",
        starter: "# Escreve aqui o teu programa\n",
        solution: "soma = 0\nwhile True:\n    n = int(input('Número? '))\n    if n == 0:\n        break\n    soma = soma + n\nprint(soma)",
        tests: [
          { inputs: ["5", "3", "0"], expected: "8" },
          { inputs: ["0"], expected: "0" },
          { inputs: ["10", "-4", "7", "0"], expected: "13", hidden: true },
        ],
        requires: ["input", "int", "while", "break", "if"],
        hints: ["Usa `while True:` e o `break` quando o número for 0."],
        explain: "O `break` permite sair a meio da volta, antes de somar o 0.",
      },
      {
        type: "code", title: "Saltar múltiplos de 3",
        prompt: "Mostra os números de 1 a 10, um por linha, **exceto** os múltiplos de 3. Usa `while` e `continue`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "i = 0\nwhile i < 10:\n    i = i + 1\n    if i % 3 == 0:\n        continue\n    print(i)",
        tests: [{ expected: "1\n2\n4\n5\n7\n8\n10" }],
        requires: ["while", "continue", "mod"],
        hints: ["Atualiza o contador **antes** do `continue`, senão o ciclo fica preso."],
        explain: "Um erro frequente é pôr o `continue` antes de o contador avançar, o que cria um ciclo infinito.",
      },
      {
        type: "trace", title: "Quadro de traçagem: continue e break",
        prompt: "Regista os valores de `i` e `total` no fim de cada volta (na volta em que há `break`, regista os valores no momento do `break`).",
        code: "i = 0\ntotal = 0\nwhile i < 5:\n    i += 1\n    if i == 2:\n        continue\n    if i == 4:\n        break\n    total += i\nprint(total)",
        columns: ["Volta", "i", "total"],
        rows: [
          ["1", ["1"], ["1"]],
          ["2", ["2"], ["1"]],
          ["3", ["3"], ["4"]],
          ["4", ["4"], ["4"]],
        ],
        finalOutput: { label: "O que mostra o último print?", answer: ["4"] },
        hints: ["Na volta 2, o `continue` salta o `total += i`."],
        explain: "O `continue` evita somar o 2 e o `break` impede de somar o 4.",
      },
    ],
  });

  // ================================================================ FOR 1
  W.push({
    id: "for1",
    title: "Repetir com for",
    subtitle: "Percorrer uma sequência",
    theory: T(
      "O `for` percorre uma sequência (lista, texto, tuplo, conjunto...) e executa o bloco **uma vez por elemento**. Em cada volta, a variável do ciclo guarda o elemento atual.",
      "```\nnomes = ['Ana', 'Rui']\nfor nome in nomes:\n    print('Olá,', nome)\n```",
      "Ao contrário do `while`, sabes quantas voltas vai haver: tantas como elementos. Não precisas de contador."
    ),
    exercises: [
      {
        type: "predict", title: "Uma volta por nome", prompt: "O que aparece no ecrã?",
        code: "nomes = ['Ana', 'Rui']\nfor nome in nomes:\n    print('Olá,', nome)\nprint('Fim')",
        options: ["Olá, Ana\nOlá, Rui\nFim", "Olá, Ana\nFim\nOlá, Rui\nFim", "Olá, nome\nOlá, nome\nFim", "Olá, Ana\nOlá, Rui"], answer: 0,
        explain: "O bloco repete para cada elemento. O print final está fora do ciclo.",
        hints: ["Quantos elementos tem a lista? A última linha está indentada?"],
      },
      {
        type: "predict", title: "Percorrer um texto", prompt: "O que aparece no ecrã?",
        code: "for letra in 'sol':\n    print(letra.upper())",
        options: ["S\nO\nL", "SOL", "s\no\nl", "S O L"], answer: 0,
        explain: "Um texto é uma sequência de caracteres, por isso o `for` percorre letra a letra.",
        hints: ["Cada volta guarda uma letra em `letra`."],
      },
      {
        type: "code", title: "Maiúsculas",
        prompt: "Percorre a lista e mostra cada palavra em maiúsculas, uma por linha.",
        starter: "palavras = ['sol', 'mar', 'areia']\n# Escreve aqui o resto do programa\n",
        solution: "palavras = ['sol', 'mar', 'areia']\nfor p in palavras:\n    print(p.upper())",
        tests: [{ expected: "SOL\nMAR\nAREIA" }],
        requires: ["for", "upper"],
        checkVars: [{ name: "palavras", value: "['sol', 'mar', 'areia']" }],
        hints: ["A variável do ciclo guarda a palavra atual."],
        explain: "Percorrer e transformar cada elemento é um uso muito comum.",
      },
      {
        type: "code", title: "Somar a lista",
        prompt: "Calcula e mostra a soma dos valores da lista. Usa um `for` com acumulador (sem usar `sum`).",
        starter: "notas = [12, 15, 9, 18]\n# Escreve aqui o resto do programa\n",
        solution: "notas = [12, 15, 9, 18]\ntotal = 0\nfor n in notas:\n    total = total + n\nprint(total)",
        tests: [{ expected: "54" }],
        requires: ["for"], forbid: ["sum"],
        checkVars: [{ name: "notas", value: "[12, 15, 9, 18]" }],
        hints: ["Cria `total = 0` antes do ciclo."],
        explain: "É o mesmo padrão do `while`, mas sem contador.",
      },
      {
        type: "code", title: "Percorrer um dicionário",
        prompt: "Percorre o dicionário e mostra, para cada produto, o nome e o preço na mesma linha (por exemplo `sandes 2.5`).",
        starter: "precos = {'sandes': 2.5, 'sumo': 1.2, 'bolo': 1.8}\n# Escreve aqui o resto do programa\n",
        solution: "precos = {'sandes': 2.5, 'sumo': 1.2, 'bolo': 1.8}\nfor produto in precos:\n    print(produto, precos[produto])",
        tests: [{ expected: "sandes 2.5\nsumo 1.2\nbolo 1.8" }],
        requires: ["for", "index"],
        hints: ["Num `for` sobre um dicionário, a variável guarda cada **chave**."],
        explain: "Com a chave, vais buscar o valor.",
      },
    ],
  });

  // ================================================================ FOR 2
  W.push({
    id: "for2",
    title: "for e range()",
    subtitle: "Repetir um número de vezes",
    theory: T(
      "`range()` gera uma sequência de números:\n" +
        L(
          "`range(5)` dá 0, 1, 2, 3, 4 (começa em 0 e **não inclui** o 5);",
          "`range(2, 6)` dá 2, 3, 4, 5 (início incluído, fim não);",
          "`range(0, 10, 3)` dá 0, 3, 6, 9 (o terceiro valor é o passo)."
        ),
      "```\nfor i in range(1, 4):\n    print(i)\n```",
      "Para ver os valores de um `range` numa lista escreve `list(range(5))`."
    ),
    exercises: [
      {
        type: "predict", title: "O que gera o range?", prompt: "O que aparece no ecrã?",
        code: "print(list(range(4)))\nprint(list(range(2, 6)))\nprint(list(range(0, 10, 3)))",
        options: [
          "[0, 1, 2, 3]\n[2, 3, 4, 5]\n[0, 3, 6, 9]",
          "[1, 2, 3, 4]\n[2, 3, 4, 5, 6]\n[0, 3, 6, 9]",
          "[0, 1, 2, 3]\n[2, 3, 4, 5]\n[3, 6, 9]",
          "[0, 1, 2, 3, 4]\n[2, 3, 4, 5]\n[0, 3, 6, 9, 12]",
        ],
        answer: 0, explain: "O fim nunca é incluído e, sem início, começa-se em 0.",
        hints: ["O último valor do `range` nunca aparece."],
      },
      {
        type: "trace", title: "Quadro de traçagem: for com range",
        prompt: "Preenche os valores de `i` e `soma` no fim de cada volta. Escreve `-` se a variável ainda não existe.",
        code: "soma = 0\nfor i in range(1, 5):\n    soma = soma + i\nprint(soma)",
        columns: ["Momento", "i", "soma"],
        rows: [
          ["Antes do ciclo", "-", "0"],
          ["Fim da volta 1", ["1"], ["1"]],
          ["Fim da volta 2", ["2"], ["3"]],
          ["Fim da volta 3", ["3"], ["6"]],
          ["Fim da volta 4", ["4"], ["10"]],
        ],
        finalOutput: { label: "O que mostra o último print?", answer: ["10"] },
        hints: ["`range(1, 5)` dá 1, 2, 3 e 4."],
        explain: "O 5 nunca entra. É a causa de muitos erros de \"um a menos\".",
      },
      {
        type: "code", title: "De 5 a 9",
        prompt: "Usa um `for` com `range` para mostrar os números de 5 a 9, um por linha.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "for i in range(5, 10):\n    print(i)",
        tests: [{ expected: "5\n6\n7\n8\n9" }],
        requires: ["for", "range"],
        hints: ["Para incluir o 9, o fim do range tem de ser 10."],
        explain: "Fim do range = último valor + 1.",
      },
      {
        type: "predict", title: "O passo", prompt: "O que aparece no ecrã?",
        code: "for i in range(2, 11, 4):\n    print(i)",
        options: ["2\n6\n10", "2\n6\n10\n14", "2\n4\n6\n8\n10", "6\n10"], answer: 0,
        explain: "Começa em 2 e avança de 4 em 4 enquanto for menor que 11.",
        hints: ["Soma 4 ao valor anterior até passar de 10."],
      },
      {
        type: "code", title: "Tabuada",
        prompt: "Pergunta um número e mostra a sua tabuada de 1 a 10, no formato `3 x 1 = 3`.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "n = int(input('Número? '))\nfor i in range(1, 11):\n    print(n, 'x', i, '=', n * i)",
        tests: [
          { inputs: ["3"], expected: tabuada(3) },
          { inputs: ["7"], expected: tabuada(7), hidden: true },
          { inputs: ["12"], expected: tabuada(12), hidden: true },
        ],
        requires: ["input", "int", "for", "range"],
        hints: ["O ciclo vai de 1 a 10: o fim do range é 11."],
        explain: "Usaste a variável do ciclo dentro do cálculo.",
      },
      {
        type: "parsons", title: "Ordena e indenta",
        prompt: "Ordena as linhas para somar o dobro de cada número de 1 a 3.",
        parsons: "soma = 0\nfor i in range(1, 4):\n    soma += i * 2\nprint(soma)",
        tests: [{ expected: "12" }],
        hints: ["O acumulador tem de ser criado antes do ciclo."],
        explain: "2 + 4 + 6 = 12.",
      },
      {
        type: "code", title: "Numerar a lista",
        prompt: "Mostra cada nome precedido do seu número de ordem, começando em 1 (por exemplo `1 Ana`). Usa `range(len(...))` e índices.",
        starter: "nomes = ['Ana', 'Rui', 'Eva']\n# Escreve aqui o resto do programa\n",
        solution: "nomes = ['Ana', 'Rui', 'Eva']\nfor i in range(len(nomes)):\n    print(i + 1, nomes[i])",
        tests: [{ expected: "1 Ana\n2 Rui\n3 Eva" }],
        requires: ["for", "range", "len", "index"],
        checkVars: [{ name: "nomes", value: "['Ana', 'Rui', 'Eva']" }],
        hints: ["`i` é o índice (começa em 0); o número de ordem é `i + 1`."],
        explain: "`range(len(lista))` dá todos os índices válidos.",
      },
      {
        type: "debug", title: "Um a menos",
        prompt: "Este programa devia mostrar os números de 1 a 5, mas pára no 4. Corrige-o.",
        starter: "for i in range(1, 5):\n    print(i)",
        solution: "for i in range(1, 6):\n    print(i)",
        tests: [{ expected: "1\n2\n3\n4\n5" }],
        hints: ["O fim do range não é incluído."],
        explain: "O clássico erro de \"um a menos\" (off-by-one).",
      },
    ],
  });

  // ================================================================ FOR 3
  W.push({
    id: "for3",
    title: "for com decisões",
    subtitle: "Contar, filtrar e parar",
    theory: T(
      "Um `for` pode ter um `if` lá dentro, para tratar só alguns elementos. Também podes usar `continue` (saltar este elemento) e `break` (parar o ciclo).",
      "```\nfor n in [3, 8, 5]:\n    if n % 2 == 0:\n        print(n, 'é par')\n```",
      "Combinando `for`, `if` e um acumulador, resolves problemas de **contar**, **somar** e **procurar**."
    ),
    exercises: [
      {
        type: "trace", title: "Quadro de traçagem: for com if",
        prompt: "Para cada volta escreve o valor de `n`, o resultado da condição (`True` ou `False`) e o valor de `pares` no fim da volta.",
        code: "pares = 0\nfor n in [3, 8, 5, 4]:\n    if n % 2 == 0:\n        pares += 1\nprint(pares)",
        columns: ["Volta", "n", "n % 2 == 0", "pares"],
        rows: [
          ["1", "3", ["False"], ["0"]],
          ["2", "8", ["True"], ["1"]],
          ["3", "5", ["False"], ["1"]],
          ["4", "4", ["True"], ["2"]],
        ],
        finalOutput: { label: "O que mostra o último print?", answer: ["2"] },
        hints: ["O `pares` só aumenta quando a condição é verdadeira."],
        explain: "É o padrão \"contar os que cumprem uma condição\".",
      },
      {
        type: "code", title: "Contar positivos",
        prompt: "Pergunta 5 números e mostra quantos são positivos (maiores que 0).",
        starter: "# Escreve aqui o teu programa\n",
        solution: "positivos = 0\nfor i in range(5):\n    n = int(input('Número? '))\n    if n > 0:\n        positivos += 1\nprint(positivos)",
        tests: [
          { inputs: ["3", "-1", "0", "7", "2"], expected: "3" },
          { inputs: ["-1", "-2", "-3", "-4", "-5"], expected: "0", hidden: true },
          { inputs: ["1", "1", "1", "1", "1"], expected: "5", hidden: true },
        ],
        requires: ["input", "int", "for", "range", "if"],
        hints: ["Cria um contador antes do ciclo e aumenta-o só quando o número for positivo."],
        explain: "Aqui o `for range(5)` serve só para repetir 5 vezes.",
      },
      {
        type: "code", title: "Só os ímpares",
        prompt: "Mostra os números ímpares de 1 a 10, um por linha. Usa `continue` para saltar os pares.",
        starter: "# Escreve aqui o teu programa\n",
        solution: "for i in range(1, 11):\n    if i % 2 == 0:\n        continue\n    print(i)",
        tests: [{ expected: "1\n3\n5\n7\n9" }],
        requires: ["for", "range", "continue"],
        hints: ["Se o número for par, salta; o resto do corpo trata os ímpares."],
        explain: "Aqui o `continue` não cria ciclo infinito, porque o `for` avança sozinho.",
      },
      {
        type: "code", title: "Primeiro múltiplo de 7",
        prompt: "Percorre a lista e mostra o **primeiro** múltiplo de 7. Depois de o encontrar, pára o ciclo com `break`.",
        starter: "numeros = [3, 10, 15, 21, 28, 35]\n# Escreve aqui o resto do programa\n",
        solution: "numeros = [3, 10, 15, 21, 28, 35]\nfor n in numeros:\n    if n % 7 == 0:\n        print(n)\n        break",
        tests: [{ expected: "21" }],
        requires: ["for", "if", "mod", "break"],
        checkVars: [{ name: "numeros", value: "[3, 10, 15, 21, 28, 35]" }],
        hints: ["Mostra o número e usa o `break` no mesmo bloco do `if`."],
        explain: "O `break` evita continuar a procurar depois de encontrares.",
      },
      {
        type: "code", title: "Maior valor",
        prompt: "Encontra e mostra o maior valor da lista, sem usar `max`. Guarda o maior visto até agora numa variável.",
        starter: "valores = [14, 9, 21, 7, 18]\n# Escreve aqui o resto do programa\n",
        solution: "valores = [14, 9, 21, 7, 18]\nmaior = valores[0]\nfor v in valores:\n    if v > maior:\n        maior = v\nprint(maior)",
        tests: [{ expected: "21" }],
        requires: ["for", "if"], forbid: ["max"],
        checkVars: [{ name: "valores", value: "[14, 9, 21, 7, 18]" }],
        hints: ["Começa com `maior = valores[0]` e atualiza quando encontrares um valor maior."],
        explain: "É a base de muitos algoritmos de procura.",
      },
    ],
  });
})(typeof window !== "undefined" ? window : globalThis);
