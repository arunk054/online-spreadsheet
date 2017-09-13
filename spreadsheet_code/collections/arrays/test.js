// Adapted from:
// http://stephenwalther.com/blog/archive/2009/05/18/unit-testing-javascript-with-fireunit.aspx

var ArrayTest = {};

ArrayTest.FireUnitTests = {};

ArrayTest.FireUnitTests.testIsEqualTo  = 
    function() {

    // Arrange
    // Act
    // Assert
    fireunit.ok([].isEqualTo([]), "[].isEqualTo([])");
    fireunit.ok(['a'].isEqualTo(['a']), "[a].isEqualTo(['a'])");
    fireunit.ok([1,2,3].isEqualTo([1,2,3]), "[1,2,3].isEqualTo([1,2,3])");
};

ArrayTest.FireUnitTests.testReverse = 
    function() {

    // Arrange
    // Act
    // Assert
    fireunit.ok([].reverse().isEqualTo([]), "[].reverse");
    fireunit.ok(['a'].reverse().isEqualTo(['a']), "[a].reverse");
    fireunit.ok([1,2,3].reverse().isEqualTo([3,2,1]), "[1,2,3].reverse");
};


ArrayTest.FireUnitTests.testForEachIndex = 
    function() {

    // Arrange
    var a = [1, 2, 3];
    // Act
    a.forEachIndex(function(i) {this[i] = this[i] + i;});
    // Assert
    fireunit.ok(a.isEqualTo([1, 3, 5]), "forEachIndex-1");
};


ArrayTest.FireUnitTests.mapMethod =  
    function() {
    var a = {x : 4};
    a.foo = function(y) {return a.x + y;};
    var ans = [a].mapMethod('foo', 5);
    fireunit.ok(ans.isEqualTo([9]), "mapMethod");
};


ArrayTest.FireUnitTests.andormap =  
    function() {
    var eq2  = function(x) {return x === 2;};
    fireunit.ok([].andmap(eq2), "andmap1");
    fireunit.ok([2].andmap(eq2), "andmap2");
    fireunit.ok(!([2,3].andmap(eq2)), "andmap3");

    fireunit.ok(!([].ormap(eq2)), "ormap1");
    fireunit.ok([2].ormap(eq2), "ormap2");
    fireunit.ok([2,3].ormap(eq2), "ormap3");

};


ArrayTest.FireUnitTests.andormapMethod =  
    function() {
    var eq2  = function() {return this.x === 2;};

    var a = {x:2};
    a.eq2 = eq2;

    var b = {x:3};
    b.eq2 = eq2;

    fireunit.ok([].andmap("eq2"), "andmapMethod1");
    fireunit.ok([a].andmap("eq2"), "andmapMethod2");
    fireunit.ok(!([a,b].andmap("eq2")), "andmapMethod3");

    fireunit.ok((![].ormap("eq2")), "ormapMethod1");
    fireunit.ok([a].ormap("eq2"), "ormapMethod2");
    fireunit.ok([a,b].ormap("eq2"), "ormapMethod3");

};




ArrayTest.FireUnitTests.mapf =  
    function() {


    var add = function(x,y) {return x + y;};
    fireunit.ok(Array.mapf(add, [], []).isEqualTo([]), "mapf1");
    fireunit.ok(Array.mapf(add, [1, 2], [3, 4]).isEqualTo([4, 6]), "mapf2");
};



// fireunit.testDone();

// fireunit.runTests("test2.html", "test3.html");     