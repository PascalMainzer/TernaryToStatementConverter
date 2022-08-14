var ternaryCodeField = document.getElementById("ternaryCode");
var statementCodeField = document.getElementById("statementCode");
var body = document.getElementById("body");
body.addEventListener("load", onLoad())

function onLoad() {

}

function onClick() {
    var ternary = ternaryCodeField.value;
    console.log(ternary)

    var statement = "";

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

    statement = convertMultiTernary(ternary, true)

    statementCodeField.innerHTML = statement;
}