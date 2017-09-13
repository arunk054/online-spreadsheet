Exp.FireUnitTests = {};

Exp.FireUnitTests.tests = function() {
    fireunit.ok(numExp(5).number === 5, "e1");
    fireunit.ok(indexExp(3, 5).row === 3, "e2");
    fireunit.ok(indexExp(3, 5).col === 5, "e3");
    fireunit.ok(strExp("hello").string === "hello", "e4");

    // equality tests
    fireunit.ok(numExp(3).isEqualTo(numExp(3)),  "eq1");
    fireunit.ok(!(numExp(3).isEqualTo(numExp(4))),  "eq2");
    fireunit.ok(!(numExp(3).isEqualTo(strExp("hi"))),  "eq3");

    fireunit.ok(indexExp(0,3).isEqualTo(indexExp(0,3)), "eq4");
    fireunit.ok(!(indexExp(0,3).isEqualTo(numExp(3))), "eq5");
    fireunit.ok(opExp("+", [numExp(3), numExp(4)]).
		isEqualTo(opExp("+", [numExp(3), numExp(4)])), "eq6");

    fireunit.ok(opExp("+", [numExp(3), numExp(4)]).
		isEqualTo(opExp("+", [numExp(3), numExp(4)])), "eq7");


    fireunit.ok(opExp("+", [numExp(3)]).
		isEqualTo(opExp("+", [numExp(3), numExp(4)])) === false, "eq8");



    fireunit.ok(opExp("+", [numExp(3), indexExp(1,4)]).
		isEqualTo(opExp("+", [numExp(3), indexExp(1,4)])), "eq9");

    // show tests

    fireunit.ok(numExp(4).show() === "4", "s1");
    fireunit.ok(strExp("hello").show() === "\"hello\"", "s2");
    fireunit.ok(indexExp(3,0).show() === "A4", "s3");
    fireunit.ok(indexExp(2,3).show() === "D3", "s4");
    fireunit.ok(opExp("+",[numExp(3), numExp(4)]).show() === "(+ 3 4)", "s5");
    fireunit.ok(opExp("+",[numExp(3), indexExp(0, 2)]).show() === "(+ 3 C1)", "s6");

    // evaluation
    fireunit.ok(opExp("+", [numExp(3), numExp(5)]).evalExp() == 8, "e1");
};


// var c1 = numCell(1, "c1");
// var c2 = numCell(2, "c1");
// var c3 = formulaCell(cellExp(c1), "c3");
// var c4 = formulaCell(plusExp(cellExp(c2), cellExp(c3)), "c4");

// var f1 = plusExp(indexExp(3,4), numExp(89));
// var f2 = plusExp(f1, indexExp(0,3));






