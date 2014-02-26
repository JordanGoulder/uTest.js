require("./tests");
var uTest = require("../../src/uTest");

function main () {
   // Add a couple checks outside of tests to make sure it
   // doesn't cause problems
   uTest.CHECK(true);
   uTest.STRCMP_EQUAL("hello", "hello");

   uTest.enableVerboseLogging();

   uTest.runAllTests();
}

if (typeof window !== "undefined") {
   window.addEventListener("load", main);
} else {
   main();
}
