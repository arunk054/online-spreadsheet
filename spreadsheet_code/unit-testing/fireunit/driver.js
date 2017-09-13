/*
 * Driver for FireUnit.  Takes an object and runs all the
 * object's own methods, and invokes testDone() at the
 * end of that.
 * 
 */

var FireUnit = {
      runTests :    
      function(o) {
          var propName;
          for (propName in o) {
              if (o.hasOwnMethod(propName)) {
                  o[propName]();
              };
          };
          fireunit.testDone();
      }
};