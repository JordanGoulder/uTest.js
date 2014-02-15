uTest.TEST_GROUP({ name: "FirstGroup",
   setup: function () {
      uTest.CHECK(false);
   },

   teardown: function () {
   }
});

uTest.TEST({ group: "FirstGroup", name: "FirstTest",
   run: function () {
      uTest.FAIL("Fail FirstTest");
   },
});

uTest.TEST({ group: "FirstGroup", name: "SecondTest",
   run: function () {
      uTest.FAIL("Fail SecondTest");
   },
});

uTest.TEST({ name: "Test with no group",
   run: function () {
   }
});

uTest.TEST_GROUP({ name: "SecondGroup" });

uTest.TEST({ group: "SecondGroup", name: "TestA",
   run: function () {
      uTest.FAIL("Fail TestA");
   },
});

uTest.TEST_GROUP({ name: "EmptyGroup" });
