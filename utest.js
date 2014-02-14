uTest = {
   testGroups: {
      "_default": {
         name: "_default",
         tests: []
      }
   },

   TEST_GROUP: function (group) {
      group.tests = [];
      this.testGroups[group.name] = group;
   },

   TEST: function (test) {
      test.group = test.group || "_default";
      this.testGroups[test.group].tests.push(test);
   },

   FAIL: function (str) {
      throw new Error(str);
   },

   runAllTests: function () {
      console.log("uTest.runAllTests");

      for (var groupName in this.testGroups)
      {
         this.runTestGroup(this.testGroups[groupName]);
      }
   },

   runTestGroup: function (group) {
      console.log("Running test group " + group.name);
      try {
         for (var i = 0; i < group.tests.length; i++)
         {
            if (typeof group.setup === "function") {
               group.setup();
            }

            if (typeof group.tests[i].run  === "function") {
               group.tests[i].run();
            }

            if (typeof group.teardown === "function") {
               group.teardown();
            }

            console.log("Passed");
         }
      } catch (ex) {
         console.log("Failed");
      }
   }
}

window.addEventListener("load", function() {
   uTest.runAllTests();
});
