# Online Spreadsheet
Web Based Online Spread Sheet Application

The project aims to create an online spread sheet application where users can add / delete rows & columns, perform arithmetic operations, evaluate expressions, summations, etc. The users can save their work and retrieve it later.  Developed using Java script, Ajax, Html, JSON and Yahoo User Interface (YUI) libraries. A key feature is the automatic updation of dependent cells and detection of cyclic dependencies using data dependency graphs. The user interface supports intuitive operations like right click to insert rows, double click to select cells, menus, etc. For data persistence, we use a java script based server like  ‘Plain Old Webserver’ or ‘Browser Server’. The input to the cells of the spreadsheet accepts the following grammar,

Input Grammar (BNF)

Number :: = range(0-9)

Operators::=+, *, -, /,

Alpha ::= range(A-Z)|range(a-z)

Address :: = sequence(repeat1(Alpha),Number)

Expression ::= wsequence(“(”,Operators, Address|Number|Expression, Address|Number|Expression, “)”)

Keywords ::= “SUM”|”PROD”

Functions ::= wsequence(“(“,Keywords, Address, Address, “)”)

Formula ::= Number|Address|Expression|Functions

For example, an expression could be (+ 2 3), which evaluates to 5. It could also be a nested expression like (* 3 (+ 4 5)) which evaluates to 27. Cell addresses are specified as <col num><row name >, for example, A1 represents cell at column A and row 1. Hence an expression that uses cell address could be (+ A1 4).
