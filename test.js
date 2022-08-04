function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

var body = document.getElementById("body");

body.addEventListener("load", onLoad());

var startP;

function showTest(testFunction, testString) {
    var result = testFunction(testString);

    var element = document.createElement("h1");
    var content = document.createTextNode(testFunction.name + "# " + testString);
    element.appendChild(content);
    insertAfter(element, startP);
    startP = element;

    element = document.createElement("p");
    content = document.createTextNode("Result:\n" + result);
    element.appendChild(content);
    insertAfter(element, startP);
    startP = element;
}



function isTerminator(charToCheck) {
    var lookUpVariableTerminator = " ?:=;"
    for (let terminator = 0; terminator < lookUpVariableTerminator.length; terminator++) {
        if (charToCheck == lookUpVariableTerminator[terminator]) {
            return true;
        }
    }
}

function findStart(string, wordBeforeVariable, wordLength) {
    var indexOfVar;
    if (wordBeforeVariable == "") {
        indexOfVar = 0;
    }
    indexOfVar = string.indexOf(wordBeforeVariable);
    if (indexOfVar == -1) {
        return -1;
    }

    for (let i = indexOfVar + wordLength; i < string.length; i++) {
        if (string[i] != " ") {
            return i;
        }
    }
}

function findEnd(string, stringStart) {
    for (let charPosition = stringStart; charPosition < string.length; charPosition++) {
        if (isTerminator(string[charPosition])) {
            return charPosition;
        }
    }
}

function getVariable(string, variableType) {
    if (variableType != "") {
        var variableStart = findStart(string, variableType + " ", 3);
        var variableEnd = findEnd(string, variableStart);
        return string.substring(variableStart, variableEnd);
    }

    return "";
}

function getCondition(string) {
    var conditionStart;

    conditionStart = findStart(string, "=", 1);

    if (conditionStart == -1) {
        conditionStart = findStart(string, "", 0);
    }
    var conditionEnd = findEnd(string, conditionStart);
    return string.substring(conditionStart, conditionEnd);
}

function getTrue(string) {
    var trueStart = findStart(string, "?", 1);
    var trueEnd = findEnd(string, trueStart);
    return string.substring(trueStart, trueEnd);
}

function getFalse(string) {
    var falseStart = findStart(string, ":", 1);
    var falseEnd = findEnd(string, falseStart);
    return string.substring(falseStart, falseEnd);
}

function getVariableType(string) {
    var variableStart = findStart(string, "var ", 3);
    if (variableStart != -1) {
        return "var"
    }
    variableStart = findStart(string, "let ", 3);
    if (variableStart != -1) {
        return "let"
    }
    return "";
}

function singleTernaryTest(string) {
    var result = "";
    var variableType = getVariableType(string);

    var variableF = getVariable(string, variableType);
    if (variableF != "") {
        result += variableType + " ";
        result += variableF;
        result += ";\n\n"
    }

    var conditionF = getCondition(string);
    result += "if( "
    result += conditionF;
    result += " )"

    var trueF = getTrue(string);
    result += "{\n\t";
    if (variableF != "") {
        result += variableF + " = ";
    }
    result += trueF;
    result += ";\n}";

    var falseF = getFalse(string);
    result += "else{\n\t";
    if (variableF != "") {
        result += variableF + " = ";
    }
    result += falseF;
    result += ";\n}"
    return result;
}

function alwaysTrueTest(string) {
    var result = "";
    var variableType = getVariableType(string);

    var variableF = getVariable(string, variableType);
    if (variableF != "") {
        result += variableType + " ";
        result += variableF;
        result += ";\n\n"
    }

    var conditionF = getCondition(string);

    result += "if( "
    result += conditionF;
    result += " )"

    var trueF = getTrue(string);
    result += "{\n\t";
    if (variableF != "") {
        result += variableF + " = ";
    }
    result += trueF;
    result += ";\n}";

    var falseF = getFalse(string);
    result += "else{\n\t";
    if (variableF != "") {
        result += variableF + " = ";
    }
    result += falseF;
    result += ";\n}"
    return result;
}

function onLoad() {
    startP = document.getElementById("StartForTests");

    showTest(singleTernaryTest, "var a = b?c:d");
    showTest(singleTernaryTest, "var z = c?d:e");
    showTest(singleTernaryTest, " var z = c?d:e");
    showTest(singleTernaryTest, " var    z=  c  ? d: e");
    showTest(singleTernaryTest, " var    z=  c  ? 10: 20");
    showTest(singleTernaryTest, " c  ? 10: 20");
    showTest(singleTernaryTest, "true  ? beta(): gamma()");
    showTest(singleTernaryTest, " let z = true?d:e");
    showTest(singleTernaryTest, "let z = (a&&b)?(a&&b):(a&&b)");
    showTest(alwaysTrueTest, "true?a:b;");
}