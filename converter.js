var ternaryCodeField = document.getElementById("ternaryCode");
var statementCodeField = document.getElementById("statementCode");
var body = document.getElementById("body");
body.addEventListener("load", onLoad())

function onLoad() {
    var ternary = "var valueBefore = true?'hallu':'ciao';";
    console.log(ternaryCodeField.innerHTML);
    ternaryCodeField.innerHTML = ternary;

    var variableName = getVariableName(ternary);
    var valueIfTrueStart = ternary.indexOf("?") + 1;
    var valueIfTrueEnd = ternary.indexOf(":");
    var valueIfTrue = ternary.substring(valueIfTrueStart, valueIfTrueEnd);
    var statement = "var " + variableName + ";" +
        "\n\n" +
        "if(true){" + "\n" +
        "  " + variableName + "= " + valueIfTrue + ";" + "\n" +
        "}" + "\n" +
        "else{" + "\n" +
        "  " + variableName + "=false;" + "\n" +
        "}";


    statementCodeField.innerHTML = statement;
}

function getVariableName(ternary) {
    var variableNameStart = ternary.indexOf("var ") + 4;
    var variableNameEnd = ternary.indexOf("=");
    var variableName = ternary.substring(variableNameStart, variableNameEnd);
    variableName = variableName.trim();
    return variableName;
}