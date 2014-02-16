var uTest = {
   testGroups:    {},

   failCount:     0,
   runCount:      0,
   checkCont:     0,
   ignoreCount:   0,
   startTime:     0,
   verbose:       false,

   TEST_GROUP: function (group) {
      group.tests = [ ];
      this.testGroups[group.name] = group;
   },

   TEST: function (test) {
      test.ignore = false;
      this.testGroups[test.group].tests.push(test);
   },

   IGNORE_TEST: function (test) {
      test.ignore = true;
      this.testGroups[test.group].tests.push(test);
   },

   CHECK: function (condition) {
      var errorString;

      this.checkCount++;

      if (condition !== true) {
         errorString = this.buildErrorString() + "\tCHECK failed";
         this.throwTestError(errorString);
      }
   },

   CHECK_TEXT: function (condition, text) {
      var errorString;

      this.checkCount++;

      if (condition !== true) {
         errorString = this.buildErrorString() + "\tMessage: " + text + "\n\tCHECK failed";
         this.throwTestError(errorString);
      }
   },

   CHECK_EQUAL: function (expected, actual) {
      var errorString;

      this.checkCount++;

      if (expected !== actual) {
         errorString = this.buildErrorString() +   "\texpected <" + expected  + ">\n" +
                                                   "\tbut was  <" + actual    + ">";
         this.throwTestError(errorString);
      }
   },

   STRCMP_EQUAL: function (expected, actual) {
      var errorString;

      this.checkCount++;

      if (expected.toString() !== actual.toString()) {
         errorString = this.buildErrorString() +   "\texpected <" + expected.toString()   + ">\n" +
                                                   "\tbut was  <" + actual.toString()     + ">";
         this.throwTestError(errorString);
      }
   },

   LONGS_EQUAL: function (expected, actual) {
      var errorString;

      this.checkCount++;

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

      this.checkCount++;

      if (Math.abs(expected - actual) > tolerance) {
         errorString = this.buildErrorString() +   "\texpected <" + expected  + ">\n"  +
                                                   "\tbut was  <" + actual    + ">"    +
                                                   " threshold was <" + tolerance + ">";
         this.throwTestError(errorString);
      }
   },

   FAIL: function (text) {
      var errorString = this.buildErrorString() + "\t" + text;
      this.checkCount++;
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
      var   tests,
            start;

      this.resetResults();

      tests = this.findTests(groupName, testName);

      for (var i = 0; i < tests.length; i++) {

         start = Date.now();

         if (tests[i].ignore === true) {

            if (this.verbose === true) {
               console.log("IGNORE_TEST(" + tests[i].group +
                     ", " + tests[i].name + ")");
            }

            this.ignoreCount++;
         } else {

            if (this.verbose === true) {
               console.log("TEST(" + tests[i].group +
                     ", " + tests[i].name + ")");
            }

            this.runTestObj(tests[i]);
         }

         if (this.verbose === true) {
            console.log(" - " + (Date.now() - start) + " ms\n");
         }
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

   resetResults: function () {
      this.failCount    = 0;
      this.runCount     = 0;
      this.checkCount   = 0;
      this.ignoreCount  = 0;
      this.startTime    = Date.now();
   },

   logResults: function (groupName, testName) {
      var   results,
            testCount,
            stopTime;

      stopTime = Date.now();

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

      testCount = this.getTestCount();
      results += testCount;
      if (testCount === 1) {
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
      results += this.getTestCount() - (this.runCount + this.ignoreCount);
      results += " filtered out, ";
      results += (stopTime - this.startTime) + " ms)\n\n";

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
