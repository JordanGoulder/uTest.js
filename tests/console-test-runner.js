
// Run the unit tests once the page has loaded
window.addEventListener("load", function () {

   // Add a couple checks outside of tests to make sure it doesn't cause problems
   uTest.CHECK(true);
   uTest.STRCMP_EQUAL("hello", "hello");

   uTest.enableVerboseLogging();

   uTest.runAllTests();
});

