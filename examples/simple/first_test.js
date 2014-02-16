uTest.TEST_GROUP({ name: "FirstGroup",
   setup: function () {
      uTest.CHECK(true);
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

uTest.IGNORE_TEST({ group: "FirstGroup", name: "ThirdTest",
   run: function () {
      uTest.CHECK(true);
      uTest.CHECK(true);
      uTest.CHECK_TEXT(true, "Check Text");
      uTest.CHECK(true);
      uTest.CHECK(true);
   }
});

uTest.TEST_GROUP({ name: "SecondGroup" });

uTest.TEST({ group: "SecondGroup", name: "FirstTest",
   run: function () {
      uTest.FAIL("Fail TestA");
   },
});
