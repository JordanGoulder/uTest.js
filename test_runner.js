window.addEventListener("load", function() {
   uTest.enableVerboseLogging();
   uTest.runAllTests();

   uTest.disableVerboseLogging();
   uTest.runTestGroup("FirstGroup");

   uTest.runTestGroup("SecondGroup");

   uTest.runTest("FirstTest");

   uTest.runTest({ group: "FirstGroup", name: "FirstTest" });

   uTest.runTest("ThirdTest");
});
