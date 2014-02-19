require(["../../src/uTest", "self-test"], function (uTest) {

   // Add a couple checks outside of tests to make sure it
   // doesn't cause problems
   uTest.CHECK(true);
   uTest.STRCMP_EQUAL("hello", "hello");

   uTest.enableVerboseLogging();

   uTest.runAllTests();
});
