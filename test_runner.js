window.addEventListener("load", function() {
   uTest.runAllTests();
   uTest.runTestGroup("FirstGroup");
   uTest.runTestGroup("SecondGroup");
   uTest.runTest("FirstTest");
   uTest.runTest({ group: "FirstGroup", name: "FirstTest" });
   uTest.runTest("ThirdTest");
});
