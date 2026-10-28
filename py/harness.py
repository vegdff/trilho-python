# Motor de verificação do Trilho Python.
# Corre o código do aluno com entradas simuladas (input), recolhe a saída,
# analisa que construções foram usadas (AST) e devolve tudo em JSON.
# Este ficheiro corre dentro do Pyodide (no navegador) e no Node (testes).

import ast
import contextlib
import io
import json
import tokenize
import traceback

OUTPUT_LIMIT = 20000
FILENAME = "<aluno>"


class NeedInput(BaseException):
    """O programa pediu mais entradas do que as disponíveis."""

    def __init__(self, prompt):
        super().__init__(prompt)
        self.prompt = prompt


class OutputLimit(BaseException):
    """O programa escreveu demasiado texto (provável ciclo infinito)."""


class Out:
    def __init__(self):
        self.prints = []
        self.transcript = []
        self.size = 0

    def write(self, s):
        if not isinstance(s, str):
            s = str(s)
        self.prints.append(s)
        self.transcript.append(s)
        self.size += len(s)
        if self.size > OUTPUT_LIMIT:
            raise OutputLimit()
        return len(s)

    def flush(self):
        pass

    def isatty(self):
        return False


SAFE_TYPES = (int, float, str, bool, list, tuple, set, frozenset, dict, complex, type(None))


def has_comment(source):
    try:
        for tok in tokenize.generate_tokens(io.StringIO(source).readline):
            if tok.type == tokenize.COMMENT:
                return True
    except Exception:
        pass
    return False


def tags_of(tree, source):
    """Devolve o conjunto de construções usadas no código."""
    t = set()
    for n in ast.walk(tree):
        if isinstance(n, ast.If):
            t.add("if")
            if len(n.orelse) == 1 and isinstance(n.orelse[0], ast.If):
                t.add("elif")
            elif n.orelse:
                t.add("else")
            for stmt in n.body:
                for m in ast.walk(stmt):
                    if isinstance(m, ast.If):
                        t.add("nested_if")
        elif isinstance(n, ast.While):
            t.add("while")
        elif isinstance(n, ast.For):
            t.add("for")
        elif isinstance(n, ast.Break):
            t.add("break")
        elif isinstance(n, ast.Continue):
            t.add("continue")
        elif isinstance(n, ast.IfExp):
            t.add("ifexp")
        elif isinstance(n, ast.BoolOp):
            t.add("and" if isinstance(n.op, ast.And) else "or")
        elif isinstance(n, ast.UnaryOp) and isinstance(n.op, ast.Not):
            t.add("not")
        elif isinstance(n, ast.Compare):
            t.add("compare")
            for op in n.ops:
                if isinstance(op, (ast.In, ast.NotIn)):
                    t.add("in")
        elif isinstance(n, ast.AugAssign):
            t.add("augassign")
        elif isinstance(n, ast.BinOp):
            if isinstance(n.op, ast.FloorDiv):
                t.add("floordiv")
            elif isinstance(n.op, ast.Mod):
                t.add("mod")
            elif isinstance(n.op, ast.Pow):
                t.add("pow")
        elif isinstance(n, ast.Subscript):
            t.add("index")
        elif isinstance(n, ast.List):
            t.add("listlit")
        elif isinstance(n, ast.Tuple):
            t.add("tuplelit")
        elif isinstance(n, ast.Dict):
            t.add("dictlit")
        elif isinstance(n, ast.Set):
            t.add("setlit")
        elif isinstance(n, ast.JoinedStr):
            t.add("fstring")
        elif isinstance(n, ast.Call):
            f = n.func
            if isinstance(f, ast.Name):
                t.add(f.id)
            elif isinstance(f, ast.Attribute):
                t.add(f.attr)
    if has_comment(source):
        t.add("comment")
    return t


def _line_of(exc):
    line = None
    try:
        for fr in traceback.extract_tb(exc.__traceback__):
            if fr.filename == FILENAME:
                line = fr.lineno
    except Exception:
        pass
    return line


def run(req):
    source = req.get("source", "")
    inputs = list(req.get("inputs") or [])
    requires = req.get("requires") or []
    forbid = req.get("forbid") or []

    result = {
        "output": "",
        "transcript": "",
        "error": None,
        "need_input": None,
        "vars": {},
        "missing": [],
        "forbidden": [],
    }

    try:
        tree = ast.parse(source, FILENAME)
        code = compile(tree, FILENAME, "exec")
    except SyntaxError as e:
        result["error"] = {
            "type": type(e).__name__,
            "msg": e.msg or str(e),
            "line": e.lineno,
        }
        return result

    found = tags_of(tree, source)
    result["missing"] = [r for r in requires if not any(x in found for x in r.split("|"))]
    result["forbidden"] = [f for f in forbid if f in found]

    out = Out()
    pos = [0]

    def fake_input(prompt=""):
        prompt = str(prompt)
        out.transcript.append(prompt)
        if pos[0] >= len(inputs):
            raise NeedInput(prompt)
        value = str(inputs[pos[0]])
        pos[0] += 1
        out.transcript.append(value + "\n")
        return value

    g = {"__name__": "__main__", "input": fake_input}

    try:
        with contextlib.redirect_stdout(out):
            exec(code, g)
    except NeedInput as e:
        result["need_input"] = e.prompt
    except OutputLimit:
        result["error"] = {
            "type": "OutputLimit",
            "msg": "O programa escreveu demasiado texto",
            "line": None,
        }
    except SystemExit:
        pass
    except BaseException as e:  # noqa: BLE001
        msg = str(e)
        if isinstance(e, KeyError) and e.args:
            msg = repr(e.args[0])
        result["error"] = {
            "type": type(e).__name__,
            "msg": msg,
            "line": _line_of(e),
        }

    result["output"] = "".join(out.prints)
    result["transcript"] = "".join(out.transcript)

    vs = {}
    for k, v in g.items():
        if k.startswith("__") or k == "input":
            continue
        if isinstance(v, SAFE_TYPES):
            r = repr(v)
            vs[k] = r if len(r) <= 300 else r[:300]
    result["vars"] = vs
    return result


def run_json(req_json):
    try:
        req = json.loads(req_json)
        return json.dumps(run(req), ensure_ascii=False)
    except BaseException as e:  # noqa: BLE001
        return json.dumps(
            {
                "output": "",
                "transcript": "",
                "error": {"type": type(e).__name__, "msg": str(e), "line": None},
                "need_input": None,
                "vars": {},
                "missing": [],
                "forbidden": [],
            },
            ensure_ascii=False,
        )
