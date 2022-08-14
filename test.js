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

function charLookUp(charToCheck, lookUpString) {
    for (let i = 0; i < lookUpString.length; i++) {
        if (charToCheck == lookUpString[i]) {
            return true;
        }
    }
    return false;
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
    var lastPosition = string.length;
    for (let i = stringStart; i < string.length; i++) {
        if (charLookUp(string[i], "=;?:")) {
            lastPosition = i;
            break;
        }
    }

    for (let i = lastPosition - 1; i >= stringStart; i--) {
        if (!charLookUp(string[i], " " + "=;?:")) {
            lastPosition = i + 1;
            break;
        }
    }

    return lastPosition;
}


function getCondition(string, isWholeTernary, returnOrVariable) {
    function conditionFindStart(string) {
        if (isWholeTernary) {
            if (returnOrVariable == "return ") {
                for (let i = 0; i < string.length; i++) {
                    if (string.slice(i, i + 7) == "return ") {
                        return i + 7;
                    }
                }
            } else if (returnOrVariable != undefined) {
                for (let i = 0; i < string.length; i++) {
                    if (charLookUp(string[i], "=")) {
                        return i + 1;
                    }
                }
            }
        }
        return 0;
    }

    function conditionFindEnd(string) {
        for (let i = 0; i < string.length; i++) {
            if (charLookUp(string[i], "?")) {
                return i;
            }
        }
    }
    let conditionStart = conditionFindStart(string);

    if (conditionStart == -1) {
        conditionStart = conditionFindStart(string);
    }

    let conditionEnd = conditionFindEnd(string, conditionStart);

    let result = string.substring(conditionStart, conditionEnd);
    let cleanedResult = result.trim();

    return cleanedResult;
}




function isTernary(string) {
    for (let i = 0; i < string.length; i++) {
        if (string[i] == "?") {
            return true;
        }
    }
    return false;
}

function getTrue(string, returnOrVariable) {
    function trueFindEnd(string, start) {
        ternaryCounter = 0;
        for (let i = start; i < string.length; i++) {
            if (charLookUp(string[i], "?")) {
                ternaryCounter++;
            }
            if (charLookUp(string[i], ":")) {
                if (ternaryCounter == 0) {
                    return i;
                }
                ternaryCounter--;
            }
        }
    }

    let trueStart = findStart(string, "?", 1);
    let trueEnd = trueFindEnd(string, trueStart);
    let result = string.substring(trueStart, trueEnd);
    let cleanedResult = result.trim();

    cleanedResult = convertMultiTernary(cleanedResult, false, returnOrVariable);
    return cleanedResult;
}



function getFalse(string, returnOrVariable) {
    function falseFindStart(string) {
        ternaryCounter = 0;
        for (let i = 0; i < string.length; i++) {
            if (charLookUp(string[i], "?")) {
                ternaryCounter++;
            }
            if (charLookUp(string[i], ":")) {
                ternaryCounter--;
                if (ternaryCounter == 0) {
                    return i + 1;
                }
            }
        }
    }

    function falseFindEnd(string, start) {
        ternaryCounter = 0;
        for (let i = start; i < string.length; i++) {
            if (charLookUp(string[i], "?")) {
                ternaryCounter++;
            }
            if (charLookUp(string[i], ":")) {
                ternaryCounter--;
                if (ternaryCounter == 0) {
                    return i;
                }
            }
        }
    }

    let falseStart = falseFindStart(string);
    let falseEnd = string.length;
    let result = string.substring(falseStart, falseEnd);
    let cleanedResult = result.trim();
    cleanedResult = convertMultiTernary(cleanedResult, false, returnOrVariable);
    return cleanedResult;
}


function addTabs(string, amount) {
    for (let i = 0; i < amount; i++) {
        string += "\t";
    }

    return string;
}

function getReturnOrVariable(string) {
    function getStart(type) {
        for (let i = 0; i < string.length; i++) {
            if (string[i] + string[i + 1] + string[i + 2] == type) {
                return i + 3;
            }
        }
        for (let i = start; i < string.length; i++) {
            if (string[i] != " ") {
                start = i;
            }
        }

        return start;
    }

    function findEnd() {
        for (let i = 0; i < string.length; i++) {
            if (charLookUp(string[i], "=")) {
                return i;
            }
        }
    }

    if (string.indexOf("return ") != -1) {
        return "return ";
    }
    if (string.indexOf("let ") != -1) {
        let start = getStart("let");
        let end = findEnd();
        let result = string.substring(start, end);
        let cleanedResult = result.trim();
        return cleanedResult + " = ";
    }
    if (string.indexOf("var ") != -1) {
        let start = getStart("var");
        let end = findEnd();
        let result = string.substring(start, end);
        let cleanedResult = result.trim();
        return cleanedResult + " = ";
    }
}

function convertMultiTernary(string, isWholeTernary, returnOrVariable) {
    let lines = [];

    if (isWholeTernary) {
        returnOrVariable = getReturnOrVariable(string);
    }

    if (isTernary(string)) {
        let conditionF = getCondition(string, isWholeTernary, returnOrVariable);

        let trueF = getTrue(string, returnOrVariable);
        let falseF = getFalse(string, returnOrVariable);


        lines.push("if(" + conditionF + "){\n");

        trueF.forEach(function(item, index, array) {
            lines.push("\t" + item)
        });


        lines.push("}else{\n");


        falseF.forEach(function(item, index, array) {
            lines.push("\t" + item)
        });

        lines.push("}\n");
    } else {
        if (returnOrVariable == undefined) {
            lines.push(string + ";\n");
        } else {
            lines.push(returnOrVariable + string + ";\n");
        }

    }

    if (isWholeTernary) {
        let result = "";

        lines.forEach(function(item, index, array) {
            result += item
        });


        return result;
    }

    return lines;
}

function singleTernaryTest(string) {
    return convertTernary(string);
}

function alwaysTrueTest(string) {
    return convertTernary(string);
}

function alwaysFalseTest(string) {
    return convertTernary(string);
}

function multiTernaryTest(string) {
    return convertMultiTernary(string, true, "return ");
}

function findEndTests() {
    showTest(findEndTest, "a   ");
    showTest(findEndTest, "a;   ");
    showTest(findEndTest, " a;");
    showTest(findEndTest, "abcd");
    showTest(findEndTest, "abcd   ");
    showTest(findEndTest, "abcd;");
    showTest(findEndTest, ".abcd ;");
    showTest(findEndTest, "ab,   cd;");
    showTest(findEndTest, "(a && b)   ");
    showTest(findEndTest, "a?b?c:d");
}

function singleTernaryTests() {
    showTest(singleTernaryTest, "var a = b?c:d");
    showTest(singleTernaryTest, "var z = c?d:e");
    showTest(singleTernaryTest, " var z = c?d:e");
    showTest(singleTernaryTest, " var    z=  c  ? d: e");
    showTest(singleTernaryTest, " var    z=  c  ? 10: 20");
    showTest(singleTernaryTest, " c  ? 10: 20");
    showTest(singleTernaryTest, "true  ? beta(): gamma()");
    showTest(singleTernaryTest, " let z = true?d:e");
    showTest(singleTernaryTest, "let z = (a && b)?(a&&b):(a&&b)");
    showTest(singleTernaryTest, "c ? km.saveNumber(20, ks) : ks");
}

function alwaysTrueTests() {
    showTest(alwaysTrueTest, "true?a:b;");
    showTest(alwaysTrueTest, "var x = true?a:b;");
}

function alwaysFalseTests() {
    showTest(alwaysFalseTest, "var x = false?a:b;");
}

function multiTernaryTests() {
    showTest(multiTernaryTest, "kk ? window.webkit.messageHandlers.iosCommandA.postMessage('username' + c) : 12 <= kn ? (km.saveString(20, c), km.setState(10)) : 5 <= kn ? km.saveString(0, c) : (d4.zS(0, c), d4.zQ())");
}

function onLoad() {
    startP = document.getElementById("StartForTests");

    //findEndTests();
    //singleTernaryTests();
    //alwaysTrueTests();
    //alwaysFalseTests();
    multiTernaryTests();

    var x = (true ? true : true) ? false : true;
}