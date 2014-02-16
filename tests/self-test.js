uTest.TEST_GROUP({ name: "SelfTests",

   setup: function (test) {
      test.myTest = uTest.clone();
      test.myTest.disableLogging();
   },

   teardown: function (test) {
      delete test.myTest;
   }
});

uTest.TEST({ group: "SelfTests", name: "Clone",
   run: function (uTest) {
      uTest.CHECK(Object.getPrototypeOf(this.myTest) === uTest);
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

uTest.TEST({ group: "SelfTests", name: "FailingChecks",
   run: function (uTest) {

      this.myTest.TEST_GROUP({ name: "FailingChecksGroup" });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "BYTES_EQUAL",
         run: function (uTest) {
            uTest.BYTES_EQUAL(0x8f, 0x90);
         },
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK",
         run: function (uTest) {
            uTest.CHECK(false);
         },
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK_EQUAL",
         run: function (uTest) {
            uTest.CHECK_EQUAL(true, false);
         },
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK_TEXT",
         run: function (uTest) {
            uTest.CHECK_TEXT(1 === 0, "1 should not equal 0");
         },
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "DOUBLES_EQUAL",
         run: function (uTest) {
            uTest.DOUBLES_EQUAL(2.1, 2.3, 0.10001);
         },
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "LONGS_EQUAL",
         run: function (uTest) {
            uTest.LONGS_EQUAL(5, 6);
         },
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "STRCMP_EQUAL",
         run: function (uTest) {
            uTest.STRCMP_EQUAL("one", "two");
         },
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "FAIL",
         run: function (uTest) {
            uTest.FAIL("Fail me!");
         },
      });

      this.myTest.runAllTests();

      uTest.CHECK(this.myTest._getTestCount() === 8);
      uTest.CHECK(this.myTest._failCount      === 8);
      uTest.CHECK(this.myTest._runCount       === 8);
      uTest.CHECK(this.myTest._checkCount     === 8);
   },
});
