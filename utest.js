var uTest = {
   testGroups:    {},

   failCount:     0,
   runCount:      0,
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

   runAllTests: function () {
      this.run(null, null);
   },

   runTestGroup: function (groupName) {
      this.run(groupName, null);
   },

   runTest: function (test) {
      var   groupName = null,
            testName = null;

      if (typeof test === "string") {

         testName = test;

      } else if (typeof test === "object") {

         if ("group" in test) {
            groupName = test.group;
         }

         if ("name" in test) {
            testName = test.name;
         }
      }

      if (testName !== null) {
         this.run(groupName, testName);
      }
   },

   run: function (groupName, testName) {
      var tests;

      this.resetResults();

      tests = this.findTests(groupName, testName);

      for (var i = 0; i < tests.length; i++) {
         this.runTestObj(tests[i]);
      }

      this.logResults(groupName, testName);
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

   findTests: function (groupName, testName) {
      var matchingTests = [ ];

      for (var name in this.testGroups) {

         if ((groupName === null) || (name === groupName)) {

            for (var i = 0; i < this.testGroups[name].tests.length; i++) {

               if ((testName === null) || (this.testGroups[name].tests[i].name == testName)) {

                  matchingTests.push(this.testGroups[name].tests[i]);
               }
            }
         }
      }

      return matchingTests;
   },

   getTestCount: function () {
      var count = 0;

      for (var groupName in this.testGroups) {
         count += this.testGroups[groupName].tests.length;
      }

      return count;
   },

   getCheckCount: function (groupName, testName) {
      var count = 0;

      for (var name in this.testGroups) {

         if ((groupName === null) || (name === groupName)) {

            if (typeof this.testGroups[name].setup === "function") {
               count += this.countChecksIn(this.testGroups[name].setup);
            }

            if (typeof this.testGroups[name].teardown === "function") {
               count += this.countChecksIn(this.testGroups[name].teardown);
            }

            for (var i = 0; i < this.testGroups[name].tests.length; i++) {

               if ((testName === null) || (this.testGroups[name].tests[i].name == testName)) {

                  if (typeof this.testGroups[name].tests[i].run === "function") {

                     count += this.countChecksIn(this.testGroups[name].tests[i].run);
                  }
               }
            }
         }
      }

      return count;
   },

   countChecksIn: function (func) {
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
      this.ignoreCount  = 0;
      this.startTime    = Date.now();
   },

   logResults: function (groupName, testName) {
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

      results += this.getCheckCount(groupName, testName);
      if (this.getCheckCount(groupName, testName) === 1) {
         results += " check, ";
      } else {
         results += " checks, ";
      }

      results += this.ignoreCount + " ignored, ";
      results += this.getTestCount() - this.runCount + " filtered out, ";
      results += Date.now() - this.startTime + " ms)\n\n";

      console.log(results);
   },

   runTestObj: function (test) {
      var group = this.testGroups[test.group];

      this.currentGroup = test.group;
      this.currentTest  = test.name;

      this.runCount++;

      try {

         if (typeof group.setup === "function") {
            group.setup();
         }

         if (typeof test.run === "function") {
            test.run();
         }

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
};
