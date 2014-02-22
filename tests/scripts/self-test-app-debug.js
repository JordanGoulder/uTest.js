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
      Check for a true result.

      @instance
      @param {boolean} condition - The result that is checked
   */
   CHECK_TRUE: function (condition) {
      this.CHECK(condition);
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
            this.uTest.CHECK_TRUE(true);
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
      this.uTest.CHECK_EQUAL(9, this.myTest._checkCount);
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

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK_TRUE",
         run: function () {
            this.uTest.CHECK_TRUE(false);
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

      this.uTest.CHECK(this.myTest._getTestCount() === 11);
      this.uTest.CHECK(this.myTest._failCount      === 11);
      this.uTest.CHECK(this.myTest._runCount       === 11);
      this.uTest.CHECK(this.myTest._checkCount     === 11);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvc3JjL3VUZXN0LmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvdGVzdHMvc2NyaXB0cy9tYWluLmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvdGVzdHMvc2NyaXB0cy90ZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gICBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuICAgQ29weXJpZ2h0IChjKSAyMDE0IEpvcmRhbiBHb3VsZGVyLCBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4gICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gICBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gICBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gICB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gICBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAgIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICAgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICAgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAgIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAgIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gICBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICAgU09GVFdBUkUuXG4qL1xuXG4vKipcbiAgIEEgdW5pdCB0ZXN0IGZyYW1ld29yayBmb3IgSmF2YVNjcmlwdCBtb2RlbGVkIGFmdGVyIGNwcFVUZXN0LlxuICAgQG1vZHVsZSB1VGVzdFxuKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAvKipcbiAgICAgIERlZmluZSBhIHRlc3QgZ3JvdXAuXG5cbiAgICAgIEBpbnN0YW5jZSBcbiAgICAgIEBwYXJhbSB7b2JqZWN0fSBncm91cCAtIEEgZ3JvdXAgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pm5hbWU8L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+c2V0dXAgPGVtPihvcHRpb25hbCk8L2VtPjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIHNldHVwIGZ1bmN0aW9uIHRoYXQgaXMgcnVuIGJlZm9yZSBlYWNoIHRlc3QgaW4gdGhlIGdyb3VwPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD50ZWFyZG93biA8ZW0+KG9wdGlvbmFsKTwvZW0+PC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgdGVhcmRvd24gZnVuY3Rpb24gdGhhdCBpcyBydW4gYWZ0ZXIgZWFjaCB0ZXN0IGluIHRoZSBncm91cDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgKi9cbiAgIFRFU1RfR1JPVVA6IGZ1bmN0aW9uIChncm91cCkge1xuICAgICAgZ3JvdXAudGVzdHMgPSBbIF07XG4gICAgICB0aGlzLl90ZXN0R3JvdXBzW2dyb3VwLm5hbWVdID0gZ3JvdXA7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIERlZmluZSBhIHRlc3QuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtvYmplY3R9IHRlc3QgLSBBIHRlc3Qgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pmdyb3VwIDxlbT4ob3B0aW9uYWwpPC9lbT48L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cCBpbiB3aGljaCB0aGUgdGVzdCBiZWxvbmdzPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5uYW1lPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgdGVzdDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+cnVuPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgZnVuY3Rpb24gdGhhdCBpcyBydW4gdG8gcGVyZm9ybSB0aGUgdGVzdDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgKi9cbiAgIFRFU1Q6IGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICB0ZXN0Lmdyb3VwID0gdGVzdC5ncm91cCB8fCBcIl9kZWZhdWx0XCI7XG4gICAgICB0ZXN0LnVUZXN0ID0gdGhpcztcbiAgICAgIHRlc3QuaWdub3JlID0gZmFsc2U7XG4gICAgICB0aGlzLl90ZXN0R3JvdXBzW3Rlc3QuZ3JvdXBdLnRlc3RzLnB1c2godGVzdCk7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIERlZmluZSBhIHRlc3QgdGhhdCB3aWxsIGJlIGlnbm9yZWQuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtvYmplY3R9IHRlc3QgLSBBIHRlc3Qgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pmdyb3VwIDxlbT4ob3B0aW9uYWwpPC9lbT48L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cCBpbiB3aGljaCB0aGUgdGVzdCBiZWxvbmdzPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5uYW1lPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgdGVzdDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+cnVuPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgZnVuY3Rpb24gdGhhdCBpcyBydW4gdG8gcGVyZm9ybSB0aGUgdGVzdDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICovXG4gICBJR05PUkVfVEVTVDogZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgIHRoaXMuVEVTVCh0ZXN0KTtcbiAgICAgIHRlc3QuaWdub3JlID0gdHJ1ZTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ2hlY2sgYSBib29sZWFuIHJlc3VsdC5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXG4gICAqL1xuICAgQ0hFQ0s6IGZ1bmN0aW9uIChjb25kaXRpb24pIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAoY29uZGl0aW9uICE9PSB0cnVlKSB7XG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArIFwiXFx0Q0hFQ0sgZmFpbGVkXCI7XG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENoZWNrIGZvciBhIHRydWUgcmVzdWx0LlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uIC0gVGhlIHJlc3VsdCB0aGF0IGlzIGNoZWNrZWRcbiAgICovXG4gICBDSEVDS19UUlVFOiBmdW5jdGlvbiAoY29uZGl0aW9uKSB7XG4gICAgICB0aGlzLkNIRUNLKGNvbmRpdGlvbik7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENoZWNrIGEgYm9vbGVhbiByZXN1bHQgYW5kIHByaW50IHRleHQgb24gZmFpbHVyZS5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXG4gICAgICBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIHByaW50IG9uIGZhaWx1cmVcbiAgICovXG4gICBDSEVDS19URVhUOiBmdW5jdGlvbiAoY29uZGl0aW9uLCB0ZXh0KSB7XG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XG5cbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcblxuICAgICAgaWYgKGNvbmRpdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyBcIlxcdE1lc3NhZ2U6IFwiICsgdGV4dCArIFwiXFxuXFx0Q0hFQ0sgZmFpbGVkXCI7XG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENoZWNrIGZvciBlcXVhbGl0eSBiZXR3ZWVuIHR3byBlbnRpdGllcyB1c2luZyBzdHJpY3QgZXF1YWxpdHkgKD09PSlcblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge2FueX0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgcmVzdWx0XG4gICAgICBAcGFyYW0ge2FueX0gYWN0dWFsIC0gVGhlIGFjdHVhbCByZXN1bHRcbiAgICovXG4gICBDSEVDS19FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwpIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAoZXhwZWN0ZWQgIT09IGFjdHVhbCkge1xuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCA8XCIgKyBleHBlY3RlZCAgKyBcIj5cXG5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcdGJ1dCB3YXMgIDxcIiArIGFjdHVhbCAgICArIFwiPlwiO1xuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgICAgfVxuICAgfSxcblxuICAgLyoqXG4gICAgICBDaGVjayBmb3IgZXF1YWxpdHkgYmV0d2VlbiB0d28gZW50aXRpZXMgdXNpbmcgbG9vc2UgZXF1YWxpdHkgKD09KVxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7YW55fSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCByZXN1bHRcbiAgICAgIEBwYXJhbSB7YW55fSBhY3R1YWwgLSBUaGUgYWN0dWFsIHJlc3VsdFxuICAgKi9cbiAgIENIRUNLX0xPT1NFX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nO1xuXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG5cbiAgICAgIGlmIChleHBlY3RlZCAhPSBhY3R1YWwpIHtcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgPFwiICsgZXhwZWN0ZWQgICsgXCI+XFxuXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBhY3R1YWwgICAgKyBcIj5cIjtcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ2hlY2sgZm9yIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gYnkgY2FsbGluZyBhIHNwZWNpZmllZCBmdW5jdGlvbi5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge0Vycm9yfSBleGNlcHRpb24gLSBUaGUgcmVzdWx0aW5nIGV4Y2VwdGlvbiB0aGF0IHNob3VsZCBiZSB0aHJvd24gYnkgY2FsbGluZyBmdW5jXG4gICAgICBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIC0gVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWRcbiAgICovXG4gICBDSEVDS19USFJPVzogZnVuY3Rpb24gKGV4Y2VwdGlvbiwgZnVuYykge1xuICAgICAgdmFyICAgZXJyb3JTdHJpbmcsXG4gICAgICAgICAgICB0aHJvd24gPSBmYWxzZTtcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICB0cnkge1xuICAgICAgICAgZnVuYygpO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgIGlmIChleC5uYW1lID09PSBleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHRocm93biA9IHRydWU7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlXG4gICAgICAgICB7XG4gICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aHJvd24pIHtcbiAgICAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgXCIgKyBleGNlcHRpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgd2FzIG5vdCB0aHJvd25cIjtcblxuICAgICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgICAgfVxuICAgfSxcblxuICAgLyoqXG4gICAgICBDaGVjayBmb3IgZXF1YWxpdHkgdXNpbmcgZXhwZWN0ZWQudG9TdHJpbmcoKSA9PT0gYWN0dWFsLnRvU3RyaW5nKClcblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge2FueX0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgcmVzdWx0XG4gICAgICBAcGFyYW0ge2FueX0gYWN0dWFsIC0gVGhlIGFjdHVhbCByZXN1bHRcbiAgICovXG4gICBTVFJDTVBfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsKSB7XG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XG5cbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcblxuICAgICAgaWYgKGV4cGVjdGVkLnRvU3RyaW5nKCkgIT09IGFjdHVhbC50b1N0cmluZygpKSB7XG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIGV4cGVjdGVkLnRvU3RyaW5nKCkgICArIFwiPlxcblwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgYWN0dWFsLnRvU3RyaW5nKCkgICAgICsgXCI+XCI7XG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENvbXBhcmUgdHdvIGludGVnZXJzLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCBpbnRlZ2VyIHJlc3VsdFxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGFjdHVhbCAtIFRoZSBhY3R1YWwgaW50ZWdlciByZXN1bHRcbiAgICovXG4gICBMT05HU19FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwpIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAodGhpcy5fdG9JbnQoZXhwZWN0ZWQpICE9PSB0aGlzLl90b0ludChhY3R1YWwpKSB7XG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIE1hdGguZmxvb3IoZXhwZWN0ZWQpICArIFwiPlxcblwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgTWF0aC5mbG9vcihhY3R1YWwpICAgICsgXCI+XCI7XG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENvbXBhcmUgdHdvIDgtYml0IHdpZGUgaW50ZWdlcnMuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIDgtYml0IHdpZGUgaW50ZWdlciByZXN1bHRcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBhY3R1YWwgLSBUaGUgYWN0dWFsIDgtYml0IHdpZGUgaW50ZWdlciByZXN1bHRcbiAgICovXG4gICBCWVRFU19FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwpIHtcbiAgICAgIHRoaXMuTE9OR1NfRVFVQUwoZXhwZWN0ZWQgJiAweEZGLCBhY3R1YWwgJiAweEZGKTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ29tcGFyZXMgdHdvIG51bWJlcnMgd2l0aGluIHNvbWUgdG9sZXJhbmNlLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCByZXN1bHRcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBhY3R1YWwgLSBUaGUgYWN0dWFsIHJlc3VsdFxuICAgICAgQHBhcmFtIHtudW1iZXJ9IHRvbGVyYW5jZSAtIFRoZSBtYXhpbXVtIGRpZmZlcmVuY2UgdGhhdCBpcyB0b2xlcmFibGVcbiAgICovXG4gICBET1VCTEVTX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCwgdG9sZXJhbmNlKSB7XG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XG5cbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcblxuICAgICAgaWYgKE1hdGguYWJzKGV4cGVjdGVkIC0gYWN0dWFsKSA+IHRvbGVyYW5jZSkge1xuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCA8XCIgKyBleHBlY3RlZCAgKyBcIj5cXG5cIiAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBhY3R1YWwgICAgKyBcIj5cIiAgICArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiB0aHJlc2hvbGQgd2FzIDxcIiArIHRvbGVyYW5jZSArIFwiPlwiO1xuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgICAgfVxuICAgfSxcblxuICAgLyoqXG4gICAgICBBbHdheXMgZmFpbHMgYW5kIHByaW50cyB0ZXh0LlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gcHJpbnQgb24gZmFpbHVyZS5cbiAgICovXG4gICBGQUlMOiBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgXCJcXHRcIiArIHRleHQ7XG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG4gICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIFJldHVybiBhIGNsb25lIG9mIHRoZSB1VGVzdCBvYmplY3QgdGhhdCBoYXMgYmVlbiBpbml0aWFsaXplZC5cblxuICAgICAgQGluc3RhbmNlXG4gICAqL1xuICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5ld09iaiA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG4gICAgICBuZXdPYmouX2luaXQoKTtcbiAgICAgIHJldHVybiBuZXdPYmo7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIEVuYWJsZSBsb2dnaW5nLiBUaGlzIGlzIGVuYWJsZWQgYnkgZGVmYXVsdC5cblxuICAgICAgQGluc3RhbmNlXG4gICAqL1xuICAgZW5hYmxlTG9nZ2luZzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fbG9nZ2luZyA9IHRydWU7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIERpc2FibGUgbG9nZ2luZy5cblxuICAgICAgQGluc3RhbmNlXG4gICAqL1xuICAgZGlzYWJsZUxvZ2dpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2xvZ2dpbmcgPSBmYWxzZTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgRW5hYmxlIHZlcmJvc2UgbG9nZ2luZy4gVGhpcyBpcyBkaXNhYmxlZCBieSBkZWZhdWx0LlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICovXG4gICBlbmFibGVWZXJib3NlTG9nZ2luZzogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fdmVyYm9zZSA9IHRydWU7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIERpc2FibGUgdmVyYm9zZSBsb2dnaW5nLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICovXG4gICBkaXNhYmxlVmVyYm9zZUxvZ2dpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX3ZlcmJvc2UgPSBmYWxzZTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgUnVuIGFsbCB0aGUgdGVzdHMgdGhhdCBhcmUgY3VycmVudGx5IGRlZmluZWQuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgKi9cbiAgIHJ1bkFsbFRlc3RzOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9ydW4obnVsbCwgbnVsbCk7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIFJ1biBhIHNwZWNpZmljIHRlc3QgZ3JvdXAuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtzdHJpbmd9IGdyb3VwTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBncm91cCB0byBydW5cbiAgICovXG4gICBydW5UZXN0R3JvdXA6IGZ1bmN0aW9uIChncm91cE5hbWUpIHtcbiAgICAgIHRoaXMuX3J1bihncm91cE5hbWUsIG51bGwpO1xuICAgfSxcblxuICAgLyoqIFxuICAgICAgUnVuIGEgc3BlY2lmaWMgdGVzdC5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHRlc3QgLSBJZiB0ZXN0IGlzIGEgc3RyaW5nIHRoZW4gcnVuIGFsbCB0aGUgdGVzdHMgd2l0aCB0aGF0IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcndpc2UsIHRlc3Qgc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pmdyb3VwPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgZ3JvdXAgaW4gd2hpY2ggdGhlIHRlc3QgYmVsb25nczwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+bmFtZTwvZHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIHRlc3QgdG8gcnVuPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGw+XG4gICAqL1xuICAgcnVuVGVzdDogZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgIHZhciAgIGdyb3VwTmFtZSA9IG51bGwsXG4gICAgICAgICAgICB0ZXN0TmFtZSA9IG51bGw7XG5cbiAgICAgIGlmICh0eXBlb2YgdGVzdCA9PT0gXCJzdHJpbmdcIikge1xuXG4gICAgICAgICB0ZXN0TmFtZSA9IHRlc3Q7XG5cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRlc3QgPT09IFwib2JqZWN0XCIpIHtcblxuICAgICAgICAgaWYgKFwiZ3JvdXBcIiBpbiB0ZXN0KSB7XG4gICAgICAgICAgICBncm91cE5hbWUgPSB0ZXN0Lmdyb3VwO1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZiAoXCJuYW1lXCIgaW4gdGVzdCkge1xuICAgICAgICAgICAgdGVzdE5hbWUgPSB0ZXN0Lm5hbWU7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZXN0TmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgdGhpcy5fcnVuKGdyb3VwTmFtZSwgdGVzdE5hbWUpO1xuICAgICAgfVxuICAgfSxcblxuICAgX3Rlc3RHcm91cHM6ICAgeyBcIl9kZWZhdWx0XCI6IHsgbmFtZTogXCJfZGVmYXVsdFwiLCB0ZXN0czogWyBdIH0gfSxcbiAgIF9mYWlsQ291bnQ6ICAgIDAsXG4gICBfcnVuQ291bnQ6ICAgICAwLFxuICAgX2NoZWNrQ291bnQ6ICAgMCxcbiAgIF9pZ25vcmVDb3VudDogIDAsXG4gICBfc3RhcnRUaW1lOiAgICAwLFxuICAgX3ZlcmJvc2U6ICAgICAgZmFsc2UsXG4gICBfbG9nZ2luZzogICAgICB0cnVlLFxuICAgX2N1cnJlbnRHcm91cDogXCJcIixcbiAgIF9jdXJyZW50VGVzdDogIFwiXCIsXG5cbiAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl90ZXN0R3JvdXBzICAgICA9IHsgXCJfZGVmYXVsdFwiOiB7IG5hbWU6IFwiX2RlZmF1bHRcIiwgdGVzdHM6IFsgXSB9IH07XG4gICAgICB0aGlzLl9mYWlsQ291bnQgICAgICA9IDA7XG4gICAgICB0aGlzLl9ydW5Db3VudCAgICAgICA9IDA7XG4gICAgICB0aGlzLl9jaGVja0NvdW50ICAgICA9IDA7XG4gICAgICB0aGlzLl9pZ25vcmVDb3VudCAgICA9IDA7XG4gICAgICB0aGlzLl9zdGFydFRpbWUgICAgICA9IDA7XG4gICAgICB0aGlzLl92ZXJib3NlICAgICAgICA9IGZhbHNlO1xuICAgICAgdGhpcy5fbG9nZ2luZyAgICAgICAgPSB0cnVlO1xuICAgICAgdGhpcy5fY3VycmVudEdyb3VwICAgPSBcIlwiO1xuICAgICAgdGhpcy5fY3VycmVudFRlc3QgICAgPSBcIlwiO1xuICAgfSxcblxuICAgX2xvZzogZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgIGlmICh0aGlzLl9sb2dnaW5nID09PSB0cnVlKSB7XG4gICAgICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIF9ydW46IGZ1bmN0aW9uIChncm91cE5hbWUsIHRlc3ROYW1lKSB7XG4gICAgICB2YXIgICB0ZXN0cyxcbiAgICAgICAgICAgIHN0YXJ0O1xuXG4gICAgICB0aGlzLl9yZXNldFJlc3VsdHMoKTtcblxuICAgICAgdGVzdHMgPSB0aGlzLl9maW5kVGVzdHMoZ3JvdXBOYW1lLCB0ZXN0TmFtZSk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVzdHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgc3RhcnQgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgICBpZiAodGVzdHNbaV0uaWdub3JlID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl92ZXJib3NlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICB0aGlzLl9sb2coXCJJR05PUkVfVEVTVChcIiArIHRlc3RzW2ldLmdyb3VwICtcbiAgICAgICAgICAgICAgICAgICAgIFwiLCBcIiArIHRlc3RzW2ldLm5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZUNvdW50Kys7XG4gICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmVyYm9zZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgdGhpcy5fbG9nKFwiVEVTVChcIiArIHRlc3RzW2ldLmdyb3VwICtcbiAgICAgICAgICAgICAgICAgICAgIFwiLCBcIiArIHRlc3RzW2ldLm5hbWUgKyBcIilcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3J1blRlc3RPYmoodGVzdHNbaV0pO1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZiAodGhpcy5fdmVyYm9zZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5fbG9nKFwiIC0gXCIgKyAoRGF0ZS5ub3coKSAtIHN0YXJ0KSArIFwiIG1zXFxuXCIpO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9sb2dSZXN1bHRzKGdyb3VwTmFtZSwgdGVzdE5hbWUpO1xuICAgfSxcblxuICAgX1Rlc3RFcnJvcjogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMubmFtZSA9IFwiVGVzdEVycm9yXCI7XG4gICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXG5cIjtcbiAgIH0sXG5cbiAgIF90aHJvd1Rlc3RFcnJvcjogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgIGlmICh0aGlzLl9UZXN0RXJyb3IucHJvdG90eXBlLnRvU3RyaW5nKCkgIT09IFwiRXJyb3JcIikge1xuICAgICAgICAgdGhpcy5fVGVzdEVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IHRoaXMuX1Rlc3RFcnJvcihtZXNzYWdlKTtcbiAgIH0sXG5cbiAgIF9idWlsZEVycm9yU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgICBlcnJvciA9IChmdW5jdGlvbiAoKSB7IHRyeSB7IHRocm93IG5ldyBFcnJvcigpOyB9IGNhdGNoIChleCkge3JldHVybiBleDt9fSkoKSxcbiAgICAgICAgICAgIGVycm9yU3RyaW5nID0gXCJcIixcbiAgICAgICAgICAgIGNhbGxlckxpbmVzLFxuICAgICAgICAgICAgbWF0Y2hlcztcblxuICAgICAgaWYgKGVycm9yLnN0YWNrKSB7XG4gICAgICAgICBjYWxsZXJMaW5lcyA9IGVycm9yLnN0YWNrLnNwbGl0KFwiXFxuXCIpWzRdO1xuICAgICAgICAgbWF0Y2hlcyA9IGNhbGxlckxpbmVzLm1hdGNoKC9cXCgoLiopXFwpLyk7XG4gICAgICAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyb3JTdHJpbmcgKz0gbWF0Y2hlc1sxXSArIFwiOiBcIjtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZXJyb3JTdHJpbmcgKz0gXCJlcnJvcjogRmFpbHVyZSBpbiBURVNUKFwiO1xuXG4gICAgICBpZiAodGhpcy5fY3VycmVudEdyb3VwICE9PSBcIl9kZWZhdWx0XCIpIHtcbiAgICAgICAgIGVycm9yU3RyaW5nICs9IHRoaXMuX2N1cnJlbnRHcm91cCArIFwiLCBcIjtcbiAgICAgIH1cblxuICAgICAgZXJyb3JTdHJpbmcgKz0gdGhpcy5fY3VycmVudFRlc3QgKyBcIilcXG5cIjtcblxuICAgICAgcmV0dXJuIGVycm9yU3RyaW5nO1xuICAgfSxcblxuICAgX2ZpbmRUZXN0czogZnVuY3Rpb24gKGdyb3VwTmFtZSwgdGVzdE5hbWUpIHtcbiAgICAgIHZhciBtYXRjaGluZ1Rlc3RzID0gWyBdO1xuXG4gICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMuX3Rlc3RHcm91cHMpIHtcblxuICAgICAgICAgaWYgKChncm91cE5hbWUgPT09IG51bGwpIHx8IChuYW1lID09PSBncm91cE5hbWUpKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdGVzdEdyb3Vwc1tuYW1lXS50ZXN0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICBpZiAoKHRlc3ROYW1lID09PSBudWxsKSB8fCAodGhpcy5fdGVzdEdyb3Vwc1tuYW1lXS50ZXN0c1tpXS5uYW1lID09IHRlc3ROYW1lKSkge1xuXG4gICAgICAgICAgICAgICAgICBtYXRjaGluZ1Rlc3RzLnB1c2godGhpcy5fdGVzdEdyb3Vwc1tuYW1lXS50ZXN0c1tpXSk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtYXRjaGluZ1Rlc3RzO1xuICAgfSxcblxuICAgX2dldFRlc3RDb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGNvdW50ID0gMDtcblxuICAgICAgZm9yICh2YXIgZ3JvdXBOYW1lIGluIHRoaXMuX3Rlc3RHcm91cHMpIHtcbiAgICAgICAgIGNvdW50ICs9IHRoaXMuX3Rlc3RHcm91cHNbZ3JvdXBOYW1lXS50ZXN0cy5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb3VudDtcbiAgIH0sXG5cbiAgIF9yZXNldFJlc3VsdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2ZhaWxDb3VudCAgICA9IDA7XG4gICAgICB0aGlzLl9ydW5Db3VudCAgICAgPSAwO1xuICAgICAgdGhpcy5fY2hlY2tDb3VudCAgID0gMDtcbiAgICAgIHRoaXMuX2lnbm9yZUNvdW50ICA9IDA7XG4gICAgICB0aGlzLl9zdGFydFRpbWUgICAgPSBEYXRlLm5vdygpO1xuICAgfSxcblxuICAgX2xvZ1Jlc3VsdHM6IGZ1bmN0aW9uIChncm91cE5hbWUsIHRlc3ROYW1lKSB7XG4gICAgICB2YXIgICByZXN1bHRzLFxuICAgICAgICAgICAgdGVzdENvdW50LFxuICAgICAgICAgICAgc3RvcFRpbWU7XG5cbiAgICAgIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgaWYgKHRoaXMuX2ZhaWxDb3VudCA+IDApIHtcbiAgICAgICAgIHJlc3VsdHMgPSAgIFwiRXJyb3JzIChcIiAgICAgK1xuICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFpbENvdW50O1xuICAgICAgICAgaWYgKHRoaXMuX2ZhaWxDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgcmVzdWx0cyArPSBcIiBmYWlsdXJlLCBcIjtcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRzICs9IFwiIGZhaWx1cmVzLCBcIjtcbiAgICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXN1bHRzID0gXCJPSyAoXCI7XG4gICAgICB9XG5cbiAgICAgIHRlc3RDb3VudCA9IHRoaXMuX2dldFRlc3RDb3VudCgpO1xuICAgICAgcmVzdWx0cyArPSB0ZXN0Q291bnQ7XG4gICAgICBpZiAodGVzdENvdW50ID09PSAxKSB7XG4gICAgICAgICByZXN1bHRzICs9IFwiIHRlc3QsIFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJlc3VsdHMgKz0gXCIgdGVzdHMsIFwiO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRzICs9IHRoaXMuX3J1bkNvdW50ICsgXCIgcmFuLCBcIjtcblxuICAgICAgcmVzdWx0cyArPSB0aGlzLl9jaGVja0NvdW50O1xuICAgICAgaWYgKHRoaXMuX2NoZWNrQ291bnQgPT09IDEpIHtcbiAgICAgICAgIHJlc3VsdHMgKz0gXCIgY2hlY2ssIFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJlc3VsdHMgKz0gXCIgY2hlY2tzLCBcIjtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cyArPSB0aGlzLl9pZ25vcmVDb3VudCArIFwiIGlnbm9yZWQsIFwiO1xuICAgICAgcmVzdWx0cyArPSB0aGlzLl9nZXRUZXN0Q291bnQoKSAtICh0aGlzLl9ydW5Db3VudCArIHRoaXMuX2lnbm9yZUNvdW50KTtcbiAgICAgIHJlc3VsdHMgKz0gXCIgZmlsdGVyZWQgb3V0LCBcIjtcbiAgICAgIHJlc3VsdHMgKz0gKHN0b3BUaW1lIC0gdGhpcy5fc3RhcnRUaW1lKSArIFwiIG1zKVxcblxcblwiO1xuXG4gICAgICB0aGlzLl9sb2cocmVzdWx0cyk7XG4gICB9LFxuXG4gICBfcnVuVGVzdE9iajogZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgIHZhciBncm91cCA9IHRoaXMuX3Rlc3RHcm91cHNbdGVzdC5ncm91cF07XG5cbiAgICAgIHRoaXMuX2N1cnJlbnRHcm91cCA9IHRlc3QuZ3JvdXA7XG4gICAgICB0aGlzLl9jdXJyZW50VGVzdCAgPSB0ZXN0Lm5hbWU7XG5cbiAgICAgIHRoaXMuX3J1bkNvdW50Kys7XG5cbiAgICAgIHRyeSB7XG5cbiAgICAgICAgIGlmICh0eXBlb2YgZ3JvdXAuc2V0dXAgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgZ3JvdXAuc2V0dXAodGVzdCk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmICh0eXBlb2YgdGVzdC5ydW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdGVzdC5ydW4oKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKHR5cGVvZiBncm91cC50ZWFyZG93biA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBncm91cC50ZWFyZG93bih0ZXN0KTtcbiAgICAgICAgIH1cblxuICAgICAgfSBjYXRjaCAoZXgpIHtcblxuICAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgdGhpcy5fVGVzdEVycm9yKSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2xvZyhleC5tZXNzYWdlKTtcbiAgICAgICAgICAgIHRoaXMuX2ZhaWxDb3VudCsrO1xuXG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgICB9XG4gICAgICB9XG4gICB9LFxuXG4gICBfdG9JbnQ6IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgIHJldHVybiAobnVtIDwgMCkgPyBNYXRoLmNlaWwobnVtKSA6IE1hdGguZmxvb3IobnVtKTtcbiAgIH1cbn07XG4iLCJyZXF1aXJlKFwiLi90ZXN0c1wiKTtcbnZhciB1VGVzdCA9IHJlcXVpcmUoXCIuLi8uLi9zcmMvdVRlc3RcIik7XG5cbi8vIEFkZCBhIGNvdXBsZSBjaGVja3Mgb3V0c2lkZSBvZiB0ZXN0cyB0byBtYWtlIHN1cmUgaXRcbi8vIGRvZXNuJ3QgY2F1c2UgcHJvYmxlbXNcbnVUZXN0LkNIRUNLKHRydWUpO1xudVRlc3QuU1RSQ01QX0VRVUFMKFwiaGVsbG9cIiwgXCJoZWxsb1wiKTtcblxudVRlc3QuZW5hYmxlVmVyYm9zZUxvZ2dpbmcoKTtcblxudVRlc3QucnVuQWxsVGVzdHMoKTtcbiIsInZhciB1VGVzdCA9IHJlcXVpcmUoXCIuLi8uLi9zcmMvdVRlc3RcIik7XG5cbnVUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIlNlbGZUZXN0c1wiLFxuXG4gICBzZXR1cDogZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgIHRlc3QubXlUZXN0ID0gdVRlc3QuY2xvbmUoKTtcbiAgICAgIHRlc3QubXlUZXN0LmRpc2FibGVMb2dnaW5nKCk7XG4gICB9LFxuXG4gICB0ZWFyZG93bjogZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgIGRlbGV0ZSB0ZXN0Lm15VGVzdDtcbiAgIH1cbn0pO1xuXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiQ2xvbmVcIixcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyhPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcy5teVRlc3QpID09PSB1VGVzdCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9nZXRUZXN0Q291bnQoKSA9PT0gMCk7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkxvZ2dpbmdcIixcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xuXG4gICAgICB0aGlzLm15VGVzdC5fbG9nZ2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5teVRlc3QuZW5hYmxlTG9nZ2luZygpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fbG9nZ2luZyk7XG5cbiAgICAgIHRoaXMubXlUZXN0Ll9sb2dnaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMubXlUZXN0LmRpc2FibGVMb2dnaW5nKCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKHRoaXMubXlUZXN0Ll9sb2dnaW5nLCBmYWxzZSk7XG5cbiAgICAgIHRoaXMubXlUZXN0Ll92ZXJib3NlID0gZmFsc2U7XG4gICAgICB0aGlzLm15VGVzdC5lbmFibGVWZXJib3NlTG9nZ2luZygpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fdmVyYm9zZSk7XG5cbiAgICAgIHRoaXMubXlUZXN0Ll92ZXJib3NlID0gdHJ1ZTtcbiAgICAgIHRoaXMubXlUZXN0LmRpc2FibGVWZXJib3NlTG9nZ2luZygpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0aGlzLm15VGVzdC5fdmVyYm9zZSwgZmFsc2UpO1xuICAgfVxufSk7XG5cbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJQYXNzaW5nQ2hlY2tzXCIsXG4gICBydW46IGZ1bmN0aW9uICgpIHtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiUGFzc2luZ0NoZWNrc0dyb3VwXCIgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJQYXNzaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJUZXN0XCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMHg4ZiwgMHg4Zik7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLKHRydWUpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19UUlVFKHRydWUpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVEVYVCgxID09PSAxLCBcIldoZW4gZG9lcyAxICE9PSAxP1wiKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuRE9VQkxFU19FUVVBTCgyLjEsIDIuMiwgMC4xMDAwMDEpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgyLCAyKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuU1RSQ01QX0VRVUFMKFwib25lXCIsIFwib25lXCIpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19MT09TRV9FUVVBTCgxMDAwLCBcIjEwMDBcIik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QucnVuQWxsVGVzdHMoKTtcblxuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgxLCB0aGlzLm15VGVzdC5fZ2V0VGVzdENvdW50KCkpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgwLCB0aGlzLm15VGVzdC5fZmFpbENvdW50KTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMSwgdGhpcy5teVRlc3QuX3J1bkNvdW50KTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoOSwgdGhpcy5teVRlc3QuX2NoZWNrQ291bnQpO1xuICAgfVxufSk7XG5cbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJGYWlsaW5nQ2hlY2tzXCIsXG4gICBydW46IGZ1bmN0aW9uICgpIHtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJCWVRFU19FUVVBTFwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDB4OGYsIDB4OTApO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJDSEVDS1wiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLKGZhbHNlKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfVFJVRVwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX1RSVUUoZmFsc2UpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJDSEVDS19FUVVBTFwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKHRydWUsIGZhbHNlKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfRVFVQUxfMlwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKDIsIFwiMlwiKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfTE9PU0VfRVFVQUxcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgyLCBcIjNcIik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLX1RFWFRcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19URVhUKDEgPT09IDAsIFwiMSBzaG91bGQgbm90IGVxdWFsIDBcIik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkRPVUJMRVNfRVFVQUxcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5ET1VCTEVTX0VRVUFMKDIuMSwgMi4zLCAwLjEwMDAxKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCg1LCA2KTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiU1RSQ01QX0VRVUFMXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuU1RSQ01QX0VRVUFMKFwib25lXCIsIFwidHdvXCIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJGQUlMXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuRkFJTChcIkZhaWwgbWUhXCIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XG5cbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2dldFRlc3RDb3VudCgpID09PSAxMSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICAgICA9PT0gMTEpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgICAgPT09IDExKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2NoZWNrQ291bnQgICAgID09PSAxMSk7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkxPTkdTX0VRVUFMXCIsXG4gICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkxPTkdTX0VRVUFMX0dyb3VwXCIgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9Hcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMX1Bhc3NcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgwLCAwKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoMSwgMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKDEsIDEuMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0xLCAtMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0xLCAtMS4xKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoTnVtYmVyLk1BWF9WQUxVRSwgTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NSU5fVkFMVUUsIE51bWJlci5NSU5fVkFMVUUpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzFcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAyKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMX0ZhaWxfMlwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKDEsIDAuMSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzNcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgtMSwgLTIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF80XCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoLTIsIC0xLjEpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF81XCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoTnVtYmVyLk1BWF9WQUxVRSwgTnVtYmVyLk1JTl9WQUxVRSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuXG4gICAgICB0aGlzLm15VGVzdC5ydW5UZXN0KFwiTE9OR1NfRVFVQUxfUGFzc1wiKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3J1bkNvdW50ICAgID09PSAxKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSAwKTtcblxuICAgICAgdGhpcy5teVRlc3QucnVuVGVzdEdyb3VwKFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3J1bkNvdW50ICAgID09PSA1KTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSA1KTtcbiAgIH1cbn0pO1xuXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiQllURVNfRVFVQUxcIixcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5teVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiQllURVNfRVFVQUxfR3JvdXBcIiB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfUGFzc1wiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDAsIDApO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgxLCAxKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMSwgMS4xKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoLTEsIC0xKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoLTEsIC0xLjEpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgweDFBQSwgMHhBQSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfMVwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDEsIDIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF8yXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMSwgMC4xKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfM1wiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKC0xLCAtMik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJCWVRFU19FUVVBTF9GYWlsXzRcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgtMiwgLTEuMSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QucnVuVGVzdChcIkJZVEVTX0VRVUFMX1Bhc3NcIik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3RHcm91cChcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gNCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gNCk7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkNIRUNLX1RSSE9XU1wiLFxuXG4gICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVUZXN0LkNIRUNLX1RIUk9XKFwiUmVmZXJlbmNlRXJyb3JcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgY2FsbEFSYW5kb21Ob25FeGlzdGluZ0Z1bmN0aW9uKCk7XG4gICAgICB9KTtcbiAgIH1cblxufSk7XG5cbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJVc2VUZXN0V2l0aG91dEdyb3VwXCIsXG5cbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHtuYW1lOiBcIlRlc3RXaXRob3V0R3JvdXBcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDSyh0cnVlKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5JR05PUkVfVEVTVCh7bmFtZTogXCJJZ25vcmVUZXN0V2l0aG91dEdyb3VwXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodHJ1ZSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QucnVuVGVzdChcIlRlc3RXaXRob3V0R3JvdXBcIik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9pZ25vcmVDb3VudCA9PT0gMSk7XG4gICB9XG5cbn0pO1xuIl19
