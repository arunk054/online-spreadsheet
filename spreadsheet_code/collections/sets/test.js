var SetTest = {};
var s1 = null;
var s2 = null;

SetTest.FireUnitTests = {};

SetTest.FireUnitTests.tests = function() {
    s1 = Set.mkSet(2, 3, 5);
    s2 =  Set.mkSet(3, 2, 5);
    
    fireunit.ok(Set.mkSet().equals(Set.mkSet()), "s1");
    fireunit.ok(Set.mkSet(2).equals(Set.mkSet(2)), "s2");

    fireunit.ok(!Set.mkSet(2).isEmpty(), "s3");
    fireunit.ok(s1.equals(s2), "s4");

    s1.add(5);

    fireunit.ok(s1.equals(s2), "s5");

    s1.add(6);
    fireunit.ok(!s1.equals(s2), "s6");

    fireunit.ok(s2.subsetOf(s1), "s7");

    fireunit.ok(!s1.subsetOf(s2), "s8");

    fireunit.ok(s1.union(s2).equals(Set.mkSet(2, 3, 5, 6)), "s9");

    fireunit.ok(s1.intersection(s2).equals(s2), "s10");

    fireunit.ok(s1.difference(s2).equals(Set.mkSet(6)), "s11");
};


