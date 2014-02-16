uTest.TEST_GROUP({ name: "SelfTests",

   setup: function (test) {
      test.uTest = uTest.clone();
   },

   teardown: function (test) {
      delete test.uTest;
   }
});

uTest.TEST({ group: "SelfTests", name: "Clone",
   run: function () {
      uTest.CHECK(this.uTest.__proto__ === uTest);
      uTest.CHECK(this.uTest._getTestCount() === 0);
   },
});
