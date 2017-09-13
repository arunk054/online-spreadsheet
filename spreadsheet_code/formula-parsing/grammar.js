// Grammar Specification for Formula Expressions
// =============================================



// ------------------------------------------------------------------------
// Adapted from es3.js written by Chris Double (see copyright notice below)
// ------------------------------------------------------------------------

// Copyright (C) 2007 Chris Double.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// 
// 1. Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
// 
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
// 
// THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// DEVELOPERS AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

//The Spread shet grammar is defined as follows

/*<Exp>  ::= <natural number> | <Addr>  | (<op> <Exp> <Exp>)

<Addr> ::= <Alpha>+ <Integer>
<Alpha> ::= [a-z]  | [A-Z]

<op>   ::= + - * / % SUM PROD

<N>+ means one  or more of <N>
<N>* means zero or more of <N>
<N>? means 0 or one of <N>
|  means choice
*/


// Natural Numbers
// ---------------

var NonZeroDigit = range("1","9");
var DecimalDigit = choice(NonZeroDigit,"0");

/*
//The first and lsb digits are seperated because we dont want user to enter integer starting with 0 eg: 056
//But commented because unable to take care of case where input is just 1 digit and equal to 0
var LSBDigits = join_action(repeat1(DecimalDigit), "");
var DecimalDigits = join_action(sequence(NonZeroDigit,LSBDigits),"");
*/

var DecimalDigits = join_action(repeat1(DecimalDigit), "");
var Sign = choice("+", "-");
var IntegerLiteral = action(sequence(optional(Sign), DecimalDigits),
                           function(ast) {
                               var maybeSign = ast[0];
                               var sign = maybeSign ? maybeSign : "";
                               return numExp(parseInt(sign.concat(ast[1]), 10));
                           });

// op
// ----------

var operators = ["+", "-", "*", "/", "%"];
var KeyWordsArr = ["SUM", "PROD","sum","prod"];
var op  = action(choice(operators), function(s) {return s;});
var KeyWords = action(choice(KeyWordsArr), function(s) {return s.toUpperCase();});
// Addr
//-----------------------

var Alpha = choice(range("A", "Z"),range("a","z"));

//eg: var p = Address(ps("AB91A"));

var Addr =  action(sequence(repeat1(Alpha),DecimalDigits),  function(ast) { 

	//Address can be A1, B34, CF3, having upto two alphabets allows for 702 columns ==> 26*26 + 26 = ZZ
	//In general we can write it as 26^(n-1)*Value(alpha@n) + 26^(n-2)*Value(alpha@n-1) + ... 26^(0)*Value(alpha@1)


	var row = parseInt(ast[1], 10);

	var len = ast[0].length;

	//3 ALPHA itself will cover 26^3 + 26^2 + 26 = 18278 cols, more than enuf for this application
	//But lets restrict to 6 alphas which itself will cover = 321272406 cols, thus prevent spurious inputs
/*	if (len > 6)
		return false;
*/
	var asciiOfA = "A".charCodeAt(0);
	var powCount = 0;
	var value, col = 0;
	for (var i = len-1; i>=0; --i) {
		value = ast[0][i].toUpperCase().charCodeAt(0)-asciiOfA + 1;
		col += Math.pow(26,powCount)*value;
		powCount++;
	}

	//The indexExp takes row index and col index, so sub by 1
	return indexExp(row-1,col-1);

});

var GarbageAddress = action(GarbRefExp.DisplayString, function(ast) { 
	return garbRefExp();
});

var Address = choice(Addr, GarbageAddress);

var NumberLiteral   = IntegerLiteral;

var Atomic = choice(Address, NumberLiteral);

//Forward declaration
var Expression = function (input) { return Expression(input);}

var TempExp = wsequence("(", op, Expression, Expression, ")");

Expression = choice (Atomic,TempExp);


function createOpExp(ast) {
	var rands = [];
	//Handling nested expressions, first check if any of the operand is an array
	if (typeof (ast[2]) != "string" && ast[2].length > 0) {
		rands.push(createOpExp(ast[2]));
	} else {
		rands.push(ast[2]);
	}

	if (typeof (ast[3]) != "string" && ast[3].length > 0) {
		rands.push(createOpExp(ast[3]));
	} else {
		rands.push(ast[3]);
	}
	return opExp(ast[1], rands);
}

var Operation = action(Expression,
   function(ast) {
       return createOpExp(ast);

   });

var createRangeExp = function(ast) {
	//first check if it has a garbref exp,
	if (ast[2].expType === GarbRefExp.expType || ast[3].expType === GarbRefExp.expType)
		return rangeExp(ast[1],ast[2],ast[3],0);

	var direction = -1; //0==> row wise, 1==> column wise axis for range

	//Check if the range is coaxial and direction is incremental
	if (ast[2].row == ast[3].row && ast[2].col <= ast[3].col)
		direction = 0;
	else if (ast[2].col == ast[3].col && ast[2].row <= ast[3].row )
		direction = 1;

	return rangeExp(ast[1],ast[2],ast[3],direction);

}


var Functions = action(wsequence("(", KeyWords, Address, Address, ")"),
   function(ast) {
       return createRangeExp(ast);

   });

var Formula = choice(Atomic, Operation, Functions);


