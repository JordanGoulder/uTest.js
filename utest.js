var uTest = {
   testGroups: {
      "_default": {
         name: "_default",
         tests: [ ]
      }
   },

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
      this.message = message;
   },

   throwTestError: function (message) {
      if (!(this.TestError instanceof Error)) {
         this.TestError.prototype = new Error();
      }
      throw new this.TestError(message);
   },

   getErrorString: function () {
      var errorString = "error: Failiure in TEST(";

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

   runAllTests: function () {
      try {
         for (var groupName in this.testGroups)
         {
            this.runTestGroup(groupName);
         }
      } catch (ex) {
         if (ex instanceof this.TestError) {
            console.log(ex.message);
         } else {
            throw ex;
         }
      }
   },

   runTestGroup: function (groupName) {
      var group = this.testGroups[groupName];

      this.currentGroup = group.name;

      for (var i = 0; i < group.tests.length; i++)
      {
         this.currentTest = group.tests[i].name;

         if (typeof group.setup === "function") {
            group.setup();
         }

         this.runTest(group.tests[i]);

         if (typeof group.teardown === "function") {
            group.teardown();
         }
      }
   },

   runTest: function (test) {
      if (typeof test === "string")
      {
         test = this.findTestByName(test);
         if (test === null) {
            return;
         }

         this.currentTest = test.name;
      }

      if (typeof test.run === "function") {
         test.run();
      }
   }
};
