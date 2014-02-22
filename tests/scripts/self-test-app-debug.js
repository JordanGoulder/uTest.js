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
      Check for a false result.

      @instance
      @param {boolean} condition - The result that is checked
   */
   CHECK_FALSE: function (condition) {
      var errorString;

      this._checkCount++;

      if (condition !== false) {
         errorString = this._buildErrorString() + "\tCHECK_FALSE failed";
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
            this.uTest.CHECK_TRUE(true);
            this.uTest.CHECK_FALSE(false);
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
      this.uTest.CHECK_EQUAL(10, this.myTest._checkCount);
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

      this.myTest.TEST({ group: "FailingChecksGroup", name: "CHECK_FALSE",
         run: function () {
            this.uTest.CHECK_FALSE(true);
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

      this.uTest.CHECK(this.myTest._getTestCount() === 12);
      this.uTest.CHECK(this.myTest._failCount      === 12);
      this.uTest.CHECK(this.myTest._runCount       === 12);
      this.uTest.CHECK(this.myTest._checkCount     === 12);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvc3JjL3VUZXN0LmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvdGVzdHMvc2NyaXB0cy9tYWluLmpzIiwiL1VzZXJzL2pnb3VsZGVyL3JlcG9zL3V0ZXN0anMvdGVzdHMvc2NyaXB0cy90ZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3puQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qXG4gICBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuICAgQ29weXJpZ2h0IChjKSAyMDE0IEpvcmRhbiBHb3VsZGVyLCBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXG4gICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gICBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gICBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gICB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gICBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAgIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiAgIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICAgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuICAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICAgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAgIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAgIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gICBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICAgU09GVFdBUkUuXG4qL1xuXG4vKipcbiAgIEEgdW5pdCB0ZXN0IGZyYW1ld29yayBmb3IgSmF2YVNjcmlwdCBtb2RlbGVkIGFmdGVyIGNwcFVUZXN0LlxuICAgQG1vZHVsZSB1VGVzdFxuKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAvKipcbiAgICAgIERlZmluZSBhIHRlc3QgZ3JvdXAuXG5cbiAgICAgIEBpbnN0YW5jZSBcbiAgICAgIEBwYXJhbSB7b2JqZWN0fSBncm91cCAtIEEgZ3JvdXAgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pm5hbWU8L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+c2V0dXAgPGVtPihvcHRpb25hbCk8L2VtPjwvZHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIHNldHVwIGZ1bmN0aW9uIHRoYXQgaXMgcnVuIGJlZm9yZSBlYWNoIHRlc3QgaW4gdGhlIGdyb3VwPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD50ZWFyZG93biA8ZW0+KG9wdGlvbmFsKTwvZW0+PC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgdGVhcmRvd24gZnVuY3Rpb24gdGhhdCBpcyBydW4gYWZ0ZXIgZWFjaCB0ZXN0IGluIHRoZSBncm91cDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgKi9cbiAgIFRFU1RfR1JPVVA6IGZ1bmN0aW9uIChncm91cCkge1xuICAgICAgZ3JvdXAudGVzdHMgPSBbIF07XG4gICAgICB0aGlzLl90ZXN0R3JvdXBzW2dyb3VwLm5hbWVdID0gZ3JvdXA7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIERlZmluZSBhIHRlc3QuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtvYmplY3R9IHRlc3QgLSBBIHRlc3Qgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pmdyb3VwIDxlbT4ob3B0aW9uYWwpPC9lbT48L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cCBpbiB3aGljaCB0aGUgdGVzdCBiZWxvbmdzPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5uYW1lPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgdGVzdDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+cnVuPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgZnVuY3Rpb24gdGhhdCBpcyBydW4gdG8gcGVyZm9ybSB0aGUgdGVzdDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgKi9cbiAgIFRFU1Q6IGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICB0ZXN0Lmdyb3VwID0gdGVzdC5ncm91cCB8fCBcIl9kZWZhdWx0XCI7XG4gICAgICB0ZXN0LnVUZXN0ID0gdGhpcztcbiAgICAgIHRlc3QuaWdub3JlID0gZmFsc2U7XG4gICAgICB0aGlzLl90ZXN0R3JvdXBzW3Rlc3QuZ3JvdXBdLnRlc3RzLnB1c2godGVzdCk7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIERlZmluZSBhIHRlc3QgdGhhdCB3aWxsIGJlIGlnbm9yZWQuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtvYmplY3R9IHRlc3QgLSBBIHRlc3Qgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pmdyb3VwIDxlbT4ob3B0aW9uYWwpPC9lbT48L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cCBpbiB3aGljaCB0aGUgdGVzdCBiZWxvbmdzPC9kZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5uYW1lPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgdGVzdDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+cnVuPC9kdD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgZnVuY3Rpb24gdGhhdCBpcyBydW4gdG8gcGVyZm9ybSB0aGUgdGVzdDwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgICovXG4gICBJR05PUkVfVEVTVDogZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgIHRoaXMuVEVTVCh0ZXN0KTtcbiAgICAgIHRlc3QuaWdub3JlID0gdHJ1ZTtcbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ2hlY2sgYSBib29sZWFuIHJlc3VsdC5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXG4gICAqL1xuICAgQ0hFQ0s6IGZ1bmN0aW9uIChjb25kaXRpb24pIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAoY29uZGl0aW9uICE9PSB0cnVlKSB7XG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArIFwiXFx0Q0hFQ0sgZmFpbGVkXCI7XG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENoZWNrIGZvciBhIHRydWUgcmVzdWx0LlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uIC0gVGhlIHJlc3VsdCB0aGF0IGlzIGNoZWNrZWRcbiAgICovXG4gICBDSEVDS19UUlVFOiBmdW5jdGlvbiAoY29uZGl0aW9uKSB7XG4gICAgICB0aGlzLkNIRUNLKGNvbmRpdGlvbik7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENoZWNrIGZvciBhIGZhbHNlIHJlc3VsdC5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXG4gICAqL1xuICAgQ0hFQ0tfRkFMU0U6IGZ1bmN0aW9uIChjb25kaXRpb24pIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAoY29uZGl0aW9uICE9PSBmYWxzZSkge1xuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyBcIlxcdENIRUNLX0ZBTFNFIGZhaWxlZFwiO1xuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgICAgfVxuICAgfSxcblxuICAgLyoqXG4gICAgICBDaGVjayBhIGJvb2xlYW4gcmVzdWx0IGFuZCBwcmludCB0ZXh0IG9uIGZhaWx1cmUuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtib29sZWFufSBjb25kaXRpb24gLSBUaGUgcmVzdWx0IHRoYXQgaXMgY2hlY2tlZFxuICAgICAgQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBwcmludCBvbiBmYWlsdXJlXG4gICAqL1xuICAgQ0hFQ0tfVEVYVDogZnVuY3Rpb24gKGNvbmRpdGlvbiwgdGV4dCkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nO1xuXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG5cbiAgICAgIGlmIChjb25kaXRpb24gIT09IHRydWUpIHtcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgXCJcXHRNZXNzYWdlOiBcIiArIHRleHQgKyBcIlxcblxcdENIRUNLIGZhaWxlZFwiO1xuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgICAgfVxuICAgfSxcblxuICAgLyoqXG4gICAgICBDaGVjayBmb3IgZXF1YWxpdHkgYmV0d2VlbiB0d28gZW50aXRpZXMgdXNpbmcgc3RyaWN0IGVxdWFsaXR5ICg9PT0pXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHthbnl9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIHJlc3VsdFxuICAgICAgQHBhcmFtIHthbnl9IGFjdHVhbCAtIFRoZSBhY3R1YWwgcmVzdWx0XG4gICAqL1xuICAgQ0hFQ0tfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsKSB7XG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XG5cbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcblxuICAgICAgaWYgKGV4cGVjdGVkICE9PSBhY3R1YWwpIHtcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgPFwiICsgZXhwZWN0ZWQgICsgXCI+XFxuXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBhY3R1YWwgICAgKyBcIj5cIjtcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ2hlY2sgZm9yIGVxdWFsaXR5IGJldHdlZW4gdHdvIGVudGl0aWVzIHVzaW5nIGxvb3NlIGVxdWFsaXR5ICg9PSlcblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge2FueX0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgcmVzdWx0XG4gICAgICBAcGFyYW0ge2FueX0gYWN0dWFsIC0gVGhlIGFjdHVhbCByZXN1bHRcbiAgICovXG4gICBDSEVDS19MT09TRV9FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwpIHtcbiAgICAgIHZhciBlcnJvclN0cmluZztcblxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuXG4gICAgICBpZiAoZXhwZWN0ZWQgIT0gYWN0dWFsKSB7XG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIGV4cGVjdGVkICArIFwiPlxcblwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgYWN0dWFsICAgICsgXCI+XCI7XG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICB9XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENoZWNrIGZvciBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIGJ5IGNhbGxpbmcgYSBzcGVjaWZpZWQgZnVuY3Rpb24uXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtFcnJvcn0gZXhjZXB0aW9uIC0gVGhlIHJlc3VsdGluZyBleGNlcHRpb24gdGhhdCBzaG91bGQgYmUgdGhyb3duIGJ5IGNhbGxpbmcgZnVuY1xuICAgICAgQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyAtIFRoZSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkXG4gICAqL1xuICAgQ0hFQ0tfVEhST1c6IGZ1bmN0aW9uIChleGNlcHRpb24sIGZ1bmMpIHtcbiAgICAgIHZhciAgIGVycm9yU3RyaW5nLFxuICAgICAgICAgICAgdGhyb3duID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgIGZ1bmMoKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICBpZiAoZXgubmFtZSA9PT0gZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICB0aHJvd24gPSB0cnVlO1xuICAgICAgICAgfVxuICAgICAgICAgZWxzZVxuICAgICAgICAge1xuICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhyb3duKSB7XG4gICAgICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIFwiICsgZXhjZXB0aW9uICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIHdhcyBub3QgdGhyb3duXCI7XG5cbiAgICAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQ2hlY2sgZm9yIGVxdWFsaXR5IHVzaW5nIGV4cGVjdGVkLnRvU3RyaW5nKCkgPT09IGFjdHVhbC50b1N0cmluZygpXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHthbnl9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIHJlc3VsdFxuICAgICAgQHBhcmFtIHthbnl9IGFjdHVhbCAtIFRoZSBhY3R1YWwgcmVzdWx0XG4gICAqL1xuICAgU1RSQ01QX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nO1xuXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG5cbiAgICAgIGlmIChleHBlY3RlZC50b1N0cmluZygpICE9PSBhY3R1YWwudG9TdHJpbmcoKSkge1xuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCA8XCIgKyBleHBlY3RlZC50b1N0cmluZygpICAgKyBcIj5cXG5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcdGJ1dCB3YXMgIDxcIiArIGFjdHVhbC50b1N0cmluZygpICAgICArIFwiPlwiO1xuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgICAgfVxuICAgfSxcblxuICAgLyoqXG4gICAgICBDb21wYXJlIHR3byBpbnRlZ2Vycy5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge251bWJlcn0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgaW50ZWdlciByZXN1bHRcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBhY3R1YWwgLSBUaGUgYWN0dWFsIGludGVnZXIgcmVzdWx0XG4gICAqL1xuICAgTE9OR1NfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsKSB7XG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XG5cbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcblxuICAgICAgaWYgKHRoaXMuX3RvSW50KGV4cGVjdGVkKSAhPT0gdGhpcy5fdG9JbnQoYWN0dWFsKSkge1xuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCA8XCIgKyBNYXRoLmZsb29yKGV4cGVjdGVkKSAgKyBcIj5cXG5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcdGJ1dCB3YXMgIDxcIiArIE1hdGguZmxvb3IoYWN0dWFsKSAgICArIFwiPlwiO1xuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgICAgfVxuICAgfSxcblxuICAgLyoqXG4gICAgICBDb21wYXJlIHR3byA4LWJpdCB3aWRlIGludGVnZXJzLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCA4LWJpdCB3aWRlIGludGVnZXIgcmVzdWx0XG4gICAgICBAcGFyYW0ge251bWJlcn0gYWN0dWFsIC0gVGhlIGFjdHVhbCA4LWJpdCB3aWRlIGludGVnZXIgcmVzdWx0XG4gICAqL1xuICAgQllURVNfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsKSB7XG4gICAgICB0aGlzLkxPTkdTX0VRVUFMKGV4cGVjdGVkICYgMHhGRiwgYWN0dWFsICYgMHhGRik7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIENvbXBhcmVzIHR3byBudW1iZXJzIHdpdGhpbiBzb21lIHRvbGVyYW5jZS5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge251bWJlcn0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgcmVzdWx0XG4gICAgICBAcGFyYW0ge251bWJlcn0gYWN0dWFsIC0gVGhlIGFjdHVhbCByZXN1bHRcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSB0b2xlcmFuY2UgLSBUaGUgbWF4aW11bSBkaWZmZXJlbmNlIHRoYXQgaXMgdG9sZXJhYmxlXG4gICAqL1xuICAgRE9VQkxFU19FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwsIHRvbGVyYW5jZSkge1xuICAgICAgdmFyIGVycm9yU3RyaW5nO1xuXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XG5cbiAgICAgIGlmIChNYXRoLmFicyhleHBlY3RlZCAtIGFjdHVhbCkgPiB0b2xlcmFuY2UpIHtcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgPFwiICsgZXhwZWN0ZWQgICsgXCI+XFxuXCIgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgYWN0dWFsICAgICsgXCI+XCIgICAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgdGhyZXNob2xkIHdhcyA8XCIgKyB0b2xlcmFuY2UgKyBcIj5cIjtcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIC8qKlxuICAgICAgQWx3YXlzIGZhaWxzIGFuZCBwcmludHMgdGV4dC5cblxuICAgICAgQGluc3RhbmNlXG4gICAgICBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIHByaW50IG9uIGZhaWx1cmUuXG4gICAqL1xuICAgRkFJTDogZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgIHZhciBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArIFwiXFx0XCIgKyB0ZXh0O1xuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xuICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBSZXR1cm4gYSBjbG9uZSBvZiB0aGUgdVRlc3Qgb2JqZWN0IHRoYXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgKi9cbiAgIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBuZXdPYmogPSBPYmplY3QuY3JlYXRlKHRoaXMpO1xuICAgICAgbmV3T2JqLl9pbml0KCk7XG4gICAgICByZXR1cm4gbmV3T2JqO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBFbmFibGUgbG9nZ2luZy4gVGhpcyBpcyBlbmFibGVkIGJ5IGRlZmF1bHQuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgKi9cbiAgIGVuYWJsZUxvZ2dpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX2xvZ2dpbmcgPSB0cnVlO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBEaXNhYmxlIGxvZ2dpbmcuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgKi9cbiAgIGRpc2FibGVMb2dnaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9sb2dnaW5nID0gZmFsc2U7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIEVuYWJsZSB2ZXJib3NlIGxvZ2dpbmcuIFRoaXMgaXMgZGlzYWJsZWQgYnkgZGVmYXVsdC5cblxuICAgICAgQGluc3RhbmNlXG4gICAqL1xuICAgZW5hYmxlVmVyYm9zZUxvZ2dpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX3ZlcmJvc2UgPSB0cnVlO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBEaXNhYmxlIHZlcmJvc2UgbG9nZ2luZy5cblxuICAgICAgQGluc3RhbmNlXG4gICAqL1xuICAgZGlzYWJsZVZlcmJvc2VMb2dnaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl92ZXJib3NlID0gZmFsc2U7XG4gICB9LFxuXG4gICAvKipcbiAgICAgIFJ1biBhbGwgdGhlIHRlc3RzIHRoYXQgYXJlIGN1cnJlbnRseSBkZWZpbmVkLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICovXG4gICBydW5BbGxUZXN0czogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fcnVuKG51bGwsIG51bGwpO1xuICAgfSxcblxuICAgLyoqXG4gICAgICBSdW4gYSBzcGVjaWZpYyB0ZXN0IGdyb3VwLlxuXG4gICAgICBAaW5zdGFuY2VcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSBncm91cE5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZ3JvdXAgdG8gcnVuXG4gICAqL1xuICAgcnVuVGVzdEdyb3VwOiBmdW5jdGlvbiAoZ3JvdXBOYW1lKSB7XG4gICAgICB0aGlzLl9ydW4oZ3JvdXBOYW1lLCBudWxsKTtcbiAgIH0sXG5cbiAgIC8qKiBcbiAgICAgIFJ1biBhIHNwZWNpZmljIHRlc3QuXG5cbiAgICAgIEBpbnN0YW5jZVxuICAgICAgQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSB0ZXN0IC0gSWYgdGVzdCBpcyBhIHN0cmluZyB0aGVuIHJ1biBhbGwgdGhlIHRlc3RzIHdpdGggdGhhdCBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJ3aXNlLCB0ZXN0IHNob3VsZCBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbHdpbmcgcHJvcGVydGllczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5ncm91cDwvZHQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIGdyb3VwIGluIHdoaWNoIHRoZSB0ZXN0IGJlbG9uZ3M8L2RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pm5hbWU8L2R0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSB0ZXN0IHRvIHJ1bjwvZGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxuICAgKi9cbiAgIHJ1blRlc3Q6IGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICB2YXIgICBncm91cE5hbWUgPSBudWxsLFxuICAgICAgICAgICAgdGVzdE5hbWUgPSBudWxsO1xuXG4gICAgICBpZiAodHlwZW9mIHRlc3QgPT09IFwic3RyaW5nXCIpIHtcblxuICAgICAgICAgdGVzdE5hbWUgPSB0ZXN0O1xuXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0ZXN0ID09PSBcIm9iamVjdFwiKSB7XG5cbiAgICAgICAgIGlmIChcImdyb3VwXCIgaW4gdGVzdCkge1xuICAgICAgICAgICAgZ3JvdXBOYW1lID0gdGVzdC5ncm91cDtcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKFwibmFtZVwiIGluIHRlc3QpIHtcbiAgICAgICAgICAgIHRlc3ROYW1lID0gdGVzdC5uYW1lO1xuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGVzdE5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgIHRoaXMuX3J1bihncm91cE5hbWUsIHRlc3ROYW1lKTtcbiAgICAgIH1cbiAgIH0sXG5cbiAgIF90ZXN0R3JvdXBzOiAgIHsgXCJfZGVmYXVsdFwiOiB7IG5hbWU6IFwiX2RlZmF1bHRcIiwgdGVzdHM6IFsgXSB9IH0sXG4gICBfZmFpbENvdW50OiAgICAwLFxuICAgX3J1bkNvdW50OiAgICAgMCxcbiAgIF9jaGVja0NvdW50OiAgIDAsXG4gICBfaWdub3JlQ291bnQ6ICAwLFxuICAgX3N0YXJ0VGltZTogICAgMCxcbiAgIF92ZXJib3NlOiAgICAgIGZhbHNlLFxuICAgX2xvZ2dpbmc6ICAgICAgdHJ1ZSxcbiAgIF9jdXJyZW50R3JvdXA6IFwiXCIsXG4gICBfY3VycmVudFRlc3Q6ICBcIlwiLFxuXG4gICBfaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fdGVzdEdyb3VwcyAgICAgPSB7IFwiX2RlZmF1bHRcIjogeyBuYW1lOiBcIl9kZWZhdWx0XCIsIHRlc3RzOiBbIF0gfSB9O1xuICAgICAgdGhpcy5fZmFpbENvdW50ICAgICAgPSAwO1xuICAgICAgdGhpcy5fcnVuQ291bnQgICAgICAgPSAwO1xuICAgICAgdGhpcy5fY2hlY2tDb3VudCAgICAgPSAwO1xuICAgICAgdGhpcy5faWdub3JlQ291bnQgICAgPSAwO1xuICAgICAgdGhpcy5fc3RhcnRUaW1lICAgICAgPSAwO1xuICAgICAgdGhpcy5fdmVyYm9zZSAgICAgICAgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2xvZ2dpbmcgICAgICAgID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2N1cnJlbnRHcm91cCAgID0gXCJcIjtcbiAgICAgIHRoaXMuX2N1cnJlbnRUZXN0ICAgID0gXCJcIjtcbiAgIH0sXG5cbiAgIF9sb2c6IGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICBpZiAodGhpcy5fbG9nZ2luZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgICB9XG4gICB9LFxuXG4gICBfcnVuOiBmdW5jdGlvbiAoZ3JvdXBOYW1lLCB0ZXN0TmFtZSkge1xuICAgICAgdmFyICAgdGVzdHMsXG4gICAgICAgICAgICBzdGFydDtcblxuICAgICAgdGhpcy5fcmVzZXRSZXN1bHRzKCk7XG5cbiAgICAgIHRlc3RzID0gdGhpcy5fZmluZFRlc3RzKGdyb3VwTmFtZSwgdGVzdE5hbWUpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlc3RzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgIHN0YXJ0ID0gRGF0ZS5ub3coKTtcblxuICAgICAgICAgaWYgKHRlc3RzW2ldLmlnbm9yZSA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fdmVyYm9zZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgdGhpcy5fbG9nKFwiSUdOT1JFX1RFU1QoXCIgKyB0ZXN0c1tpXS5ncm91cCArXG4gICAgICAgICAgICAgICAgICAgICBcIiwgXCIgKyB0ZXN0c1tpXS5uYW1lICsgXCIpXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9pZ25vcmVDb3VudCsrO1xuICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZlcmJvc2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgIHRoaXMuX2xvZyhcIlRFU1QoXCIgKyB0ZXN0c1tpXS5ncm91cCArXG4gICAgICAgICAgICAgICAgICAgICBcIiwgXCIgKyB0ZXN0c1tpXS5uYW1lICsgXCIpXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9ydW5UZXN0T2JqKHRlc3RzW2ldKTtcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKHRoaXMuX3ZlcmJvc2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xvZyhcIiAtIFwiICsgKERhdGUubm93KCkgLSBzdGFydCkgKyBcIiBtc1xcblwiKTtcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fbG9nUmVzdWx0cyhncm91cE5hbWUsIHRlc3ROYW1lKTtcbiAgIH0sXG5cbiAgIF9UZXN0RXJyb3I6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLm5hbWUgPSBcIlRlc3RFcnJvclwiO1xuICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSArIFwiXFxuXCI7XG4gICB9LFxuXG4gICBfdGhyb3dUZXN0RXJyb3I6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICBpZiAodGhpcy5fVGVzdEVycm9yLnByb3RvdHlwZS50b1N0cmluZygpICE9PSBcIkVycm9yXCIpIHtcbiAgICAgICAgIHRoaXMuX1Rlc3RFcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyB0aGlzLl9UZXN0RXJyb3IobWVzc2FnZSk7XG4gICB9LFxuXG4gICBfYnVpbGRFcnJvclN0cmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICAgZXJyb3IgPSAoZnVuY3Rpb24gKCkgeyB0cnkgeyB0aHJvdyBuZXcgRXJyb3IoKTsgfSBjYXRjaCAoZXgpIHtyZXR1cm4gZXg7fX0pKCksXG4gICAgICAgICAgICBlcnJvclN0cmluZyA9IFwiXCIsXG4gICAgICAgICAgICBjYWxsZXJMaW5lcyxcbiAgICAgICAgICAgIG1hdGNoZXM7XG5cbiAgICAgIGlmIChlcnJvci5zdGFjaykge1xuICAgICAgICAgY2FsbGVyTGluZXMgPSBlcnJvci5zdGFjay5zcGxpdChcIlxcblwiKVs0XTtcbiAgICAgICAgIG1hdGNoZXMgPSBjYWxsZXJMaW5lcy5tYXRjaCgvXFwoKC4qKVxcKS8pO1xuICAgICAgICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGVycm9yU3RyaW5nICs9IG1hdGNoZXNbMV0gKyBcIjogXCI7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVycm9yU3RyaW5nICs9IFwiZXJyb3I6IEZhaWx1cmUgaW4gVEVTVChcIjtcblxuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRHcm91cCAhPT0gXCJfZGVmYXVsdFwiKSB7XG4gICAgICAgICBlcnJvclN0cmluZyArPSB0aGlzLl9jdXJyZW50R3JvdXAgKyBcIiwgXCI7XG4gICAgICB9XG5cbiAgICAgIGVycm9yU3RyaW5nICs9IHRoaXMuX2N1cnJlbnRUZXN0ICsgXCIpXFxuXCI7XG5cbiAgICAgIHJldHVybiBlcnJvclN0cmluZztcbiAgIH0sXG5cbiAgIF9maW5kVGVzdHM6IGZ1bmN0aW9uIChncm91cE5hbWUsIHRlc3ROYW1lKSB7XG4gICAgICB2YXIgbWF0Y2hpbmdUZXN0cyA9IFsgXTtcblxuICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLl90ZXN0R3JvdXBzKSB7XG5cbiAgICAgICAgIGlmICgoZ3JvdXBOYW1lID09PSBudWxsKSB8fCAobmFtZSA9PT0gZ3JvdXBOYW1lKSkge1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3Rlc3RHcm91cHNbbmFtZV0udGVzdHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgaWYgKCh0ZXN0TmFtZSA9PT0gbnVsbCkgfHwgKHRoaXMuX3Rlc3RHcm91cHNbbmFtZV0udGVzdHNbaV0ubmFtZSA9PSB0ZXN0TmFtZSkpIHtcblxuICAgICAgICAgICAgICAgICAgbWF0Y2hpbmdUZXN0cy5wdXNoKHRoaXMuX3Rlc3RHcm91cHNbbmFtZV0udGVzdHNbaV0pO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWF0Y2hpbmdUZXN0cztcbiAgIH0sXG5cbiAgIF9nZXRUZXN0Q291bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICAgIGZvciAodmFyIGdyb3VwTmFtZSBpbiB0aGlzLl90ZXN0R3JvdXBzKSB7XG4gICAgICAgICBjb3VudCArPSB0aGlzLl90ZXN0R3JvdXBzW2dyb3VwTmFtZV0udGVzdHMubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY291bnQ7XG4gICB9LFxuXG4gICBfcmVzZXRSZXN1bHRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9mYWlsQ291bnQgICAgPSAwO1xuICAgICAgdGhpcy5fcnVuQ291bnQgICAgID0gMDtcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQgICA9IDA7XG4gICAgICB0aGlzLl9pZ25vcmVDb3VudCAgPSAwO1xuICAgICAgdGhpcy5fc3RhcnRUaW1lICAgID0gRGF0ZS5ub3coKTtcbiAgIH0sXG5cbiAgIF9sb2dSZXN1bHRzOiBmdW5jdGlvbiAoZ3JvdXBOYW1lLCB0ZXN0TmFtZSkge1xuICAgICAgdmFyICAgcmVzdWx0cyxcbiAgICAgICAgICAgIHRlc3RDb3VudCxcbiAgICAgICAgICAgIHN0b3BUaW1lO1xuXG4gICAgICBzdG9wVGltZSA9IERhdGUubm93KCk7XG5cbiAgICAgIGlmICh0aGlzLl9mYWlsQ291bnQgPiAwKSB7XG4gICAgICAgICByZXN1bHRzID0gICBcIkVycm9ycyAoXCIgICAgICtcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhaWxDb3VudDtcbiAgICAgICAgIGlmICh0aGlzLl9mYWlsQ291bnQgPT09IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdHMgKz0gXCIgZmFpbHVyZSwgXCI7XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0cyArPSBcIiBmYWlsdXJlcywgXCI7XG4gICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmVzdWx0cyA9IFwiT0sgKFwiO1xuICAgICAgfVxuXG4gICAgICB0ZXN0Q291bnQgPSB0aGlzLl9nZXRUZXN0Q291bnQoKTtcbiAgICAgIHJlc3VsdHMgKz0gdGVzdENvdW50O1xuICAgICAgaWYgKHRlc3RDb3VudCA9PT0gMSkge1xuICAgICAgICAgcmVzdWx0cyArPSBcIiB0ZXN0LCBcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXN1bHRzICs9IFwiIHRlc3RzLCBcIjtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cyArPSB0aGlzLl9ydW5Db3VudCArIFwiIHJhbiwgXCI7XG5cbiAgICAgIHJlc3VsdHMgKz0gdGhpcy5fY2hlY2tDb3VudDtcbiAgICAgIGlmICh0aGlzLl9jaGVja0NvdW50ID09PSAxKSB7XG4gICAgICAgICByZXN1bHRzICs9IFwiIGNoZWNrLCBcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXN1bHRzICs9IFwiIGNoZWNrcywgXCI7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdHMgKz0gdGhpcy5faWdub3JlQ291bnQgKyBcIiBpZ25vcmVkLCBcIjtcbiAgICAgIHJlc3VsdHMgKz0gdGhpcy5fZ2V0VGVzdENvdW50KCkgLSAodGhpcy5fcnVuQ291bnQgKyB0aGlzLl9pZ25vcmVDb3VudCk7XG4gICAgICByZXN1bHRzICs9IFwiIGZpbHRlcmVkIG91dCwgXCI7XG4gICAgICByZXN1bHRzICs9IChzdG9wVGltZSAtIHRoaXMuX3N0YXJ0VGltZSkgKyBcIiBtcylcXG5cXG5cIjtcblxuICAgICAgdGhpcy5fbG9nKHJlc3VsdHMpO1xuICAgfSxcblxuICAgX3J1blRlc3RPYmo6IGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICB2YXIgZ3JvdXAgPSB0aGlzLl90ZXN0R3JvdXBzW3Rlc3QuZ3JvdXBdO1xuXG4gICAgICB0aGlzLl9jdXJyZW50R3JvdXAgPSB0ZXN0Lmdyb3VwO1xuICAgICAgdGhpcy5fY3VycmVudFRlc3QgID0gdGVzdC5uYW1lO1xuXG4gICAgICB0aGlzLl9ydW5Db3VudCsrO1xuXG4gICAgICB0cnkge1xuXG4gICAgICAgICBpZiAodHlwZW9mIGdyb3VwLnNldHVwID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGdyb3VwLnNldHVwKHRlc3QpO1xuICAgICAgICAgfVxuXG4gICAgICAgICBpZiAodHlwZW9mIHRlc3QucnVuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRlc3QucnVuKCk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmICh0eXBlb2YgZ3JvdXAudGVhcmRvd24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgZ3JvdXAudGVhcmRvd24odGVzdCk7XG4gICAgICAgICB9XG5cbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG5cbiAgICAgICAgIGlmIChleCBpbnN0YW5jZW9mIHRoaXMuX1Rlc3RFcnJvcikge1xuXG4gICAgICAgICAgICB0aGlzLl9sb2coZXgubWVzc2FnZSk7XG4gICAgICAgICAgICB0aGlzLl9mYWlsQ291bnQrKztcblxuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgfVxuICAgICAgfVxuICAgfSxcblxuICAgX3RvSW50OiBmdW5jdGlvbiAobnVtKSB7XG4gICAgICByZXR1cm4gKG51bSA8IDApID8gTWF0aC5jZWlsKG51bSkgOiBNYXRoLmZsb29yKG51bSk7XG4gICB9XG59O1xuIiwicmVxdWlyZShcIi4vdGVzdHNcIik7XG52YXIgdVRlc3QgPSByZXF1aXJlKFwiLi4vLi4vc3JjL3VUZXN0XCIpO1xuXG4vLyBBZGQgYSBjb3VwbGUgY2hlY2tzIG91dHNpZGUgb2YgdGVzdHMgdG8gbWFrZSBzdXJlIGl0XG4vLyBkb2Vzbid0IGNhdXNlIHByb2JsZW1zXG51VGVzdC5DSEVDSyh0cnVlKTtcbnVUZXN0LlNUUkNNUF9FUVVBTChcImhlbGxvXCIsIFwiaGVsbG9cIik7XG5cbnVUZXN0LmVuYWJsZVZlcmJvc2VMb2dnaW5nKCk7XG5cbnVUZXN0LnJ1bkFsbFRlc3RzKCk7XG4iLCJ2YXIgdVRlc3QgPSByZXF1aXJlKFwiLi4vLi4vc3JjL3VUZXN0XCIpO1xuXG51VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJTZWxmVGVzdHNcIixcblxuICAgc2V0dXA6IGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICB0ZXN0Lm15VGVzdCA9IHVUZXN0LmNsb25lKCk7XG4gICAgICB0ZXN0Lm15VGVzdC5kaXNhYmxlTG9nZ2luZygpO1xuICAgfSxcblxuICAgdGVhcmRvd246IGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICBkZWxldGUgdGVzdC5teVRlc3Q7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkNsb25lXCIsXG4gICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0soT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMubXlUZXN0KSA9PT0gdVRlc3QpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZ2V0VGVzdENvdW50KCkgPT09IDApO1xuICAgfVxufSk7XG5cbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJMb2dnaW5nXCIsXG4gICBydW46IGZ1bmN0aW9uICgpIHtcblxuICAgICAgdGhpcy5teVRlc3QuX2xvZ2dpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMubXlUZXN0LmVuYWJsZUxvZ2dpbmcoKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2xvZ2dpbmcpO1xuXG4gICAgICB0aGlzLm15VGVzdC5fbG9nZ2luZyA9IHRydWU7XG4gICAgICB0aGlzLm15VGVzdC5kaXNhYmxlTG9nZ2luZygpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0aGlzLm15VGVzdC5fbG9nZ2luZywgZmFsc2UpO1xuXG4gICAgICB0aGlzLm15VGVzdC5fdmVyYm9zZSA9IGZhbHNlO1xuICAgICAgdGhpcy5teVRlc3QuZW5hYmxlVmVyYm9zZUxvZ2dpbmcoKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3ZlcmJvc2UpO1xuXG4gICAgICB0aGlzLm15VGVzdC5fdmVyYm9zZSA9IHRydWU7XG4gICAgICB0aGlzLm15VGVzdC5kaXNhYmxlVmVyYm9zZUxvZ2dpbmcoKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwodGhpcy5teVRlc3QuX3ZlcmJvc2UsIGZhbHNlKTtcbiAgIH1cbn0pO1xuXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiUGFzc2luZ0NoZWNrc1wiLFxuICAgcnVuOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIlBhc3NpbmdDaGVja3NHcm91cFwiIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiUGFzc2luZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiVGVzdFwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDB4OGYsIDB4OGYpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDSyh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVFJVRSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRkFMU0UoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVEVYVCgxID09PSAxLCBcIldoZW4gZG9lcyAxICE9PSAxP1wiKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuRE9VQkxFU19FUVVBTCgyLjEsIDIuMiwgMC4xMDAwMDEpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgyLCAyKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuU1RSQ01QX0VRVUFMKFwib25lXCIsIFwib25lXCIpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19MT09TRV9FUVVBTCgxMDAwLCBcIjEwMDBcIik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QucnVuQWxsVGVzdHMoKTtcblxuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgxLCB0aGlzLm15VGVzdC5fZ2V0VGVzdENvdW50KCkpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgwLCB0aGlzLm15VGVzdC5fZmFpbENvdW50KTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMSwgdGhpcy5teVRlc3QuX3J1bkNvdW50KTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMTAsIHRoaXMubXlUZXN0Ll9jaGVja0NvdW50KTtcbiAgIH1cbn0pO1xuXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiRmFpbGluZ0NoZWNrc1wiLFxuICAgcnVuOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgweDhmLCAweDkwKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDSyhmYWxzZSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLX1RSVUVcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19UUlVFKGZhbHNlKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfRkFMU0VcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19GQUxTRSh0cnVlKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfRVFVQUxcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0cnVlLCBmYWxzZSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLX0VRVUFMXzJcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgyLCBcIjJcIik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLX0xPT1NFX0VRVUFMXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMiwgXCIzXCIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJDSEVDS19URVhUXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVEVYVCgxID09PSAwLCBcIjEgc2hvdWxkIG5vdCBlcXVhbCAwXCIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJET1VCTEVTX0VRVUFMXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuRE9VQkxFU19FUVVBTCgyLjEsIDIuMywgMC4xMDAwMSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoNSwgNik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIlNUUkNNUF9FUVVBTFwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LlNUUkNNUF9FUVVBTChcIm9uZVwiLCBcInR3b1wiKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiRkFJTFwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkZBSUwoXCJGYWlsIG1lIVwiKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5ydW5BbGxUZXN0cygpO1xuXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9nZXRUZXN0Q291bnQoKSA9PT0gMTIpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZmFpbENvdW50ICAgICAgPT09IDEyKTtcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3J1bkNvdW50ICAgICAgID09PSAxMik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9jaGVja0NvdW50ICAgICA9PT0gMTIpO1xuICAgfVxufSk7XG5cbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJMT05HU19FUVVBTFwiLFxuICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJMT05HU19FUVVBTF9Hcm91cFwiIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiTE9OR1NfRVFVQUxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9QYXNzXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoMCwgMCk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKDEsIDEpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAxLjEpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgtMSwgLTEpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgtMSwgLTEuMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NQVhfVkFMVUUsIE51bWJlci5NQVhfVkFMVUUpO1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTChOdW1iZXIuTUlOX1ZBTFVFLCBOdW1iZXIuTUlOX1ZBTFVFKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF8xXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoMSwgMik7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzJcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAwLjEpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF8zXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoLTEsIC0yKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMX0ZhaWxfNFwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0yLCAtMS4xKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMX0ZhaWxfNVwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NQVhfVkFMVUUsIE51bWJlci5NSU5fVkFMVUUpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cblxuICAgICAgdGhpcy5teVRlc3QucnVuVGVzdChcIkxPTkdTX0VRVUFMX1Bhc3NcIik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3RHcm91cChcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIik7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gNSk7XG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gNSk7XG4gICB9XG59KTtcblxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkJZVEVTX0VRVUFMXCIsXG4gICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkJZVEVTX0VRVUFMX0dyb3VwXCIgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJCWVRFU19FUVVBTF9Hcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMX1Bhc3NcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgwLCAwKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMSwgMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDEsIDEuMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKC0xLCAtMSk7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKC0xLCAtMS4xKTtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMHgxQUEsIDB4QUEpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJCWVRFU19FUVVBTF9GYWlsXzFcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgxLCAyKTtcbiAgICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfMlwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDEsIDAuMSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJCWVRFU19FUVVBTF9GYWlsXzNcIixcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgtMSwgLTIpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF80XCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoLTIsIC0xLjEpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3QoXCJCWVRFU19FUVVBTF9QYXNzXCIpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgPT09IDEpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZmFpbENvdW50ICAgPT09IDApO1xuXG4gICAgICB0aGlzLm15VGVzdC5ydW5UZXN0R3JvdXAoXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgPT09IDQpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZmFpbENvdW50ICAgPT09IDQpO1xuICAgfVxufSk7XG5cbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJDSEVDS19UUkhPV1NcIixcblxuICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICB1VGVzdC5DSEVDS19USFJPVyhcIlJlZmVyZW5jZUVycm9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgIGNhbGxBUmFuZG9tTm9uRXhpc3RpbmdGdW5jdGlvbigpO1xuICAgICAgfSk7XG4gICB9XG5cbn0pO1xuXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiVXNlVGVzdFdpdGhvdXRHcm91cFwiLFxuXG4gICBydW46IGZ1bmN0aW9uICgpIHtcblxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7bmFtZTogXCJUZXN0V2l0aG91dEdyb3VwXCIsXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodHJ1ZSk7XG4gICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5teVRlc3QuSUdOT1JFX1RFU1Qoe25hbWU6IFwiSWdub3JlVGVzdFdpdGhvdXRHcm91cFwiLFxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLKHRydWUpO1xuICAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3QoXCJUZXN0V2l0aG91dEdyb3VwXCIpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgPT09IDEpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZmFpbENvdW50ICAgPT09IDApO1xuXG4gICAgICB0aGlzLm15VGVzdC5ydW5BbGxUZXN0cygpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgPT09IDEpO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZmFpbENvdW50ICAgPT09IDApO1xuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5faWdub3JlQ291bnQgPT09IDEpO1xuICAgfVxuXG59KTtcbiJdfQ==
