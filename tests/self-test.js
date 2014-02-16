uTest.TEST_GROUP({ name: "SelfTests",

   setup: function (test) {
      test.myTest = uTest.clone();
   },

   teardown: function (test) {
      delete test.myTest;
   }
});

uTest.TEST({ group: "SelfTests", name: "Clone",
   run: function (uTest) {
      uTest.CHECK(this.myTest.__proto__ === uTest);
      uTest.CHECK(this.myTest._getTestCount() === 0);
   },
});

uTest.TEST({ group: "SelfTests", name: "PassingChecks",
   run: function (uTest) {

      this.myTest.TEST_GROUP({ name: "PassingChecksGroup" });

      this.myTest.TEST({ group: "PassingChecksGroup", name: "Test",
         run: function (uTest) {
            uTest.BYTES_EQUAL(0x8f, 0x8f);
            uTest.CHECK(true);
            uTest.CHECK_EQUAL(true, true);
            uTest.CHECK_TEXT(1 === 1, "When does 1 !== 1?");
            uTest.DOUBLES_EQUAL(2.1, 2.2, 0.100001);
            uTest.LONGS_EQUAL(2, 2);
            uTest.STRCMP_EQUAL("one", "one");
         },
      });

      this.myTest.runAllTests();

      uTest.CHECK(this.myTest._getTestCount() === 1);
      uTest.CHECK(this.myTest._failCount      === 0);
      uTest.CHECK(this.myTest._runCount       === 1);
      uTest.CHECK(this.myTest._checkCount     === 7);
   },
});
