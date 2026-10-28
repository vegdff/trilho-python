# Trilho Python

Aplicação web para alunos treinarem os básicos de Python: 21 mundos, 112 desafios, XP e níveis. É um site estático (sem servidor nem base de dados): o Python corre no próprio navegador do aluno.

## O que tem

Os mundos seguem a ordem do caderno: print e comentários, variáveis, tipos, conversões, input, operadores, comparações, depois as decisões em quatro passos (`if`, `if/else`, `elif`, lógica avançada), listas, tuplos, conjuntos, dicionários, `while` em três passos e `for` em três passos. Não há desafio final: ao longo de cada estrutura (variáveis, `if`, `elif`, listas, dicionários, `while`, `for`) há exercícios de **quadro de traçagem**.

Os exercícios alternam seis tipos: prever o resultado, recriar de memória, ordenar linhas (Parsons), corrigir erros, programar e preencher o quadro de traçagem. Há dicas, feedback automático em português e, ao fim de 3 tentativas falhadas, a opção de ver a solução (o exercício fica como «saltado», sem XP). Só há XP e níveis (100 XP por nível, mais 5 XP de bónus por acertar à primeira e sem ajuda).

O aluno escolhe tema claro, escuro ou automático.

## Publicar no GitHub Pages

1. Cria um repositório no GitHub (por exemplo `trilho-python`) e carrega para lá **todo o conteúdo desta pasta** (o ficheiro `index.html` tem de ficar na raiz do repositório). Se usares o botão «Add file > Upload files», arrasta as pastas todas, incluindo `pyodide`.
2. Em **Settings > Pages**, em «Build and deployment», escolhe **Deploy from a branch**, ramo `main`, pasta `/ (root)` e grava.
3. Passado um minuto o site fica em `https://O-TEU-UTILIZADOR.github.io/trilho-python/`. A área do professor fica em `.../professor.html`.

Para experimentar no teu computador, abre um terminal nesta pasta e corre `python -m http.server 8000`, depois visita `http://localhost:8000`. **Não funciona se abrires o `index.html` com duplo clique**, porque o navegador bloqueia o motor de Python nesse modo.

A primeira visita descarrega cerca de 12 MB (o Python em WebAssembly); depois o navegador guarda-os. Convém testar numa aula, com os portáteis da escola, se o endereço `github.io` está acessível na rede.

## Como funciona o progresso (sem contas)

O progresso fica no `localStorage` do navegador. Para continuar noutro dispositivo, o aluno abre **Progresso**, copia o código (começa por `TP1-`) ou descarrega o ficheiro, e no outro dispositivo cola o código ou escolhe o ficheiro. Os progressos juntam-se: fica o melhor resultado de cada exercício. O código tem uma soma de controlo, por isso erros de cópia são detetados.

Para o professor ver a turma: pede aos alunos que anexem o ficheiro (ou colem o código) numa tarefa do Classroom, descarrega os ficheiros e carrega-os todos de uma vez em `professor.html`. Aí tens a tabela da turma, o mapa de cores por exercício, os exercícios em que mais alunos precisaram de ajuda, exportação para CSV e as soluções.

## Limitações a ter presentes

- Os dados são um retrato do momento em que o aluno exportou. Um aluno consegue alterar o código ou o `localStorage`, por isso serve para uso **formativo**, não para avaliação.
- A página do professor e as soluções não são secretas: estão no código do site público. Um aluno curioso pode vê-las. Se isso for um problema, o repositório pode ser privado (exige plano pago do GitHub para Pages privadas) ou podes remover a pasta de soluções do `professor.js`.
- Como não há servidor, o `input()` é simulado: quando o programa pede uma resposta, o programa corre de novo desde o início com as respostas dadas. Programas muito lentos ou com efeitos aleatórios podem comportar-se de forma estranha. Ciclos infinitos são cortados ao fim de 5 segundos ou de muita saída.
- Só estão disponíveis os módulos padrão do Python (não há `pip` nem bibliotecas externas).
- Foi testado com o motor de Python em Node e com uma simulação do navegador (jsdom); a execução num navegador real, em telemóvel e na rede da escola deve ser verificada antes da primeira aula.

## Editar ou acrescentar exercícios

Os exercícios estão em `js/data/mundos-1.js`, `mundos-2.js` e `mundos-3.js`. Cada exercício tem `type` (`predict`, `recreate`, `parsons`, `debug`, `code`, `trace`), `title`, `prompt`, `hints`, `explain` e os campos do seu tipo (`tests` com `inputs` e `expected`, `solution`, `requires`, `forbid`, etc.). Podes copiar um existente como modelo.

**Regra importante:** os códigos de progresso dependem da ordem dos exercícios. Só acrescenta exercícios **no fim de todos os mundos** (ou cria um novo mundo no fim). Se inseres no meio ou removes, os códigos antigos dos alunos passam a apontar para os exercícios errados.

## Testes (opcional)

Na pasta `dev`: `npm install`, depois
- `node run_tests.mjs` corre a solução de cada exercício contra os seus testes, confirma que os códigos com erros falham, que a opção certa dos exercícios de prever coincide com o resultado real e que os quadros de traçagem estão certos;
- `node ui_test.mjs` resolve todos os exercícios através da interface (simulada) e verifica XP, bloqueios, importação e tema;
- `node test_progress.cjs` testa o código de progresso.

## Créditos

Python no navegador: [Pyodide](https://pyodide.org). Editor: [CodeMirror 5](https://codemirror.net). Ambos estão incluídos nesta pasta, por isso o site não faz pedidos a servidores externos.
