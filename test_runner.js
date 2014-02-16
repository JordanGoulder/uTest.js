window.addEventListener("load", function() {
   uTest.verbose = true;
   uTest.runAllTests();

   uTest.verbose = false;
   uTest.runTestGroup("FirstGroup");

   uTest.runTestGroup("SecondGroup");

   uTest.runTest("FirstTest");

   uTest.runTest({ group: "FirstGroup", name: "FirstTest" });

   uTest.runTest("ThirdTest");
});
