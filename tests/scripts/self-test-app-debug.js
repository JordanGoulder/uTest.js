(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
   The MIT License (MIT)

   Copyright (c) 2014 Jordan Goulder, All Rights Reserved.

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
*/

/**
   A unit test framework for JavaScript modeled after cppUTest.
   @module uTest
*/
module.exports = {

   /**
      Define a test group.

      @instance 
      @param {object} group - A group object that has the follwing properties:
                              <dl>
                                 <dt>name</dt>
                                 <dd>The name of the group</dd>
                                 <dt>setup <em>(optional)</em></dt>
                                 <dd>The setup function that is run before each test in the group</dd>
                                 <dt>teardown <em>(optional)</em></dt>
                                 <dd>The teardown function that is run after each test in the group</dd>
                              </dl>
   */
   TEST_GROUP: function (group) {
      group.tests = [ ];
      this._testGroups[group.name] = group;
   },

   /**
      Define a test.

      @instance
      @param {object} test - A test object that has the follwing properties:
                              <dl>
                                 <dt>group <em>(optional)</em></dt>
                                 <dd>The name of the group in which the test belongs</dd>
                                 <dt>name</dt>
                                 <dd>The name of the test</dd>
                                 <dt>run</dt>
                                 <dd>The function that is run to perform the test</dd>
                              </dl>
   */
   TEST: function (test) {
      test.group = test.group || "_default";
      test.uTest = this;
      test.ignore = false;
      this._testGroups[test.group].tests.push(test);
   },

   /**
      Define a test that will be ignored.

      @instance
      @param {object} test - A test object that has the follwing properties:
                              <dl>
                                 <dt>group <em>(optional)</em></dt>
                                 <dd>The name of the group in which the test belongs</dd>
                                 <dt>name</dt>
                                 <dd>The name of the test</dd>
                                 <dt>run</dt>
                                 <dd>The function that is run to perform the test</dd>
                              </dl>
    */
   IGNORE_TEST: function (test) {
      this.TEST(test);
      test.ignore = true;
   },

   /**
      Check a boolean result.

      @instance
      @param {boolean} condition - The result that is checked
   */
   CHECK: function (condition) {
      var errorString;

      this._checkCount++;

      if (condition !== true) {
         errorString = this._buildErrorString() + "\tCHECK failed";
         this._throwTestError(errorString);
      }
   },

   /**
      Check a boolean result and print text on failure.

      @instance
      @param {boolean} condition - The result that is checked
      @param {string} text - The text to print on failure
   */
   CHECK_TEXT: function (condition, text) {
      var errorString;

      this._checkCount++;

      if (condition !== true) {
         errorString = this._buildErrorString() + "\tMessage: " + text + "\n\tCHECK failed";
         this._throwTestError(errorString);
      }
   },

   /**
      Check for equality between two entities using strict equality (===)

      @instance
      @param {any} expected - The expected result
      @param {any} actual - The actual result
   */
   CHECK_EQUAL: function (expected, actual) {
      var errorString;

      this._checkCount++;

      if (expected !== actual) {
         errorString = this._buildErrorString() +  "\texpected <" + expected  + ">\n" +
                                                   "\tbut was  <" + actual    + ">";
         this._throwTestError(errorString);
      }
   },

   /**
      Check for equality between two entities using loose equality (==)

      @instance
      @param {any} expected - The expected result
      @param {any} actual - The actual result
   */
   CHECK_LOOSE_EQUAL: function (expected, actual) {
      var errorString;

      this._checkCount++;

      if (expected != actual) {
         errorString = this._buildErrorString() +  "\texpected <" + expected  + ">\n" +
                                                   "\tbut was  <" + actual    + ">";
         this._throwTestError(errorString);
      }
   },

   /**
      Check for an exception to be thrown by calling a specified function.

      @instance
      @param {Error} exception - The resulting exception that should be thrown by calling func
      @param {function} func - The function that will be called
   */
   CHECK_THROW: function (exception, func) {
      var   errorString,
            thrown = false;

      this._checkCount++;

      try {
         func();
      } catch (ex) {
         if (ex.name === exception) {
            thrown = true;
         }
         else
         {
            throw ex;
         }
      }

      if (!thrown) {
            errorString = this._buildErrorString() +  "\texpected " + exception +
                                                      " was not thrown";

            this._throwTestError(errorString);
      }
   },

   /**
      Check for equality using expected.toString() === actual.toString()

      @instance
      @param {any} expected - The expected result
      @param {any} actual - The actual result
   */
   STRCMP_EQUAL: function (expected, actual) {
      var errorString;

      this._checkCount++;

      if (expected.toString() !== actual.toString()) {
         errorString = this._buildErrorString() +  "\texpected <" + expected.toString()   + ">\n" +
                                                   "\tbut was  <" + actual.toString()     + ">";
         this._throwTestError(errorString);
      }
   },

   /**
      Compare two integers.

      @instance
      @param {number} expected - The expected integer result
      @param {number} actual - The actual integer result
   */
   LONGS_EQUAL: function (expected, actual) {
      var errorString;

      this._checkCount++;

      if (this._toInt(expected) !== this._toInt(actual)) {
         errorString = this._buildErrorString() +  "\texpected <" + Math.floor(expected)  + ">\n" +
                                                   "\tbut was  <" + Math.floor(actual)    + ">";
         this._throwTestError(errorString);
      }
   },

   /**
      Compare two 8-bit wide integers.

      @instance
      @param {number} expected - The expected 8-bit wide integer result
      @param {number} actual - The actual 8-bit wide integer result
   */
   BYTES_EQUAL: function (expected, actual) {
      this.LONGS_EQUAL(expected & 0xFF, actual & 0xFF);
   },

   /**
      Compares two numbers within some tolerance.

      @instance
      @param {number} expected - The expected result
      @param {number} actual - The actual result
      @param {number} tolerance - The maximum difference that is tolerable
   */
   DOUBLES_EQUAL: function (expected, actual, tolerance) {
      var errorString;

      this._checkCount++;

      if (Math.abs(expected - actual) > tolerance) {
         errorString = this._buildErrorString() +  "\texpected <" + expected  + ">\n"  +
                                                   "\tbut was  <" + actual    + ">"    +
                                                   " threshold was <" + tolerance + ">";
         this._throwTestError(errorString);
      }
   },

   /**
      Always fails and prints text.

      @instance
      @param {string} text - The text to print on failure.
   */
   FAIL: function (text) {
      var errorString = this._buildErrorString() + "\t" + text;
      this._checkCount++;
      this._throwTestError(errorString);
   },

   /**
      Return a clone of the uTest object that has been initialized.

      @instance
   */
   clone: function() {
      var newObj = Object.create(this);
      newObj._init();
      return newObj;
   },

   /**
      Enable logging. This is enabled by default.

      @instance
   */
   enableLogging: function () {
      this._logging = true;
   },

   /**
      Disable logging.

      @instance
   */
   disableLogging: function () {
      this._logging = false;
   },

   /**
      Enable verbose logging. This is disabled by default.

      @instance
   */
   enableVerboseLogging: function () {
      this._verbose = true;
   },

   /**
      Disable verbose logging.

      @instance
   */
   disableVerboseLogging: function () {
      this._verbose = false;
   },

   /**
      Run all the tests that are currently defined.

      @instance
   */
   runAllTests: function () {
      this._run(null, null);
   },

   /**
      Run a specific test group.

      @instance
      @param {string} groupName - The name of the group to run
   */
   runTestGroup: function (groupName) {
      this._run(groupName, null);
   },

   /** 
      Run a specific test.

      @instance
      @param {string|object} test - If test is a string then run all the tests with that name,
                                    otherwise, test should be an object with the follwing properties:
                                    <dl>
                                       <dt>group</dt>
                                       <dd>The name of the group in which the test belongs</dd>
                                       <dt>name</dt>
                                       <dd>The name of the test to run</dd>
                                    </dl>
   */
   runTest: function (test) {
      var   groupName = null,
            testName = null;

      if (typeof test === "string") {

         testName = test;

      } else if (typeof test === "object") {

         if ("group" in test) {
            groupName = test.group;
         }

         if ("name" in test) {
            testName = test.name;
         }
      }

      if (testName !== null) {
         this._run(groupName, testName);
      }
   },

   _testGroups:   { "_default": { name: "_default", tests: [ ] } },
   _failCount:    0,
   _runCount:     0,
   _checkCount:   0,
   _ignoreCount:  0,
   _startTime:    0,
   _verbose:      false,
   _logging:      true,
   _currentGroup: "",
   _currentTest:  "",

   _init: function () {
      this._testGroups     = { "_default": { name: "_default", tests: [ ] } };
      this._failCount      = 0;
      this._runCount       = 0;
      this._checkCount     = 0;
      this._ignoreCount    = 0;
      this._startTime      = 0;
      this._verbose        = false;
      this._logging        = true;
      this._currentGroup   = "";
      this._currentTest    = "";
   },

   _log: function (text) {
      if (this._logging === true) {
         console.log(text);
      }
   },

   _run: function (groupName, testName) {
      var   tests,
            start;

      this._resetResults();

      tests = this._findTests(groupName, testName);

      for (var i = 0; i < tests.length; i++) {

         start = Date.now();

         if (tests[i].ignore === true) {

            if (this._verbose === true) {
               this._log("IGNORE_TEST(" + tests[i].group +
                     ", " + tests[i].name + ")");
            }

            this._ignoreCount++;
         } else {

            if (this._verbose === true) {
               this._log("TEST(" + tests[i].group +
                     ", " + tests[i].name + ")");
            }

            this._runTestObj(tests[i]);
         }

         if (this._verbose === true) {
            this._log(" - " + (Date.now() - start) + " ms\n");
         }
      }

      this._logResults(groupName, testName);
   },

   _TestError: function (message) {
      this.name = "TestError";
      this.message = message + "\n";
   },

   _throwTestError: function (message) {
      if (this._TestError.prototype.toString() !== "Error") {
         this._TestError.prototype = new Error();
      }
      throw new this._TestError(message);
   },

   _buildErrorString: function () {
      var   error = (function () { try { throw new Error(); } catch (ex) {return ex;}})(),
            errorString = "",
            callerLines,
            matches;

      if (error.stack) {
         callerLines = error.stack.split("\n")[4];
         matches = callerLines.match(/\((.*)\)/);
         if (matches !== null) {
            errorString += matches[1] + ": ";
         }
      }

      errorString += "error: Failure in TEST(";

      if (this._currentGroup !== "_default") {
         errorString += this._currentGroup + ", ";
      }

      errorString += this._currentTest + ")\n";

      return errorString;
   },

   _findTests: function (groupName, testName) {
      var matchingTests = [ ];

      for (var name in this._testGroups) {

         if ((groupName === null) || (name === groupName)) {

            for (var i = 0; i < this._testGroups[name].tests.length; i++) {

               if ((testName === null) || (this._testGroups[name].tests[i].name == testName)) {

                  matchingTests.push(this._testGroups[name].tests[i]);
               }
            }
         }
      }

      return matchingTests;
   },

   _getTestCount: function () {
      var count = 0;

      for (var groupName in this._testGroups) {
         count += this._testGroups[groupName].tests.length;
      }

      return count;
   },

   _resetResults: function () {
      this._failCount    = 0;
      this._runCount     = 0;
      this._checkCount   = 0;
      this._ignoreCount  = 0;
      this._startTime    = Date.now();
   },

   _logResults: function (groupName, testName) {
      var   results,
            testCount,
            stopTime;

      stopTime = Date.now();

      if (this._failCount > 0) {
         results =   "Errors ("     +
                     this._failCount;
         if (this._failCount === 1) {
            results += " failure, ";
         } else {
            results += " failures, ";
         }
      } else {
         results = "OK (";
      }

      testCount = this._getTestCount();
      results += testCount;
      if (testCount === 1) {
         results += " test, ";
      } else {
         results += " tests, ";
      }

      results += this._runCount + " ran, ";

      results += this._checkCount;
      if (this._checkCount === 1) {
         results += " check, ";
      } else {
         results += " checks, ";
      }

      results += this._ignoreCount + " ignored, ";
      results += this._getTestCount() - (this._runCount + this._ignoreCount);
      results += " filtered out, ";
      results += (stopTime - this._startTime) + " ms)\n\n";

      this._log(results);
   },

   _runTestObj: function (test) {
      var group = this._testGroups[test.group];

      this._currentGroup = test.group;
      this._currentTest  = test.name;

      this._runCount++;

      try {

         if (typeof group.setup === "function") {
            group.setup(test);
         }

         if (typeof test.run === "function") {
            test.run();
         }

         if (typeof group.teardown === "function") {
            group.teardown(test);
         }

      } catch (ex) {

         if (ex instanceof this._TestError) {

            this._log(ex.message);
            this._failCount++;

         } else {
            throw ex;
         }
      }
   },

   _toInt: function (num) {
      return (num < 0) ? Math.ceil(num) : Math.floor(num);
   }
};

},{}],2:[function(require,module,exports){
require("./tests");
var uTest = require("../../src/uTest");

// Add a couple checks outside of tests to make sure it
// doesn't cause problems
uTest.CHECK(true);
uTest.STRCMP_EQUAL("hello", "hello");

uTest.enableVerboseLogging();

uTest.runAllTests();

},{"../../src/uTest":1,"./tests":3}],3:[function(require,module,exports){
var uTest = require("../../src/uTest");

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
   run: function () {
      this.uTest.CHECK(Object.getPrototypeOf(this.myTest) === uTest);
      this.uTest.CHECK(this.myTest._getTestCount() === 0);
   }
});

uTest.TEST({ group: "SelfTests", name: "Logging",
   run: function () {

      this.myTest._logging = false;
      this.myTest.enableLogging();
      this.uTest.CHECK(this.myTest._logging);

      this.myTest._logging = true;
      this.myTest.disableLogging();
      this.uTest.CHECK_EQUAL(this.myTest._logging, false);

      this.myTest._verbose = false;
      this.myTest.enableVerboseLogging();
      this.uTest.CHECK(this.myTest._verbose);

      this.myTest._verbose = true;
      this.myTest.disableVerboseLogging();
      this.uTest.CHECK_EQUAL(this.myTest._verbose, false);
   }
});

uTest.TEST({ group: "SelfTests", name: "PassingChecks",
   run: function () {

      this.myTest.TEST_GROUP({ name: "PassingChecksGroup" });

      this.myTest.TEST({ group: "PassingChecksGroup", name: "Test",
         run: function () {
            this.uTest.BYTES_EQUAL(0x8f, 0x8f);
            this.uTest.CHECK(true);
            this.uTest.CHECK_EQUAL(true, true);
            this.uTest.CHECK_TEXT(1 === 1, "When does 1 !== 1?");
            this.uTest.DOUBLES_EQUAL(2.1, 2.2, 0.100001);
            this.uTest.LONGS_EQUAL(2, 2);
            this.uTest.STRCMP_EQUAL("one", "one");
            this.uTest.CHECK_LOOSE_EQUAL(1000, "1000");
         }
      });

      this.myTest.runAllTests();

      this.uTest.CHECK_EQUAL(1, this.myTest._getTestCount());
      this.uTest.CHECK_EQUAL(0, this.myTest._failCount);
      this.uTest.CHECK_EQUAL(1, this.myTest._runCount);
      this.uTest.CHECK_EQUAL(8, this.myTest._checkCount);
   }
});

uTest.TEST({ group: "SelfTests", name: "FailingChecks",
   run: function () {

      this.myTest.TEST_GROUP({ name: "FailingChecksGroup" });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "BYTES_EQUAL",
         run: function () {
            this.uTest.BYTES_EQUAL(0x8f, 0x90);
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK",
         run: function () {
            this.uTest.CHECK(false);
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK_EQUAL",
         run: function () {
            this.uTest.CHECK_EQUAL(true, false);
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK_EQUAL_2",
         run: function () {
            this.uTest.CHECK_EQUAL(2, "2");
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK_LOOSE_EQUAL",
         run: function () {
            this.uTest.CHECK_EQUAL(2, "3");
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK_TEXT",
         run: function () {
            this.uTest.CHECK_TEXT(1 === 0, "1 should not equal 0");
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "DOUBLES_EQUAL",
         run: function () {
            this.uTest.DOUBLES_EQUAL(2.1, 2.3, 0.10001);
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "LONGS_EQUAL",
         run: function () {
            this.uTest.LONGS_EQUAL(5, 6);
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "STRCMP_EQUAL",
         run: function () {
            this.uTest.STRCMP_EQUAL("one", "two");
         }
      });

      this.myTest.TEST({ group: "FailingChecksGroup", name: "FAIL",
         run: function () {
            this.uTest.FAIL("Fail me!");
         }
      });

      this.myTest.runAllTests();

      this.uTest.CHECK(this.myTest._getTestCount() === 10);
      this.uTest.CHECK(this.myTest._failCount      === 10);
      this.uTest.CHECK(this.myTest._runCount       === 10);
      this.uTest.CHECK(this.myTest._checkCount     === 10);
   }
});

uTest.TEST({ group: "SelfTests", name: "LONGS_EQUAL",
   run: function () {
      this.myTest.TEST_GROUP({ name: "LONGS_EQUAL_Group" });

      this.myTest.TEST({ group: "LONGS_EQUAL_Group", name: "LONGS_EQUAL_Pass",
         run: function () {
            this.uTest.LONGS_EQUAL(0, 0);
            this.uTest.LONGS_EQUAL(1, 1);
            this.uTest.LONGS_EQUAL(1, 1.1);
            this.uTest.LONGS_EQUAL(-1, -1);
            this.uTest.LONGS_EQUAL(-1, -1.1);
            this.uTest.LONGS_EQUAL(Number.MAX_VALUE, Number.MAX_VALUE);
            this.uTest.LONGS_EQUAL(Number.MIN_VALUE, Number.MIN_VALUE);
         }
      });

      this.myTest.TEST_GROUP({ name: "LONGS_EQUAL_Fail_Group" });

      this.myTest.TEST({ group: "LONGS_EQUAL_Fail_Group", name: "LONGS_EQUAL_Fail_1",
         run: function () {
            this.uTest.LONGS_EQUAL(1, 2);
         }
      });

      this.myTest.TEST({ group: "LONGS_EQUAL_Fail_Group", name: "LONGS_EQUAL_Fail_2",
         run: function () {
            this.uTest.LONGS_EQUAL(1, 0.1);
         }
      });

      this.myTest.TEST({ group: "LONGS_EQUAL_Fail_Group", name: "LONGS_EQUAL_Fail_3",
         run: function () {
            this.uTest.LONGS_EQUAL(-1, -2);
         }
      });

      this.myTest.TEST({ group: "LONGS_EQUAL_Fail_Group", name: "LONGS_EQUAL_Fail_4",
         run: function () {
            this.uTest.LONGS_EQUAL(-2, -1.1);
         }
      });

      this.myTest.TEST({ group: "LONGS_EQUAL_Fail_Group", name: "LONGS_EQUAL_Fail_5",
         run: function () {
            this.uTest.LONGS_EQUAL(Number.MAX_VALUE, Number.MIN_VALUE);
         }
      });


      this.myTest.runTest("LONGS_EQUAL_Pass");
      this.uTest.CHECK(this.myTest._runCount    === 1);
      this.uTest.CHECK(this.myTest._failCount   === 0);

      this.myTest.runTestGroup("LONGS_EQUAL_Fail_Group");
      this.uTest.CHECK(this.myTest._runCount    === 5);
      this.uTest.CHECK(this.myTest._failCount   === 5);
   }
});

uTest.TEST({ group: "SelfTests", name: "BYTES_EQUAL",
   run: function () {
      this.myTest.TEST_GROUP({ name: "BYTES_EQUAL_Group" });

      this.myTest.TEST({ group: "BYTES_EQUAL_Group", name: "BYTES_EQUAL_Pass",
         run: function () {
            this.uTest.BYTES_EQUAL(0, 0);
            this.uTest.BYTES_EQUAL(1, 1);
            this.uTest.BYTES_EQUAL(1, 1.1);
            this.uTest.BYTES_EQUAL(-1, -1);
            this.uTest.BYTES_EQUAL(-1, -1.1);
            this.uTest.BYTES_EQUAL(0x1AA, 0xAA);
         }
      });

      this.myTest.TEST_GROUP({ name: "BYTES_EQUAL_Fail_Group" });

      this.myTest.TEST({ group: "BYTES_EQUAL_Fail_Group", name: "BYTES_EQUAL_Fail_1",
         run: function () {
            this.uTest.BYTES_EQUAL(1, 2);
         }
      });

      this.myTest.TEST({ group: "BYTES_EQUAL_Fail_Group", name: "BYTES_EQUAL_Fail_2",
         run: function () {
            this.uTest.BYTES_EQUAL(1, 0.1);
         }
      });

      this.myTest.TEST({ group: "BYTES_EQUAL_Fail_Group", name: "BYTES_EQUAL_Fail_3",
         run: function () {
            this.uTest.BYTES_EQUAL(-1, -2);
         }
      });

      this.myTest.TEST({ group: "BYTES_EQUAL_Fail_Group", name: "BYTES_EQUAL_Fail_4",
         run: function () {
            this.uTest.BYTES_EQUAL(-2, -1.1);
         }
      });

      this.myTest.runTest("BYTES_EQUAL_Pass");
      this.uTest.CHECK(this.myTest._runCount    === 1);
      this.uTest.CHECK(this.myTest._failCount   === 0);

      this.myTest.runTestGroup("BYTES_EQUAL_Fail_Group");
      this.uTest.CHECK(this.myTest._runCount    === 4);
      this.uTest.CHECK(this.myTest._failCount   === 4);
   }
});

uTest.TEST({ group: "SelfTests", name: "CHECK_TRHOWS",

   run: function () {
      uTest.CHECK_THROW("ReferenceError", function () {
         callARandomNonExistingFunction();
      });
   }

});

uTest.TEST({ group: "SelfTests", name: "UseTestWithoutGroup",

   run: function () {

      this.myTest.TEST({name: "TestWithoutGroup",
         run: function () {
            this.uTest.CHECK(true);
         }
      });

      this.myTest.IGNORE_TEST({name: "IgnoreTestWithoutGroup",
         run: function () {
            this.uTest.CHECK(true);
         }
      });

      this.myTest.runTest("TestWithoutGroup");
      this.uTest.CHECK(this.myTest._runCount    === 1);
      this.uTest.CHECK(this.myTest._failCount   === 0);

      this.myTest.runAllTests();
      this.uTest.CHECK(this.myTest._runCount    === 1);
      this.uTest.CHECK(this.myTest._failCount   === 0);
      this.uTest.CHECK(this.myTest._ignoreCount === 1);
   }

});

},{"../../src/uTest":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvc3JjL3VUZXN0LmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvdGVzdHMvc2NyaXB0cy9tYWluLmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvdGVzdHMvc2NyaXB0cy90ZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcbiAgIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4gICBDb3B5cmlnaHQgKGMpIDIwMTQgSm9yZGFuIEdvdWxkZXIsIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cbiAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAgIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAgIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAgIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAgIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICAgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4gICBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gICBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAgIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICAgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICAgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAgIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gICBTT0ZUV0FSRS5cbiovXG5cbi8qKlxuICAgQSB1bml0IHRlc3QgZnJhbWV3b3JrIGZvciBKYXZhU2NyaXB0IG1vZGVsZWQgYWZ0ZXIgY3BwVVRlc3QuXG4gICBAbW9kdWxlIHVUZXN0XG4qL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgIC8qKlxuICAgICAgRGVmaW5lIGEgdGVzdCBncm91cC5cblxuICAgICAgQGluc3RhbmNlIFxuICAgICAgQHBhcmFtIHtvYmplY3R9IGdyb3VwIC0gQSBncm91cCBvYmplY3QgdGhhdCBoYXMgdGhlIGZvbGx3aW5nIHByb3BlcnRpZXM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+bmFtZTwvZHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIGdyb3VwPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5zZXR1cCA8ZW0+KG9wdGlvbmFsKTwvZW0+PC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgc2V0dXAgZnVuY3Rpb24gdGhhdCBpcyBydW4gYmVmb3JlIGVhY2ggdGVzdCBpbiB0aGUgZ3JvdXA8L2RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0PnRlYXJkb3duIDxlbT4ob3B0aW9uYWwpPC9lbT48L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSB0ZWFyZG93biBmdW5jdGlvbiB0aGF0IGlzIHJ1biBhZnRlciBlYWNoIHRlc3QgaW4gdGhlIGdyb3VwPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAqL1xuICAgVEVTVF9HUk9VUDogZnVuY3Rpb24gKGdyb3VwKSB7XG4gICAgICBncm91cC50ZXN0cyA9IFsgXTtcbiAgICAgIHRoaXMuX3Rlc3RHcm91cHNbZ3JvdXAubmFtZV0gPSBncm91cDtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgRGVmaW5lIGEgdGVzdC5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge29iamVjdH0gdGVzdCAtIEEgdGVzdCBvYmplY3QgdGhhdCBoYXMgdGhlIGZvbGx3aW5nIHByb3BlcnRpZXM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+Z3JvdXAgPGVtPihvcHRpb25hbCk8L2VtPjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIGdyb3VwIGluIHdoaWNoIHRoZSB0ZXN0IGJlbG9uZ3M8L2RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pm5hbWU8L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSB0ZXN0PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5ydW48L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBmdW5jdGlvbiB0aGF0IGlzIHJ1biB0byBwZXJmb3JtIHRoZSB0ZXN0PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAqL1xuICAgVEVTVDogZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgIHRlc3QuZ3JvdXAgPSB0ZXN0Lmdyb3VwIHx8IFwiX2RlZmF1bHRcIjtcbiAgICAgIHRlc3QudVRlc3QgPSB0aGlzO1xuICAgICAgdGVzdC5pZ25vcmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX3Rlc3RHcm91cHNbdGVzdC5ncm91cF0udGVzdHMucHVzaCh0ZXN0KTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgRGVmaW5lIGEgdGVzdCB0aGF0IHdpbGwgYmUgaWdub3JlZC5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge29iamVjdH0gdGVzdCAtIEEgdGVzdCBvYmplY3QgdGhhdCBoYXMgdGhlIGZvbGx3aW5nIHByb3BlcnRpZXM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+Z3JvdXAgPGVtPihvcHRpb25hbCk8L2VtPjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIGdyb3VwIGluIHdoaWNoIHRoZSB0ZXN0IGJlbG9uZ3M8L2RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pm5hbWU8L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSB0ZXN0PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5ydW48L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBmdW5jdGlvbiB0aGF0IGlzIHJ1biB0byBwZXJmb3JtIHRoZSB0ZXN0PC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAgKi9cbiAgIElHTk9SRV9URVNUOiBmdW5jdGlvbiAodGVzdCkge1xuICAgICAgdGhpcy5URVNUKHRlc3QpO1xuICAgICAgdGVzdC5pZ25vcmUgPSB0cnVlO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBDaGVjayBhIGJvb2xlYW4gcmVzdWx0LlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uIC0gVGhlIHJlc3VsdCB0aGF0IGlzIGNoZWNrZWRcbiAgICovXG4gICBDSEVDSzogZnVuY3Rpb24gKGNvbmRpdGlvbikge1xuICAgICAgdmFyIGVycm9yU3RyaW5nO1xuXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG5cbiAgICAgIGlmIChjb25kaXRpb24gIT09IHRydWUpIHtcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgXCJcXHRDSEVDSyBmYWlsZWRcIjtcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ2hlY2sgYSBib29sZWFuIHJlc3VsdCBhbmQgcHJpbnQgdGV4dCBvbiBmYWlsdXJlLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uIC0gVGhlIHJlc3VsdCB0aGF0IGlzIGNoZWNrZWRcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gcHJpbnQgb24gZmFpbHVyZVxuICAgKi9cbiAgIENIRUNLX1RFWFQ6IGZ1bmN0aW9uIChjb25kaXRpb24sIHRleHQpIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAoY29uZGl0aW9uICE9PSB0cnVlKSB7XG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArIFwiXFx0TWVzc2FnZTogXCIgKyB0ZXh0ICsgXCJcXG5cXHRDSEVDSyBmYWlsZWRcIjtcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ2hlY2sgZm9yIGVxdWFsaXR5IGJldHdlZW4gdHdvIGVudGl0aWVzIHVzaW5nIHN0cmljdCBlcXVhbGl0eSAoPT09KVxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7YW55fSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCByZXN1bHRcbiAgICAgIEBwYXJhbSB7YW55fSBhY3R1YWwgLSBUaGUgYWN0dWFsIHJlc3VsdFxuICAgKi9cbiAgIENIRUNLX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nO1xuXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG5cbiAgICAgIGlmIChleHBlY3RlZCAhPT0gYWN0dWFsKSB7XG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIGV4cGVjdGVkICArIFwiPlxcblwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgYWN0dWFsICAgICsgXCI+XCI7XG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENoZWNrIGZvciBlcXVhbGl0eSBiZXR3ZWVuIHR3byBlbnRpdGllcyB1c2luZyBsb29zZSBlcXVhbGl0eSAoPT0pXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHthbnl9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIHJlc3VsdFxuICAgICAgQHBhcmFtIHthbnl9IGFjdHVhbCAtIFRoZSBhY3R1YWwgcmVzdWx0XG4gICAqL1xuICAgQ0hFQ0tfTE9PU0VfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsKSB7XG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XG5cbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcblxuICAgICAgaWYgKGV4cGVjdGVkICE9IGFjdHVhbCkge1xuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCA8XCIgKyBleHBlY3RlZCAgKyBcIj5cXG5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcdGJ1dCB3YXMgIDxcIiArIGFjdHVhbCAgICArIFwiPlwiO1xuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgICAgfVxuICAgfSxcblxuICAgLyoqXG4gICAgICBDaGVjayBmb3IgYW4gZXhjZXB0aW9uIHRvIGJlIHRocm93biBieSBjYWxsaW5nIGEgc3BlY2lmaWVkIGZ1bmN0aW9uLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7RXJyb3J9IGV4Y2VwdGlvbiAtIFRoZSByZXN1bHRpbmcgZXhjZXB0aW9uIHRoYXQgc2hvdWxkIGJlIHRocm93biBieSBjYWxsaW5nIGZ1bmNcbiAgICAgIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgLSBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZFxuICAgKi9cbiAgIENIRUNLX1RIUk9XOiBmdW5jdGlvbiAoZXhjZXB0aW9uLCBmdW5jKSB7XG4gICAgICB2YXIgICBlcnJvclN0cmluZyxcbiAgICAgICAgICAgIHRocm93biA9IGZhbHNlO1xuXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgICBmdW5jKCk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgaWYgKGV4Lm5hbWUgPT09IGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgdGhyb3duID0gdHJ1ZTtcbiAgICAgICAgIH1cbiAgICAgICAgIGVsc2VcbiAgICAgICAgIHtcbiAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRocm93bikge1xuICAgICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCBcIiArIGV4Y2VwdGlvbiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiB3YXMgbm90IHRocm93blwiO1xuXG4gICAgICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENoZWNrIGZvciBlcXVhbGl0eSB1c2luZyBleHBlY3RlZC50b1N0cmluZygpID09PSBhY3R1YWwudG9TdHJpbmcoKVxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7YW55fSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCByZXN1bHRcbiAgICAgIEBwYXJhbSB7YW55fSBhY3R1YWwgLSBUaGUgYWN0dWFsIHJlc3VsdFxuICAgKi9cbiAgIFNUUkNNUF9FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwpIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAoZXhwZWN0ZWQudG9TdHJpbmcoKSAhPT0gYWN0dWFsLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgPFwiICsgZXhwZWN0ZWQudG9TdHJpbmcoKSAgICsgXCI+XFxuXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBhY3R1YWwudG9TdHJpbmcoKSAgICAgKyBcIj5cIjtcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ29tcGFyZSB0d28gaW50ZWdlcnMuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIGludGVnZXIgcmVzdWx0XG4gICAgICBAcGFyYW0ge251bWJlcn0gYWN0dWFsIC0gVGhlIGFjdHVhbCBpbnRlZ2VyIHJlc3VsdFxuICAgKi9cbiAgIExPTkdTX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nO1xuXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG5cbiAgICAgIGlmICh0aGlzLl90b0ludChleHBlY3RlZCkgIT09IHRoaXMuX3RvSW50KGFjdHVhbCkpIHtcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgPFwiICsgTWF0aC5mbG9vcihleHBlY3RlZCkgICsgXCI+XFxuXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBNYXRoLmZsb29yKGFjdHVhbCkgICAgKyBcIj5cIjtcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ29tcGFyZSB0d28gOC1iaXQgd2lkZSBpbnRlZ2Vycy5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge251bWJlcn0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgOC1iaXQgd2lkZSBpbnRlZ2VyIHJlc3VsdFxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGFjdHVhbCAtIFRoZSBhY3R1YWwgOC1iaXQgd2lkZSBpbnRlZ2VyIHJlc3VsdFxuICAgKi9cbiAgIEJZVEVTX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xuICAgICAgdGhpcy5MT05HU19FUVVBTChleHBlY3RlZCAmIDB4RkYsIGFjdHVhbCAmIDB4RkYpO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBDb21wYXJlcyB0d28gbnVtYmVycyB3aXRoaW4gc29tZSB0b2xlcmFuY2UuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIHJlc3VsdFxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGFjdHVhbCAtIFRoZSBhY3R1YWwgcmVzdWx0XG4gICAgICBAcGFyYW0ge251bWJlcn0gdG9sZXJhbmNlIC0gVGhlIG1heGltdW0gZGlmZmVyZW5jZSB0aGF0IGlzIHRvbGVyYWJsZVxuICAgKi9cbiAgIERPVUJMRVNfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsLCB0b2xlcmFuY2UpIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAoTWF0aC5hYnMoZXhwZWN0ZWQgLSBhY3R1YWwpID4gdG9sZXJhbmNlKSB7XG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIGV4cGVjdGVkICArIFwiPlxcblwiICArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcdGJ1dCB3YXMgIDxcIiArIGFjdHVhbCAgICArIFwiPlwiICAgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIHRocmVzaG9sZCB3YXMgPFwiICsgdG9sZXJhbmNlICsgXCI+XCI7XG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIEFsd2F5cyBmYWlscyBhbmQgcHJpbnRzIHRleHQuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBwcmludCBvbiBmYWlsdXJlLlxuICAgKi9cbiAgIEZBSUw6IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICB2YXIgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyBcIlxcdFwiICsgdGV4dDtcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcbiAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgUmV0dXJuIGEgY2xvbmUgb2YgdGhlIHVUZXN0IG9iamVjdCB0aGF0IGhhcyBiZWVuIGluaXRpYWxpemVkLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICovXG4gICBjbG9uZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbmV3T2JqID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgICAgIG5ld09iai5faW5pdCgpO1xuICAgICAgcmV0dXJuIG5ld09iajtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgRW5hYmxlIGxvZ2dpbmcuIFRoaXMgaXMgZW5hYmxlZCBieSBkZWZhdWx0LlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICovXG4gICBlbmFibGVMb2dnaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9sb2dnaW5nID0gdHJ1ZTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgRGlzYWJsZSBsb2dnaW5nLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICovXG4gICBkaXNhYmxlTG9nZ2luZzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fbG9nZ2luZyA9IGZhbHNlO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBFbmFibGUgdmVyYm9zZSBsb2dnaW5nLiBUaGlzIGlzIGRpc2FibGVkIGJ5IGRlZmF1bHQuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgKi9cbiAgIGVuYWJsZVZlcmJvc2VMb2dnaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl92ZXJib3NlID0gdHJ1ZTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgRGlzYWJsZSB2ZXJib3NlIGxvZ2dpbmcuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgKi9cbiAgIGRpc2FibGVWZXJib3NlTG9nZ2luZzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fdmVyYm9zZSA9IGZhbHNlO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBSdW4gYWxsIHRoZSB0ZXN0cyB0aGF0IGFyZSBjdXJyZW50bHkgZGVmaW5lZC5cblxuICAgICAgQGluc3RhbmNlXG4gICAqL1xuICAgcnVuQWxsVGVzdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX3J1bihudWxsLCBudWxsKTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgUnVuIGEgc3BlY2lmaWMgdGVzdCBncm91cC5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge3N0cmluZ30gZ3JvdXBOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGdyb3VwIHRvIHJ1blxuICAgKi9cbiAgIHJ1blRlc3RHcm91cDogZnVuY3Rpb24gKGdyb3VwTmFtZSkge1xuICAgICAgdGhpcy5fcnVuKGdyb3VwTmFtZSwgbnVsbCk7XG4gICB9LFxuXG4gICAvKiogXG4gICAgICBSdW4gYSBzcGVjaWZpYyB0ZXN0LlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gdGVzdCAtIElmIHRlc3QgaXMgYSBzdHJpbmcgdGhlbiBydW4gYWxsIHRoZSB0ZXN0cyB3aXRoIHRoYXQgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyd2lzZSwgdGVzdCBzaG91bGQgYmUgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGx3aW5nIHByb3BlcnRpZXM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+Z3JvdXA8L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cCBpbiB3aGljaCB0aGUgdGVzdCBiZWxvbmdzPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5uYW1lPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgdGVzdCB0byBydW48L2RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kbD5cbiAgICovXG4gICBydW5UZXN0OiBmdW5jdGlvbiAodGVzdCkge1xuICAgICAgdmFyICAgZ3JvdXBOYW1lID0gbnVsbCxcbiAgICAgICAgICAgIHRlc3ROYW1lID0gbnVsbDtcblxuICAgICAgaWYgKHR5cGVvZiB0ZXN0ID09PSBcInN0cmluZ1wiKSB7XG5cbiAgICAgICAgIHRlc3ROYW1lID0gdGVzdDtcblxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGVzdCA9PT0gXCJvYmplY3RcIikge1xuXG4gICAgICAgICBpZiAoXCJncm91cFwiIGluIHRlc3QpIHtcbiAgICAgICAgICAgIGdyb3VwTmFtZSA9IHRlc3QuZ3JvdXA7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmIChcIm5hbWVcIiBpbiB0ZXN0KSB7XG4gICAgICAgICAgICB0ZXN0TmFtZSA9IHRlc3QubmFtZTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRlc3ROYW1lICE9PSBudWxsKSB7XG4gICAgICAgICB0aGlzLl9ydW4oZ3JvdXBOYW1lLCB0ZXN0TmFtZSk7XG4gICAgICB9XG4gICB9LFxuXG4gICBfdGVzdEdyb3VwczogICB7IFwiX2RlZmF1bHRcIjogeyBuYW1lOiBcIl9kZWZhdWx0XCIsIHRlc3RzOiBbIF0gfSB9LFxuICAgX2ZhaWxDb3VudDogICAgMCxcbiAgIF9ydW5Db3VudDogICAgIDAsXG4gICBfY2hlY2tDb3VudDogICAwLFxuICAgX2lnbm9yZUNvdW50OiAgMCxcbiAgIF9zdGFydFRpbWU6ICAgIDAsXG4gICBfdmVyYm9zZTogICAgICBmYWxzZSxcbiAgIF9sb2dnaW5nOiAgICAgIHRydWUsXG4gICBfY3VycmVudEdyb3VwOiBcIlwiLFxuICAgX2N1cnJlbnRUZXN0OiAgXCJcIixcblxuICAgX2luaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX3Rlc3RHcm91cHMgICAgID0geyBcIl9kZWZhdWx0XCI6IHsgbmFtZTogXCJfZGVmYXVsdFwiLCB0ZXN0czogWyBdIH0gfTtcbiAgICAgIHRoaXMuX2ZhaWxDb3VudCAgICAgID0gMDtcbiAgICAgIHRoaXMuX3J1bkNvdW50ICAgICAgID0gMDtcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQgICAgID0gMDtcbiAgICAgIHRoaXMuX2lnbm9yZUNvdW50ICAgID0gMDtcbiAgICAgIHRoaXMuX3N0YXJ0VGltZSAgICAgID0gMDtcbiAgICAgIHRoaXMuX3ZlcmJvc2UgICAgICAgID0gZmFsc2U7XG4gICAgICB0aGlzLl9sb2dnaW5nICAgICAgICA9IHRydWU7XG4gICAgICB0aGlzLl9jdXJyZW50R3JvdXAgICA9IFwiXCI7XG4gICAgICB0aGlzLl9jdXJyZW50VGVzdCAgICA9IFwiXCI7XG4gICB9LFxuXG4gICBfbG9nOiBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgaWYgKHRoaXMuX2xvZ2dpbmcgPT09IHRydWUpIHtcbiAgICAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xuICAgICAgfVxuICAgfSxcblxuICAgX3J1bjogZnVuY3Rpb24gKGdyb3VwTmFtZSwgdGVzdE5hbWUpIHtcbiAgICAgIHZhciAgIHRlc3RzLFxuICAgICAgICAgICAgc3RhcnQ7XG5cbiAgICAgIHRoaXMuX3Jlc2V0UmVzdWx0cygpO1xuXG4gICAgICB0ZXN0cyA9IHRoaXMuX2ZpbmRUZXN0cyhncm91cE5hbWUsIHRlc3ROYW1lKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXN0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICBzdGFydCA9IERhdGUubm93KCk7XG5cbiAgICAgICAgIGlmICh0ZXN0c1tpXS5pZ25vcmUgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZlcmJvc2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgIHRoaXMuX2xvZyhcIklHTk9SRV9URVNUKFwiICsgdGVzdHNbaV0uZ3JvdXAgK1xuICAgICAgICAgICAgICAgICAgICAgXCIsIFwiICsgdGVzdHNbaV0ubmFtZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faWdub3JlQ291bnQrKztcbiAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92ZXJib3NlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICB0aGlzLl9sb2coXCJURVNUKFwiICsgdGVzdHNbaV0uZ3JvdXAgK1xuICAgICAgICAgICAgICAgICAgICAgXCIsIFwiICsgdGVzdHNbaV0ubmFtZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcnVuVGVzdE9iaih0ZXN0c1tpXSk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmICh0aGlzLl92ZXJib3NlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLl9sb2coXCIgLSBcIiArIChEYXRlLm5vdygpIC0gc3RhcnQpICsgXCIgbXNcXG5cIik7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2xvZ1Jlc3VsdHMoZ3JvdXBOYW1lLCB0ZXN0TmFtZSk7XG4gICB9LFxuXG4gICBfVGVzdEVycm9yOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5uYW1lID0gXCJUZXN0RXJyb3JcIjtcbiAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcblwiO1xuICAgfSxcblxuICAgX3Rocm93VGVzdEVycm9yOiBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgaWYgKHRoaXMuX1Rlc3RFcnJvci5wcm90b3R5cGUudG9TdHJpbmcoKSAhPT0gXCJFcnJvclwiKSB7XG4gICAgICAgICB0aGlzLl9UZXN0RXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgdGhpcy5fVGVzdEVycm9yKG1lc3NhZ2UpO1xuICAgfSxcblxuICAgX2J1aWxkRXJyb3JTdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAgIGVycm9yID0gKGZ1bmN0aW9uICgpIHsgdHJ5IHsgdGhyb3cgbmV3IEVycm9yKCk7IH0gY2F0Y2ggKGV4KSB7cmV0dXJuIGV4O319KSgpLFxuICAgICAgICAgICAgZXJyb3JTdHJpbmcgPSBcIlwiLFxuICAgICAgICAgICAgY2FsbGVyTGluZXMsXG4gICAgICAgICAgICBtYXRjaGVzO1xuXG4gICAgICBpZiAoZXJyb3Iuc3RhY2spIHtcbiAgICAgICAgIGNhbGxlckxpbmVzID0gZXJyb3Iuc3RhY2suc3BsaXQoXCJcXG5cIilbNF07XG4gICAgICAgICBtYXRjaGVzID0gY2FsbGVyTGluZXMubWF0Y2goL1xcKCguKilcXCkvKTtcbiAgICAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnJvclN0cmluZyArPSBtYXRjaGVzWzFdICsgXCI6IFwiO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlcnJvclN0cmluZyArPSBcImVycm9yOiBGYWlsdXJlIGluIFRFU1QoXCI7XG5cbiAgICAgIGlmICh0aGlzLl9jdXJyZW50R3JvdXAgIT09IFwiX2RlZmF1bHRcIikge1xuICAgICAgICAgZXJyb3JTdHJpbmcgKz0gdGhpcy5fY3VycmVudEdyb3VwICsgXCIsIFwiO1xuICAgICAgfVxuXG4gICAgICBlcnJvclN0cmluZyArPSB0aGlzLl9jdXJyZW50VGVzdCArIFwiKVxcblwiO1xuXG4gICAgICByZXR1cm4gZXJyb3JTdHJpbmc7XG4gICB9LFxuXG4gICBfZmluZFRlc3RzOiBmdW5jdGlvbiAoZ3JvdXBOYW1lLCB0ZXN0TmFtZSkge1xuICAgICAgdmFyIG1hdGNoaW5nVGVzdHMgPSBbIF07XG5cbiAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcy5fdGVzdEdyb3Vwcykge1xuXG4gICAgICAgICBpZiAoKGdyb3VwTmFtZSA9PT0gbnVsbCkgfHwgKG5hbWUgPT09IGdyb3VwTmFtZSkpIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90ZXN0R3JvdXBzW25hbWVdLnRlc3RzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgIGlmICgodGVzdE5hbWUgPT09IG51bGwpIHx8ICh0aGlzLl90ZXN0R3JvdXBzW25hbWVdLnRlc3RzW2ldLm5hbWUgPT0gdGVzdE5hbWUpKSB7XG5cbiAgICAgICAgICAgICAgICAgIG1hdGNoaW5nVGVzdHMucHVzaCh0aGlzLl90ZXN0R3JvdXBzW25hbWVdLnRlc3RzW2ldKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1hdGNoaW5nVGVzdHM7XG4gICB9LFxuXG4gICBfZ2V0VGVzdENvdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY291bnQgPSAwO1xuXG4gICAgICBmb3IgKHZhciBncm91cE5hbWUgaW4gdGhpcy5fdGVzdEdyb3Vwcykge1xuICAgICAgICAgY291bnQgKz0gdGhpcy5fdGVzdEdyb3Vwc1tncm91cE5hbWVdLnRlc3RzLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvdW50O1xuICAgfSxcblxuICAgX3Jlc2V0UmVzdWx0czogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fZmFpbENvdW50ICAgID0gMDtcbiAgICAgIHRoaXMuX3J1bkNvdW50ICAgICA9IDA7XG4gICAgICB0aGlzLl9jaGVja0NvdW50ICAgPSAwO1xuICAgICAgdGhpcy5faWdub3JlQ291bnQgID0gMDtcbiAgICAgIHRoaXMuX3N0YXJ0VGltZSAgICA9IERhdGUubm93KCk7XG4gICB9LFxuXG4gICBfbG9nUmVzdWx0czogZnVuY3Rpb24gKGdyb3VwTmFtZSwgdGVzdE5hbWUpIHtcbiAgICAgIHZhciAgIHJlc3VsdHMsXG4gICAgICAgICAgICB0ZXN0Q291bnQsXG4gICAgICAgICAgICBzdG9wVGltZTtcblxuICAgICAgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICBpZiAodGhpcy5fZmFpbENvdW50ID4gMCkge1xuICAgICAgICAgcmVzdWx0cyA9ICAgXCJFcnJvcnMgKFwiICAgICArXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWlsQ291bnQ7XG4gICAgICAgICBpZiAodGhpcy5fZmFpbENvdW50ID09PSAxKSB7XG4gICAgICAgICAgICByZXN1bHRzICs9IFwiIGZhaWx1cmUsIFwiO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdHMgKz0gXCIgZmFpbHVyZXMsIFwiO1xuICAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJlc3VsdHMgPSBcIk9LIChcIjtcbiAgICAgIH1cblxuICAgICAgdGVzdENvdW50ID0gdGhpcy5fZ2V0VGVzdENvdW50KCk7XG4gICAgICByZXN1bHRzICs9IHRlc3RDb3VudDtcbiAgICAgIGlmICh0ZXN0Q291bnQgPT09IDEpIHtcbiAgICAgICAgIHJlc3VsdHMgKz0gXCIgdGVzdCwgXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmVzdWx0cyArPSBcIiB0ZXN0cywgXCI7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdHMgKz0gdGhpcy5fcnVuQ291bnQgKyBcIiByYW4sIFwiO1xuXG4gICAgICByZXN1bHRzICs9IHRoaXMuX2NoZWNrQ291bnQ7XG4gICAgICBpZiAodGhpcy5fY2hlY2tDb3VudCA9PT0gMSkge1xuICAgICAgICAgcmVzdWx0cyArPSBcIiBjaGVjaywgXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmVzdWx0cyArPSBcIiBjaGVja3MsIFwiO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRzICs9IHRoaXMuX2lnbm9yZUNvdW50ICsgXCIgaWdub3JlZCwgXCI7XG4gICAgICByZXN1bHRzICs9IHRoaXMuX2dldFRlc3RDb3VudCgpIC0gKHRoaXMuX3J1bkNvdW50ICsgdGhpcy5faWdub3JlQ291bnQpO1xuICAgICAgcmVzdWx0cyArPSBcIiBmaWx0ZXJlZCBvdXQsIFwiO1xuICAgICAgcmVzdWx0cyArPSAoc3RvcFRpbWUgLSB0aGlzLl9zdGFydFRpbWUpICsgXCIgbXMpXFxuXFxuXCI7XG5cbiAgICAgIHRoaXMuX2xvZyhyZXN1bHRzKTtcbiAgIH0sXG5cbiAgIF9ydW5UZXN0T2JqOiBmdW5jdGlvbiAodGVzdCkge1xuICAgICAgdmFyIGdyb3VwID0gdGhpcy5fdGVzdEdyb3Vwc1t0ZXN0Lmdyb3VwXTtcblxuICAgICAgdGhpcy5fY3VycmVudEdyb3VwID0gdGVzdC5ncm91cDtcbiAgICAgIHRoaXMuX2N1cnJlbnRUZXN0ICA9IHRlc3QubmFtZTtcblxuICAgICAgdGhpcy5fcnVuQ291bnQrKztcblxuICAgICAgdHJ5IHtcblxuICAgICAgICAgaWYgKHR5cGVvZiBncm91cC5zZXR1cCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBncm91cC5zZXR1cCh0ZXN0KTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKHR5cGVvZiB0ZXN0LnJ1biA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0ZXN0LnJ1bigpO1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZiAodHlwZW9mIGdyb3VwLnRlYXJkb3duID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGdyb3VwLnRlYXJkb3duKHRlc3QpO1xuICAgICAgICAgfVxuXG4gICAgICB9IGNhdGNoIChleCkge1xuXG4gICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiB0aGlzLl9UZXN0RXJyb3IpIHtcblxuICAgICAgICAgICAgdGhpcy5fbG9nKGV4Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgdGhpcy5fZmFpbENvdW50Kys7XG5cbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH0sXG5cbiAgIF90b0ludDogZnVuY3Rpb24gKG51bSkge1xuICAgICAgcmV0dXJuIChudW0gPCAwKSA/IE1hdGguY2VpbChudW0pIDogTWF0aC5mbG9vcihudW0pO1xuICAgfVxufTtcbiIsInJlcXVpcmUoXCIuL3Rlc3RzXCIpO1xudmFyIHVUZXN0ID0gcmVxdWlyZShcIi4uLy4uL3NyYy91VGVzdFwiKTtcblxuLy8gQWRkIGEgY291cGxlIGNoZWNrcyBvdXRzaWRlIG9mIHRlc3RzIHRvIG1ha2Ugc3VyZSBpdFxuLy8gZG9lc24ndCBjYXVzZSBwcm9ibGVtc1xudVRlc3QuQ0hFQ0sodHJ1ZSk7XG51VGVzdC5TVFJDTVBfRVFVQUwoXCJoZWxsb1wiLCBcImhlbGxvXCIpO1xuXG51VGVzdC5lbmFibGVWZXJib3NlTG9nZ2luZygpO1xuXG51VGVzdC5ydW5BbGxUZXN0cygpO1xuIiwidmFyIHVUZXN0ID0gcmVxdWlyZShcIi4uLy4uL3NyYy91VGVzdFwiKTtcblxudVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiU2VsZlRlc3RzXCIsXG5cbiAgIHNldHVwOiBmdW5jdGlvbiAodGVzdCkge1xuICAgICAgdGVzdC5teVRlc3QgPSB1VGVzdC5jbG9uZSgpO1xuICAgICAgdGVzdC5teVRlc3QuZGlzYWJsZUxvZ2dpbmcoKTtcbiAgIH0sXG5cbiAgIHRlYXJkb3duOiBmdW5jdGlvbiAodGVzdCkge1xuICAgICAgZGVsZXRlIHRlc3QubXlUZXN0O1xuICAgfVxufSk7XG5cbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJDbG9uZVwiLFxuICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzLm15VGVzdCkgPT09IHVUZXN0KTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2dldFRlc3RDb3VudCgpID09PSAwKTtcbiAgIH1cbn0pO1xuXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiTG9nZ2luZ1wiLFxuICAgcnVuOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHRoaXMubXlUZXN0Ll9sb2dnaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLm15VGVzdC5lbmFibGVMb2dnaW5nKCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9sb2dnaW5nKTtcblxuICAgICAgdGhpcy5teVRlc3QuX2xvZ2dpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5teVRlc3QuZGlzYWJsZUxvZ2dpbmcoKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwodGhpcy5teVRlc3QuX2xvZ2dpbmcsIGZhbHNlKTtcblxuICAgICAgdGhpcy5teVRlc3QuX3ZlcmJvc2UgPSBmYWxzZTtcbiAgICAgIHRoaXMubXlUZXN0LmVuYWJsZVZlcmJvc2VMb2dnaW5nKCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll92ZXJib3NlKTtcblxuICAgICAgdGhpcy5teVRlc3QuX3ZlcmJvc2UgPSB0cnVlO1xuICAgICAgdGhpcy5teVRlc3QuZGlzYWJsZVZlcmJvc2VMb2dnaW5nKCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKHRoaXMubXlUZXN0Ll92ZXJib3NlLCBmYWxzZSk7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIlBhc3NpbmdDaGVja3NcIixcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJQYXNzaW5nQ2hlY2tzR3JvdXBcIiB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIlBhc3NpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIlRlc3RcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgweDhmLCAweDhmKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKHRydWUsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19URVhUKDEgPT09IDEsIFwiV2hlbiBkb2VzIDEgIT09IDE/XCIpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5ET1VCTEVTX0VRVUFMKDIuMSwgMi4yLCAwLjEwMDAwMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKDIsIDIpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5TVFJDTVBfRVFVQUwoXCJvbmVcIiwgXCJvbmVcIik7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX0xPT1NFX0VRVUFMKDEwMDAsIFwiMTAwMFwiKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5ydW5BbGxUZXN0cygpO1xuXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKDEsIHRoaXMubXlUZXN0Ll9nZXRUZXN0Q291bnQoKSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKDAsIHRoaXMubXlUZXN0Ll9mYWlsQ291bnQpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgxLCB0aGlzLm15VGVzdC5fcnVuQ291bnQpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCg4LCB0aGlzLm15VGVzdC5fY2hlY2tDb3VudCk7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkZhaWxpbmdDaGVja3NcIixcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMHg4ZiwgMHg5MCk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0soZmFsc2UpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJDSEVDS19FUVVBTFwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKHRydWUsIGZhbHNlKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfRVFVQUxfMlwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKDIsIFwiMlwiKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfTE9PU0VfRVFVQUxcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgyLCBcIjNcIik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLX1RFWFRcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19URVhUKDEgPT09IDAsIFwiMSBzaG91bGQgbm90IGVxdWFsIDBcIik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkRPVUJMRVNfRVFVQUxcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5ET1VCTEVTX0VRVUFMKDIuMSwgMi4zLCAwLjEwMDAxKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCg1LCA2KTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiU1RSQ01QX0VRVUFMXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuU1RSQ01QX0VRVUFMKFwib25lXCIsIFwidHdvXCIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJGQUlMXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuRkFJTChcIkZhaWwgbWUhXCIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XG5cbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2dldFRlc3RDb3VudCgpID09PSAxMCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICAgICA9PT0gMTApO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgICAgPT09IDEwKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2NoZWNrQ291bnQgICAgID09PSAxMCk7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkxPTkdTX0VRVUFMXCIsXG4gICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkxPTkdTX0VRVUFMX0dyb3VwXCIgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9Hcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMX1Bhc3NcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgwLCAwKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoMSwgMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKDEsIDEuMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0xLCAtMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0xLCAtMS4xKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoTnVtYmVyLk1BWF9WQUxVRSwgTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NSU5fVkFMVUUsIE51bWJlci5NSU5fVkFMVUUpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzFcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAyKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMX0ZhaWxfMlwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKDEsIDAuMSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzNcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgtMSwgLTIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF80XCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoLTIsIC0xLjEpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF81XCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoTnVtYmVyLk1BWF9WQUxVRSwgTnVtYmVyLk1JTl9WQUxVRSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuXG4gICAgICB0aGlzLm15VGVzdC5ydW5UZXN0KFwiTE9OR1NfRVFVQUxfUGFzc1wiKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3J1bkNvdW50ICAgID09PSAxKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSAwKTtcblxuICAgICAgdGhpcy5teVRlc3QucnVuVGVzdEdyb3VwKFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3J1bkNvdW50ICAgID09PSA1KTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSA1KTtcbiAgIH1cbn0pO1xuXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiQllURVNfRVFVQUxcIixcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5teVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiQllURVNfRVFVQUxfR3JvdXBcIiB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfUGFzc1wiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDAsIDApO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgxLCAxKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMSwgMS4xKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoLTEsIC0xKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoLTEsIC0xLjEpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgweDFBQSwgMHhBQSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfMVwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDEsIDIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF8yXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMSwgMC4xKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfM1wiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKC0xLCAtMik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJCWVRFU19FUVVBTF9GYWlsXzRcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgtMiwgLTEuMSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QucnVuVGVzdChcIkJZVEVTX0VRVUFMX1Bhc3NcIik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3RHcm91cChcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gNCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gNCk7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkNIRUNLX1RSSE9XU1wiLFxuXG4gICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVUZXN0LkNIRUNLX1RIUk9XKFwiUmVmZXJlbmNlRXJyb3JcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgY2FsbEFSYW5kb21Ob25FeGlzdGluZ0Z1bmN0aW9uKCk7XG4gICAgICB9KTtcbiAgIH1cblxufSk7XG5cbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJVc2VUZXN0V2l0aG91dEdyb3VwXCIsXG5cbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHtuYW1lOiBcIlRlc3RXaXRob3V0R3JvdXBcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDSyh0cnVlKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5JR05PUkVfVEVTVCh7bmFtZTogXCJJZ25vcmVUZXN0V2l0aG91dEdyb3VwXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodHJ1ZSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QucnVuVGVzdChcIlRlc3RXaXRob3V0R3JvdXBcIik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9pZ25vcmVDb3VudCA9PT0gMSk7XG4gICB9XG5cbn0pO1xuIl19
