uTest.TEST_GROUP({ name: "First Group",
   setup: function () {
      console.log("setup");
   },

   teardown: function () {
      console.log("tear down");
   }
});

uTest.TEST({ group: "First Group", name: "First Test",
   run: function () {
      this.helperFunctionOne();
      uTest.FAIL("Fail me!");
   },

   helperFunctionOne: function () {
      console.log("helperFunctionOne");
   }
});

uTest.TEST({ name: "Test with no group",
   run: function () {
      console.log("test with no group");
   }
});

uTest.TEST_GROUP({ name: "Empty Group" });
