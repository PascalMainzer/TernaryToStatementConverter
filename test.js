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
    var findStart = function(stringBefore, wordLength) {
        var indexOfVar = string.indexOf(stringBefore);
        var stringStart;
        for (let i = indexOfVar + wordLength; i < string.length; i++) {
            if (string[i] != " ") {
                stringStart = i;
                break;
            }
        }
        return stringStart;
    }

    var lookUpVariableTerminator = " ?:="

    var findEnd = function(stringStart) {
        var stringEnd;
        for (let i = stringStart; i < string.length; i++) {
            for (let e = 0; e < lookUpVariableTerminator.length; e++) {
                if (string[i] == lookUpVariableTerminator[e]) {
                    stringEnd = i;
                }
            }
            if (stringEnd != null) {
                break;
            }
        }
        return stringEnd;
    }
    var variableStart = findStart("var ", 3);
    var variableEnd = findEnd(variableStart);
    var variableName = string.substring(variableStart, variableEnd);

    var conditionStart = findStart("=", 1);
    var conditionEnd = findEnd(conditionStart);
    var condition = string.substring(conditionStart, conditionEnd);

    var trueStart = findStart("?", 1);
    var trueEnd = findEnd(trueStart);
    var trueValue = string.substring(trueStart, trueEnd);

    var falseStart = findStart(":", 1);
    var falseEnd = findEnd(falseStart)
    var falseValue = string.substring(falseStart, falseEnd);


    return "var " + variableName + ";\n\n" +
        "if(" + condition + "){\n\t" +
        variableName + " = " + trueValue +
        ";\n} else {\n\t" +
        variableName + " = " + falseValue + ";\n}";
}


function onLoad() {
    startP = document.getElementById("StartForTests");

    showTest(singleTernaryTest, "var a = b?c:d");
    showTest(singleTernaryTest, "var z = c?d:e");
    showTest(singleTernaryTest, " var z = c?d:e");
    showTest(singleTernaryTest, " var    z=  c  ? d: e");
    showTest(singleTernaryTest, " var    z=  c  ? 10: 20");
}