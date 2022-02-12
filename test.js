var body = document.getElementById("body");
var ternaryResultOutput = document.getElementById("ternaryResult");
var statementResultOutput = document.getElementById("statementResult");

body.addEventListener("load", onLoad());

function onLoad() {
    ternary();
    statement();
}

function ternary() {
    var ternaryResult = "ternary";
    ternaryResultOutput.innerHTML = ternaryResult;
}

function statement() {
    var statementResult = "statement";
    statementResultOutput.innerText = statementResult;
}