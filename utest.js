var uTest = {
   testGroups:    {},

   failCount:     0,

   runCount:      0,

   checkCount:    0,

   ignoreCount:   0,

   startTime:     0,

   TEST_GROUP: function (group) {
      group.tests = [ ];
      this.testGroups[group.name] = group;
   },

   TEST: function (test) {
      test.group = test.group;
      this.testGroups[test.group].tests.push(test);
   },

   CHECK: function (condition) {
      var errorString;

      if (condition !== true) {
         errorString = this.buildErrorString() + "\tCHECK failed";
         this.throwTestError(errorString);
      }
   },

   CHECK_TEXT: function (condition, text) {
      var errorString;

      if (condition !== true) {
         errorString = this.buildErrorString() + "\tMessage: " + text + "\n\tCHECK failed";
         this.throwTestError(errorString);
      }
   },

   CHECK_EQUAL: function (expected, actual) {
      var errorString;

      if (expected !== actual) {
         errorString = this.buildErrorString() +   "\texpected <" + expected  + ">\n" +
                                                   "\tbut was  <" + actual    + ">";
         this.throwTestError(errorString);
      }
   },

   STRCMP_EQUAL: function (expected, actual) {
      var errorString;

      if (expected.toString() !== actual.toString()) {
         errorString = this.buildErrorString() +   "\texpected <" + expected.toString()   + ">\n" +
                                                   "\tbut was  <" + actual.toString()     + ">";
         this.throwTestError(errorString);
      }
   },

   LONGS_EQUAL: function (expected, actual) {
      var errorString;

      if (Math.floor(expected) !== Math.floor(actual)) {
         errorString = this.buildErrorString() +   "\texpected <" + Math.floor(expected)  + ">\n" +
                                                   "\tbut was  <" + Math.floor(actual)    + ">";
         this.throwTestError(errorString);
      }
   },

   BYTES_EQUAL: function (expected, actual) {
      this.LONGS_EQUAL(expected & 0xFF, actual & 0xFF);
   },

   DOUBLES_EQUAL: function (expected, actual, tolerance) {
      var errorString;

      if (Math.abs(expected - actual) > tolerance) {
         errorString = this.buildErrorString() +   "\texpected <" + expected  + ">\n"  +
                                                   "\tbut was  <" + actual    + ">"    +
                                                   " threshold was <" + tolerance + ">";
         this.throwTestError(errorString);
      }
   },

   FAIL: function (text) {
      var errorString = this.buildErrorString() + "\t" + text;
      this.throwTestError(errorString);
   },

   TestError: function (message) {
      this.name = "TestError";
      this.message = message + "\n";
   },

   throwTestError: function (message) {
      if (this.TestError.prototype.toString() !== "Error") {
         this.TestError.prototype = new Error();
      }
      throw new this.TestError(message);
   },

   buildErrorString: function () {
      var   error = (function () { try { throw new Error(); } catch (ex) {return ex;}})(),
            errorString = "",
            callerLines,
            matches;

      if (error.stack) {
         callerLines = error.stack.split("\n")[4];
         matches = callerLines.match(/\((.*)\)/);
         if (matches !== null) {
            errorString += matches[1] + ": ";
         }
      }

      errorString += "error: Failure in TEST(";
      errorString += this.currentGroup + ", ";
      errorString += this.currentTest + ")\n";

      return errorString;
   },

   findTestByName: function (testName) {
      for (var groupName in this.testGroups) {

         for (var i = 0; i < this.testGroups[groupName].tests.length; i++) {

            if (this.testGroups[groupName].tests[i].name == testName) {
               return this.testGroups[groupName].tests[i];
            }
         }
      }
      return null;
   },

   getTestCount: function () {
      var count = 0;

      for (var groupName in this.testGroups) {
         count += this.testGroups[groupName].tests.length;
      }

      return count;
   },

   countChecks: function (func) {
      var   count = 0,
            re,
            reStr,
            functionStr,
            matches;

      reStr =  "uTest\\.(CHECK"     +
               "|CHECK_TEXT"        +
               "|CHECK_EQUAL"       +
               "|STRCMP_EQUAL"      +
               "|LONGS_EQUAL"       +
               "|BYTES_EQUAL"       +
               "|DOUBLES_EQUAL"     +
               "|FAIL"              +
               ")";

      re = new RegExp(reStr, "g");

      functionStr = '' + func;
      matches = functionStr.match(re);

      if (matches !== null) {
         count += matches.length;
      }

      return count;
   },

   resetResults: function () {
      this.failCount    = 0;
      this.runCount     = 0;
      this.checkCount   = 0;
      this.ignoreCount  = 0;
      this.startTime    = Date.now();
   },

   logResults: function () {
      var results;

      if (this.failCount > 0) {
         results =   "Errors ("     +
                     this.failCount;
         if (this.failCount === 1) {
            results += " failure, ";
         } else {
            results += " failures, ";
         }
      } else {
         results = "OK (";
      }

      results += this.getTestCount();
      if (this.getTestCount() === 1) {
         results += " test, ";
      } else {
         results += " tests, ";
      }

      results += this.runCount + " ran, ";

      results += this.checkCount;
      if (this.checkCount === 1) {
         results += " check, ";
      } else {
         results += " checks, ";
      }

      results += this.ignoreCount + " ignored, ";
      results += this.getTestCount() - this.runCount + " filtered out, ";
      results += Date.now() - this.startTime + " ms)\n\n";

      console.log(results);
   },

   runAllTests: function () {
      this.resetResults();

      for (var groupName in this.testGroups) {
         this.runTestGroup(this.testGroups[groupName]);
      }

      this.logResults();
   },

   runTestGroup: function (group) {
      var log = false;

      if (typeof group === "string") {
         group = this.testGroups[group];

         this.resetResults();

         log = true;
      }

      this.currentGroup = group.name;

      if (typeof group.setup === "function") {
         this.checkCount += this.countChecks(group.setup);
      }

      if (typeof group.teardown === "function") {
         this.checkCount += this.countChecks(group.teardown);
      }

      for (var i = 0; i < group.tests.length; i++) {
         this.currentTest = group.tests[i].name;

         this.runCount++;

         try {
            if (typeof group.setup === "function") {
               group.setup();
            }

            this.runTest(group.tests[i]);

            if (typeof group.teardown === "function") {
               group.teardown();
            }
         } catch (ex) {
            if (ex instanceof this.TestError) {
               console.log(ex.message);
               this.failCount++;
            } else {
               throw ex;
            }
         }
      }

      if (log) {
         this.logResults();
      }
   },

   runTest: function (test) {
      var log = false;

      if (typeof test === "string") {
         test = this.findTestByName(test);
         if (test === null) {
            return;
         }

         this.currentTest = test.name;

         this.resetResults();
         log = true;

         this.runCount++;
      }

      try {
         if (typeof test.run === "function") {
            this.checkCount += this.countChecks(test.run);
            test.run();
         }
      } catch (ex) {
         if (ex instanceof this.TestError) {
            console.log(ex.message);
            this.failCount++;
         } else {
            throw ex;
         }
      }

      if (log) {
         this.logResults();
      }
   }
};
