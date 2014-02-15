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
         throw new Error(errorString);
      }
   },

   CHECK_TEXT: function (condition, text) {
      var errorString = this.getErrorString() + "\tMessage: " + text + "\n\tCHECK failed";
      if (condition !== true) {
         throw new Error(errorString);
      }
   },

   CHECK_EQUAL: function (expected, actual) {
      var errorString = this.getErrorString() + "\texpected <" + expected  + ">\n" +
                                                "\tbut was  <" + actual    + ">";
      if (expected !== actual) {
         throw new Error(errorString);
      }
   },

   STRCMP_EQUAL: function (expected, actual) {
      var errorString = this.getErrorString() + "\texpected <" + expected.toString()   + ">\n" +
                                                "\tbut was  <" + actual.toString()     + ">";
      if (expected.toString() !== actual.toString()) {
         throw new Error(errorString);
      }
   },

   LONGS_EQUAL: function (expected, actual) {
      var errorString = this.getErrorString() + "\texpected <" + Math.floor(expected)  + ">\n" +
                                                "\tbut was  <" + Math.floor(actual)    + ">";
      if (Math.floor(expected) !== Math.floor(actual)) {
         throw new Error(errorString);
      }
   },

   DOUBLES_EQUAL: function (expected, actual, tolerance) {
      var errorString = this.getErrorString() + "\texpected <" + expected  + ">\n"  +
                                                "\tbut was  <" + actual    + ">"    +
                                                " threshold was <" + tolerance + ">";
      if (Math.abs(expected - actual) > tolerance) {
         throw new Error(errorString);
      }
   },

   FAIL: function (text) {
      var errorString = this.getErrorString() + "\t" + text;
      throw new Error(errorString);
   },

   getErrorString: function () {
      var errorString = "error: Failiure in TEST(" +
                        this.currentGroup + ", "   +
                        this.currentTest + ")\n";

      return errorString;
   },

   runAllTests: function () {
      try {
         for (var groupName in this.testGroups)
         {
            this.runTestGroup(groupName);
         }
      } catch (ex) {
         console.log(ex.message);
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

         if (typeof group.tests[i].run  === "function") {
            group.tests[i].run();
         }

         if (typeof group.teardown === "function") {
            group.teardown();
         }
      }
   }
};
