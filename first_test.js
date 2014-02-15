uTest.TEST_GROUP({ name: "FirstGroup",
   setup: function () {
   },

   teardown: function () {
   }
});

uTest.TEST({ group: "FirstGroup", name: "FirstTest",
   run: function () {
      uTest.FAIL("Fail me!");
   },
});

uTest.TEST({ name: "Test with no group",
   run: function () {
   }
});

uTest.TEST_GROUP({ name: "EmptyGroup" });
