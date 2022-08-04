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



function singleTernaryTest(string) {
    var lookUpVariableTerminator = " ?:="

    function isTerminator(charToCheck) {
        for (let terminator = 0; terminator < lookUpVariableTerminator.length; terminator++) {
            if (charToCheck == lookUpVariableTerminator[terminator]) {
                return true;
            }
        }
    }
    var findStart = function(string, wordBeforeVariable, wordLength) {
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

    var findEnd = function(string, stringStart) {
        for (let charPosition = stringStart; charPosition < string.length; charPosition++) {
            if (isTerminator(string[charPosition])) {
                return charPosition;
            }
        }
    }

    var getVariable = function(string, variableType) {
        if (variableType != "") {
            var variableStart = findStart(string, variableType + " ", 3);
            var variableEnd = findEnd(string, variableStart);
            return string.substring(variableStart, variableEnd);
        }

        return "";
    }

    var getCondition = function(string) {
        var conditionStart;

        conditionStart = findStart(string, "=", 1);

        if (conditionStart == -1) {
            conditionStart = findStart(string, "", 1);
        }
        var conditionEnd = findEnd(string, conditionStart);
        return string.substring(conditionStart, conditionEnd);
    }

    var getTrue = function(string) {
        var trueStart = findStart(string, "?", 1);
        var trueEnd = findEnd(string, trueStart);
        return string.substring(trueStart, trueEnd);
    }

    var getFalse = function(string) {
        var falseStart = findStart(string, ":", 1);
        var falseEnd = findEnd(string, falseStart)
        return string.substring(falseStart, falseEnd);
    }

    var getVariableType = function(string) {
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
    result += "\n}";

    var falseF = getFalse(string);
    result += "else{\n\t";
    if (variableF != "") {
        result += variableF + " = ";
    }
    result += falseF;
    result += "\n}"
    return result;
}

function alwaysTrueTest(string) {
    return "";
}

function onLoad() {
    startP = document.getElementById("StartForTests");

    showTest(singleTernaryTest, "var a = b?c:d");
    showTest(singleTernaryTest, "var z = c?d:e");
    showTest(singleTernaryTest, " var z = c?d:e");
    showTest(singleTernaryTest, " var    z=  c  ? d: e");
    showTest(singleTernaryTest, " var    z=  c  ? 10: 20");
    showTest(singleTernaryTest, " c  ? 10: 20");
    showTest(singleTernaryTest, " alpha()  ? beta(): gamma()");
    showTest(singleTernaryTest, " let z = true?d:e");
    showTest(singleTernaryTest, "let z = (a&&b)?(a&&b):(a&&b)");
    showTest(alwaysTrueTest, "true?a:b;");
}