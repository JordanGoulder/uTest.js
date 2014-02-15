var uTest = {
   testGroups: {
      "_default": {
         name: "_default",
         tests: [ ]
      }
   },

   failCount:     0,
   runCount:      0,
   ignoreCount:   0,
   startTime:     null,

   TEST_GROUP: function (group) {
      group.tests = [ ];
      this.testGroups[group.name] = group;
   },

   TEST: function (test) {
      test.group = test.group || "_default";
      this.testGroups[test.group].tests.push(test);
   },

   CHECK: function (condition) {
      var errorString = this.getErrorString() + "\tCHECK failed";

      if (condition !== true) {
         this.throwTestError(errorString);
      }
   },

   CHECK_TEXT: function (condition, text) {
      var errorString = this.getErrorString() + "\tMessage: " + text + "\n\tCHECK failed";
      if (condition !== true) {
         this.throwTestError(errorString);
      }
   },

   CHECK_EQUAL: function (expected, actual) {
      var errorString = this.getErrorString() + "\texpected <" + expected  + ">\n" +
                                                "\tbut was  <" + actual    + ">";
      if (expected !== actual) {
         this.throwTestError(errorString);
      }
   },

   STRCMP_EQUAL: function (expected, actual) {
      var errorString = this.getErrorString() + "\texpected <" + expected.toString()   + ">\n" +
                                                "\tbut was  <" + actual.toString()     + ">";
      if (expected.toString() !== actual.toString()) {
         this.throwTestError(errorString);
      }
   },

   LONGS_EQUAL: function (expected, actual) {
      var errorString = this.getErrorString() + "\texpected <" + Math.floor(expected)  + ">\n" +
                                                "\tbut was  <" + Math.floor(actual)    + ">";
      if (Math.floor(expected) !== Math.floor(actual)) {
         this.throwTestError(errorString);
      }
   },

   BYTES_EQUAL: function (expected, actual) {
      this.LONGS_EQUAL(expected & 0xFF, actual & 0xFF);
   },

   DOUBLES_EQUAL: function (expected, actual, tolerance) {
      var errorString = this.getErrorString() + "\texpected <" + expected  + ">\n"  +
                                                "\tbut was  <" + actual    + ">"    +
                                                " threshold was <" + tolerance + ">";
      if (Math.abs(expected - actual) > tolerance) {
         this.throwTestError(errorString);
      }
   },

   FAIL: function (text) {
      var errorString = this.getErrorString() + "\t" + text;
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

   getErrorString: function () {
      var errorString = "error: Failure in TEST(";

      if (this.currentGroup !== "_default") {
         errorString += this.currentGroup + ", ";
      }

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

   resetResults: function () {
      this.failCount    = 0;
      this.runCount     = 0;
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

         this.currentGroup = "_default";
         this.currentTest = test.name;

         this.resetResults();
         log = true;

         this.runCount++;
      }

      try {
         if (typeof test.run === "function") {
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
