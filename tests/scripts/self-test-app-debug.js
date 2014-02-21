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
      test.uTest = this;
      test.ignore = true;
      this._testGroups[test.group].tests.push(test);
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

      this.myTest.runTest("TestWithoutGroup");
      this.uTest.CHECK(this.myTest._runCount    === 1);
      this.uTest.CHECK(this.myTest._failCount   === 0);

      this.myTest.runAllTests();
      this.uTest.CHECK(this.myTest._runCount    === 1);
      this.uTest.CHECK(this.myTest._failCount   === 0);
   }

});

},{"../../src/uTest":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJjOlxcVXNlcnNcXGpnb3VsZGVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZjovcmVwb3MvdXRlc3Qvc3JjL3VUZXN0LmpzIiwiZjovcmVwb3MvdXRlc3QvdGVzdHMvc2NyaXB0cy9tYWluLmpzIiwiZjovcmVwb3MvdXRlc3QvdGVzdHMvc2NyaXB0cy90ZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcclxuICAgVGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcblxyXG4gICBDb3B5cmlnaHQgKGMpIDIwMTQgSm9yZGFuIEdvdWxkZXIsIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXHJcblxyXG4gICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiAgIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuICAgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gICB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbiAgIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gICBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuICAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXHJcbiAgIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG4gICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiAgIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICAgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gICBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxyXG4gICBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gICBBIHVuaXQgdGVzdCBmcmFtZXdvcmsgZm9yIEphdmFTY3JpcHQgbW9kZWxlZCBhZnRlciBjcHBVVGVzdC5cclxuICAgQG1vZHVsZSB1VGVzdFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgIC8qKlxyXG4gICAgICBEZWZpbmUgYSB0ZXN0IGdyb3VwLlxyXG5cclxuICAgICAgQGluc3RhbmNlIFxyXG4gICAgICBAcGFyYW0ge29iamVjdH0gZ3JvdXAgLSBBIGdyb3VwIG9iamVjdCB0aGF0IGhhcyB0aGUgZm9sbHdpbmcgcHJvcGVydGllczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+bmFtZTwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgZ3JvdXA8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+c2V0dXAgPGVtPihvcHRpb25hbCk8L2VtPjwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgc2V0dXAgZnVuY3Rpb24gdGhhdCBpcyBydW4gYmVmb3JlIGVhY2ggdGVzdCBpbiB0aGUgZ3JvdXA8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+dGVhcmRvd24gPGVtPihvcHRpb25hbCk8L2VtPjwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgdGVhcmRvd24gZnVuY3Rpb24gdGhhdCBpcyBydW4gYWZ0ZXIgZWFjaCB0ZXN0IGluIHRoZSBncm91cDwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGw+XHJcbiAgICovXHJcbiAgIFRFU1RfR1JPVVA6IGZ1bmN0aW9uIChncm91cCkge1xyXG4gICAgICBncm91cC50ZXN0cyA9IFsgXTtcclxuICAgICAgdGhpcy5fdGVzdEdyb3Vwc1tncm91cC5uYW1lXSA9IGdyb3VwO1xyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIERlZmluZSBhIHRlc3QuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHtvYmplY3R9IHRlc3QgLSBBIHRlc3Qgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5ncm91cCA8ZW0+KG9wdGlvbmFsKTwvZW0+PC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cCBpbiB3aGljaCB0aGUgdGVzdCBiZWxvbmdzPC9kZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pm5hbWU8L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIHRlc3Q8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+cnVuPC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBmdW5jdGlvbiB0aGF0IGlzIHJ1biB0byBwZXJmb3JtIHRoZSB0ZXN0PC9kZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kbD5cclxuICAgKi9cclxuICAgVEVTVDogZnVuY3Rpb24gKHRlc3QpIHtcclxuICAgICAgdGVzdC5ncm91cCA9IHRlc3QuZ3JvdXAgfHwgXCJfZGVmYXVsdFwiO1xyXG4gICAgICB0ZXN0LnVUZXN0ID0gdGhpcztcclxuICAgICAgdGVzdC5pZ25vcmUgPSBmYWxzZTtcclxuICAgICAgdGhpcy5fdGVzdEdyb3Vwc1t0ZXN0Lmdyb3VwXS50ZXN0cy5wdXNoKHRlc3QpO1xyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIERlZmluZSBhIHRlc3QgdGhhdCB3aWxsIGJlIGlnbm9yZWQuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHtvYmplY3R9IHRlc3QgLSBBIHRlc3Qgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5ncm91cCA8ZW0+KG9wdGlvbmFsKTwvZW0+PC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cCBpbiB3aGljaCB0aGUgdGVzdCBiZWxvbmdzPC9kZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pm5hbWU8L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIHRlc3Q8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+cnVuPC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBmdW5jdGlvbiB0aGF0IGlzIHJ1biB0byBwZXJmb3JtIHRoZSB0ZXN0PC9kZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kbD5cclxuICAgICovXHJcbiAgIElHTk9SRV9URVNUOiBmdW5jdGlvbiAodGVzdCkge1xyXG4gICAgICB0ZXN0LnVUZXN0ID0gdGhpcztcclxuICAgICAgdGVzdC5pZ25vcmUgPSB0cnVlO1xyXG4gICAgICB0aGlzLl90ZXN0R3JvdXBzW3Rlc3QuZ3JvdXBdLnRlc3RzLnB1c2godGVzdCk7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ2hlY2sgYSBib29sZWFuIHJlc3VsdC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXHJcbiAgICovXHJcbiAgIENIRUNLOiBmdW5jdGlvbiAoY29uZGl0aW9uKSB7XHJcbiAgICAgIHZhciBlcnJvclN0cmluZztcclxuXHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcclxuXHJcbiAgICAgIGlmIChjb25kaXRpb24gIT09IHRydWUpIHtcclxuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyBcIlxcdENIRUNLIGZhaWxlZFwiO1xyXG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XHJcbiAgICAgIH1cclxuICAgfSxcclxuICAgLyoqXHJcbiAgICAgIENoZWNrIGEgYm9vbGVhbiByZXN1bHQgYW5kIHByaW50IHRleHQgb24gZmFpbHVyZS5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXHJcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gcHJpbnQgb24gZmFpbHVyZVxyXG4gICAqL1xyXG4gICBDSEVDS19URVhUOiBmdW5jdGlvbiAoY29uZGl0aW9uLCB0ZXh0KSB7XHJcbiAgICAgIHZhciBlcnJvclN0cmluZztcclxuXHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcclxuXHJcbiAgICAgIGlmIChjb25kaXRpb24gIT09IHRydWUpIHtcclxuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyBcIlxcdE1lc3NhZ2U6IFwiICsgdGV4dCArIFwiXFxuXFx0Q0hFQ0sgZmFpbGVkXCI7XHJcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcclxuICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIENoZWNrIGZvciBlcXVhbGl0eSBiZXR3ZWVuIHR3byBlbnRpdGllcyB1c2luZyBzdHJpY3QgZXF1YWxpdHkgKD09PSlcclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge2FueX0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgcmVzdWx0XHJcbiAgICAgIEBwYXJhbSB7YW55fSBhY3R1YWwgLSBUaGUgYWN0dWFsIHJlc3VsdFxyXG4gICAqL1xyXG4gICBDSEVDS19FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwpIHtcclxuICAgICAgdmFyIGVycm9yU3RyaW5nO1xyXG5cclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xyXG5cclxuICAgICAgaWYgKGV4cGVjdGVkICE9PSBhY3R1YWwpIHtcclxuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCA8XCIgKyBleHBlY3RlZCAgKyBcIj5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgYWN0dWFsICAgICsgXCI+XCI7XHJcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcclxuICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIENoZWNrIGZvciBlcXVhbGl0eSBiZXR3ZWVuIHR3byBlbnRpdGllcyB1c2luZyBsb29zZSBlcXVhbGl0eSAoPT0pXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHthbnl9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIHJlc3VsdFxyXG4gICAgICBAcGFyYW0ge2FueX0gYWN0dWFsIC0gVGhlIGFjdHVhbCByZXN1bHRcclxuICAgKi9cclxuICAgQ0hFQ0tfTE9PU0VfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsKSB7XHJcbiAgICAgIHZhciBlcnJvclN0cmluZztcclxuXHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcclxuXHJcbiAgICAgIGlmIChleHBlY3RlZCAhPSBhY3R1YWwpIHtcclxuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCA8XCIgKyBleHBlY3RlZCAgKyBcIj5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgYWN0dWFsICAgICsgXCI+XCI7XHJcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcclxuICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIENoZWNrIGZvciBhbiBleGNlcHRpb24gdG8gYmUgdGhyb3duIGJ5IGNhbGxpbmcgYSBzcGVjaWZpZWQgZnVuY3Rpb24uXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHtFcnJvcn0gZXhjZXB0aW9uIC0gVGhlIHJlc3VsdGluZyBleGNlcHRpb24gdGhhdCBzaG91bGQgYmUgdGhyb3duIGJ5IGNhbGxpbmcgZnVuY1xyXG4gICAgICBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIC0gVGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWRcclxuICAgKi9cclxuICAgQ0hFQ0tfVEhST1c6IGZ1bmN0aW9uIChleGNlcHRpb24sIGZ1bmMpIHtcclxuICAgICAgdmFyICAgZXJyb3JTdHJpbmcsXHJcbiAgICAgICAgICAgIHRocm93biA9IGZhbHNlO1xyXG5cclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICAgZnVuYygpO1xyXG4gICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICBpZiAoZXgubmFtZSA9PT0gZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgIHRocm93biA9IHRydWU7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgZWxzZVxyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgIHRocm93IGV4O1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhyb3duKSB7XHJcbiAgICAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgXCIgKyBleGNlcHRpb24gK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiB3YXMgbm90IHRocm93blwiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ2hlY2sgZm9yIGVxdWFsaXR5IHVzaW5nIGV4cGVjdGVkLnRvU3RyaW5nKCkgPT09IGFjdHVhbC50b1N0cmluZygpXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHthbnl9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIHJlc3VsdFxyXG4gICAgICBAcGFyYW0ge2FueX0gYWN0dWFsIC0gVGhlIGFjdHVhbCByZXN1bHRcclxuICAgKi9cclxuICAgU1RSQ01QX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xyXG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XHJcblxyXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XHJcblxyXG4gICAgICBpZiAoZXhwZWN0ZWQudG9TdHJpbmcoKSAhPT0gYWN0dWFsLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCA8XCIgKyBleHBlY3RlZC50b1N0cmluZygpICAgKyBcIj5cXG5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgYWN0dWFsLnRvU3RyaW5nKCkgICAgICsgXCI+XCI7XHJcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcclxuICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIENvbXBhcmUgdHdvIGludGVnZXJzLlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCBpbnRlZ2VyIHJlc3VsdFxyXG4gICAgICBAcGFyYW0ge251bWJlcn0gYWN0dWFsIC0gVGhlIGFjdHVhbCBpbnRlZ2VyIHJlc3VsdFxyXG4gICAqL1xyXG4gICBMT05HU19FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwpIHtcclxuICAgICAgdmFyIGVycm9yU3RyaW5nO1xyXG5cclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX3RvSW50KGV4cGVjdGVkKSAhPT0gdGhpcy5fdG9JbnQoYWN0dWFsKSkge1xyXG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIE1hdGguZmxvb3IoZXhwZWN0ZWQpICArIFwiPlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBNYXRoLmZsb29yKGFjdHVhbCkgICAgKyBcIj5cIjtcclxuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ29tcGFyZSB0d28gOC1iaXQgd2lkZSBpbnRlZ2Vycy5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge251bWJlcn0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgOC1iaXQgd2lkZSBpbnRlZ2VyIHJlc3VsdFxyXG4gICAgICBAcGFyYW0ge251bWJlcn0gYWN0dWFsIC0gVGhlIGFjdHVhbCA4LWJpdCB3aWRlIGludGVnZXIgcmVzdWx0XHJcbiAgICovXHJcbiAgIEJZVEVTX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xyXG4gICAgICB0aGlzLkxPTkdTX0VRVUFMKGV4cGVjdGVkICYgMHhGRiwgYWN0dWFsICYgMHhGRik7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ29tcGFyZXMgdHdvIG51bWJlcnMgd2l0aGluIHNvbWUgdG9sZXJhbmNlLlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCByZXN1bHRcclxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGFjdHVhbCAtIFRoZSBhY3R1YWwgcmVzdWx0XHJcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSB0b2xlcmFuY2UgLSBUaGUgbWF4aW11bSBkaWZmZXJlbmNlIHRoYXQgaXMgdG9sZXJhYmxlXHJcbiAgICovXHJcbiAgIERPVUJMRVNfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsLCB0b2xlcmFuY2UpIHtcclxuICAgICAgdmFyIGVycm9yU3RyaW5nO1xyXG5cclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xyXG5cclxuICAgICAgaWYgKE1hdGguYWJzKGV4cGVjdGVkIC0gYWN0dWFsKSA+IHRvbGVyYW5jZSkge1xyXG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIGV4cGVjdGVkICArIFwiPlxcblwiICArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFx0YnV0IHdhcyAgPFwiICsgYWN0dWFsICAgICsgXCI+XCIgICAgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiB0aHJlc2hvbGQgd2FzIDxcIiArIHRvbGVyYW5jZSArIFwiPlwiO1xyXG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XHJcbiAgICAgIH1cclxuICAgfSxcclxuXHJcbiAgIC8qKlxyXG4gICAgICBBbHdheXMgZmFpbHMgYW5kIHByaW50cyB0ZXh0LlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICAgIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gcHJpbnQgb24gZmFpbHVyZS5cclxuICAgKi9cclxuICAgRkFJTDogZnVuY3Rpb24gKHRleHQpIHtcclxuICAgICAgdmFyIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgXCJcXHRcIiArIHRleHQ7XHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcclxuICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xyXG4gICB9LFxyXG5cclxuICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgbmV3T2JqID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcclxuICAgICAgbmV3T2JqLl9pbml0KCk7XHJcbiAgICAgIHJldHVybiBuZXdPYmo7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgRW5hYmxlIGxvZ2dpbmcuIFRoaXMgaXMgZW5hYmxlZCBieSBkZWZhdWx0LlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICovXHJcbiAgIGVuYWJsZUxvZ2dpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fbG9nZ2luZyA9IHRydWU7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgRGlzYWJsZSBsb2dnaW5nLlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICovXHJcbiAgIGRpc2FibGVMb2dnaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX2xvZ2dpbmcgPSBmYWxzZTtcclxuICAgfSxcclxuXHJcbiAgIC8qKlxyXG4gICAgICBFbmFibGUgdmVyYm9zZSBsb2dnaW5nLiBUaGlzIGlzIGRpc2FibGVkIGJ5IGRlZmF1bHQuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgKi9cclxuICAgZW5hYmxlVmVyYm9zZUxvZ2dpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fdmVyYm9zZSA9IHRydWU7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgRGlzYWJsZSB2ZXJib3NlIGxvZ2dpbmcuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgKi9cclxuICAgZGlzYWJsZVZlcmJvc2VMb2dnaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX3ZlcmJvc2UgPSBmYWxzZTtcclxuICAgfSxcclxuXHJcbiAgIC8qKlxyXG4gICAgICBSdW4gYWxsIHRoZSB0ZXN0cyB0aGF0IGFyZSBjdXJyZW50bHkgZGVmaW5lZC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAqL1xyXG4gICBydW5BbGxUZXN0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9ydW4obnVsbCwgbnVsbCk7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgUnVuIGEgc3BlY2lmaWMgdGVzdCBncm91cC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge3N0cmluZ30gZ3JvdXBOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGdyb3VwIHRvIHJ1blxyXG4gICAqL1xyXG4gICBydW5UZXN0R3JvdXA6IGZ1bmN0aW9uIChncm91cE5hbWUpIHtcclxuICAgICAgdGhpcy5fcnVuKGdyb3VwTmFtZSwgbnVsbCk7XHJcbiAgIH0sXHJcblxyXG4gICAvKiogXHJcbiAgICAgIFJ1biBhIHNwZWNpZmljIHRlc3QuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSB0ZXN0IC0gSWYgdGVzdCBpcyBhIHN0cmluZyB0aGVuIHJ1biBhbGwgdGhlIHRlc3RzIHdpdGggdGhhdCBuYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcndpc2UsIHRlc3Qgc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5ncm91cDwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgZ3JvdXAgaW4gd2hpY2ggdGhlIHRlc3QgYmVsb25nczwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5uYW1lPC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSB0ZXN0IHRvIHJ1bjwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGw+XHJcbiAgICovXHJcbiAgIHJ1blRlc3Q6IGZ1bmN0aW9uICh0ZXN0KSB7XHJcbiAgICAgIHZhciAgIGdyb3VwTmFtZSA9IG51bGwsXHJcbiAgICAgICAgICAgIHRlc3ROYW1lID0gbnVsbDtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgdGVzdCA9PT0gXCJzdHJpbmdcIikge1xyXG5cclxuICAgICAgICAgdGVzdE5hbWUgPSB0ZXN0O1xyXG5cclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGVzdCA9PT0gXCJvYmplY3RcIikge1xyXG5cclxuICAgICAgICAgaWYgKFwiZ3JvdXBcIiBpbiB0ZXN0KSB7XHJcbiAgICAgICAgICAgIGdyb3VwTmFtZSA9IHRlc3QuZ3JvdXA7XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIGlmIChcIm5hbWVcIiBpbiB0ZXN0KSB7XHJcbiAgICAgICAgICAgIHRlc3ROYW1lID0gdGVzdC5uYW1lO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0ZXN0TmFtZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICB0aGlzLl9ydW4oZ3JvdXBOYW1lLCB0ZXN0TmFtZSk7XHJcbiAgICAgIH1cclxuICAgfSxcclxuXHJcbiAgIF90ZXN0R3JvdXBzOiAgIHsgXCJfZGVmYXVsdFwiOiB7IG5hbWU6IFwiX2RlZmF1bHRcIiwgdGVzdHM6IFsgXSB9IH0sXHJcbiAgIF9mYWlsQ291bnQ6ICAgIDAsXHJcbiAgIF9ydW5Db3VudDogICAgIDAsXHJcbiAgIF9jaGVja0NvdW50OiAgIDAsXHJcbiAgIF9pZ25vcmVDb3VudDogIDAsXHJcbiAgIF9zdGFydFRpbWU6ICAgIDAsXHJcbiAgIF92ZXJib3NlOiAgICAgIGZhbHNlLFxyXG4gICBfbG9nZ2luZzogICAgICB0cnVlLFxyXG4gICBfY3VycmVudEdyb3VwOiBcIlwiLFxyXG4gICBfY3VycmVudFRlc3Q6ICBcIlwiLFxyXG5cclxuICAgX2luaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fdGVzdEdyb3VwcyAgICAgPSB7IFwiX2RlZmF1bHRcIjogeyBuYW1lOiBcIl9kZWZhdWx0XCIsIHRlc3RzOiBbIF0gfSB9O1xyXG4gICAgICB0aGlzLl9mYWlsQ291bnQgICAgICA9IDA7XHJcbiAgICAgIHRoaXMuX3J1bkNvdW50ICAgICAgID0gMDtcclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCAgICAgPSAwO1xyXG4gICAgICB0aGlzLl9pZ25vcmVDb3VudCAgICA9IDA7XHJcbiAgICAgIHRoaXMuX3N0YXJ0VGltZSAgICAgID0gMDtcclxuICAgICAgdGhpcy5fdmVyYm9zZSAgICAgICAgPSBmYWxzZTtcclxuICAgICAgdGhpcy5fbG9nZ2luZyAgICAgICAgPSB0cnVlO1xyXG4gICAgICB0aGlzLl9jdXJyZW50R3JvdXAgICA9IFwiXCI7XHJcbiAgICAgIHRoaXMuX2N1cnJlbnRUZXN0ICAgID0gXCJcIjtcclxuICAgfSxcclxuXHJcbiAgIF9sb2c6IGZ1bmN0aW9uICh0ZXh0KSB7XHJcbiAgICAgIGlmICh0aGlzLl9sb2dnaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICBfcnVuOiBmdW5jdGlvbiAoZ3JvdXBOYW1lLCB0ZXN0TmFtZSkge1xyXG4gICAgICB2YXIgICB0ZXN0cyxcclxuICAgICAgICAgICAgc3RhcnQ7XHJcblxyXG4gICAgICB0aGlzLl9yZXNldFJlc3VsdHMoKTtcclxuXHJcbiAgICAgIHRlc3RzID0gdGhpcy5fZmluZFRlc3RzKGdyb3VwTmFtZSwgdGVzdE5hbWUpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXN0cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgc3RhcnQgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgICAgaWYgKHRlc3RzW2ldLmlnbm9yZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3ZlcmJvc2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgdGhpcy5fbG9nKFwiSUdOT1JFX1RFU1QoXCIgKyB0ZXN0c1tpXS5ncm91cCArXHJcbiAgICAgICAgICAgICAgICAgICAgIFwiLCBcIiArIHRlc3RzW2ldLm5hbWUgKyBcIilcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2lnbm9yZUNvdW50Kys7XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fdmVyYm9zZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl9sb2coXCJURVNUKFwiICsgdGVzdHNbaV0uZ3JvdXAgK1xyXG4gICAgICAgICAgICAgICAgICAgICBcIiwgXCIgKyB0ZXN0c1tpXS5uYW1lICsgXCIpXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9ydW5UZXN0T2JqKHRlc3RzW2ldKTtcclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICAgaWYgKHRoaXMuX3ZlcmJvc2UgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9nKFwiIC0gXCIgKyAoRGF0ZS5ub3coKSAtIHN0YXJ0KSArIFwiIG1zXFxuXCIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX2xvZ1Jlc3VsdHMoZ3JvdXBOYW1lLCB0ZXN0TmFtZSk7XHJcbiAgIH0sXHJcblxyXG4gICBfVGVzdEVycm9yOiBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgICB0aGlzLm5hbWUgPSBcIlRlc3RFcnJvclwiO1xyXG4gICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlICsgXCJcXG5cIjtcclxuICAgfSxcclxuXHJcbiAgIF90aHJvd1Rlc3RFcnJvcjogZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgICAgaWYgKHRoaXMuX1Rlc3RFcnJvci5wcm90b3R5cGUudG9TdHJpbmcoKSAhPT0gXCJFcnJvclwiKSB7XHJcbiAgICAgICAgIHRoaXMuX1Rlc3RFcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgfVxyXG4gICAgICB0aHJvdyBuZXcgdGhpcy5fVGVzdEVycm9yKG1lc3NhZ2UpO1xyXG4gICB9LFxyXG5cclxuICAgX2J1aWxkRXJyb3JTdHJpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICAgZXJyb3IgPSAoZnVuY3Rpb24gKCkgeyB0cnkgeyB0aHJvdyBuZXcgRXJyb3IoKTsgfSBjYXRjaCAoZXgpIHtyZXR1cm4gZXg7fX0pKCksXHJcbiAgICAgICAgICAgIGVycm9yU3RyaW5nID0gXCJcIixcclxuICAgICAgICAgICAgY2FsbGVyTGluZXMsXHJcbiAgICAgICAgICAgIG1hdGNoZXM7XHJcblxyXG4gICAgICBpZiAoZXJyb3Iuc3RhY2spIHtcclxuICAgICAgICAgY2FsbGVyTGluZXMgPSBlcnJvci5zdGFjay5zcGxpdChcIlxcblwiKVs0XTtcclxuICAgICAgICAgbWF0Y2hlcyA9IGNhbGxlckxpbmVzLm1hdGNoKC9cXCgoLiopXFwpLyk7XHJcbiAgICAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGVycm9yU3RyaW5nICs9IG1hdGNoZXNbMV0gKyBcIjogXCI7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZXJyb3JTdHJpbmcgKz0gXCJlcnJvcjogRmFpbHVyZSBpbiBURVNUKFwiO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRHcm91cCAhPT0gXCJfZGVmYXVsdFwiKSB7XHJcbiAgICAgICAgIGVycm9yU3RyaW5nICs9IHRoaXMuX2N1cnJlbnRHcm91cCArIFwiLCBcIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZXJyb3JTdHJpbmcgKz0gdGhpcy5fY3VycmVudFRlc3QgKyBcIilcXG5cIjtcclxuXHJcbiAgICAgIHJldHVybiBlcnJvclN0cmluZztcclxuICAgfSxcclxuXHJcbiAgIF9maW5kVGVzdHM6IGZ1bmN0aW9uIChncm91cE5hbWUsIHRlc3ROYW1lKSB7XHJcbiAgICAgIHZhciBtYXRjaGluZ1Rlc3RzID0gWyBdO1xyXG5cclxuICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLl90ZXN0R3JvdXBzKSB7XHJcblxyXG4gICAgICAgICBpZiAoKGdyb3VwTmFtZSA9PT0gbnVsbCkgfHwgKG5hbWUgPT09IGdyb3VwTmFtZSkpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdGVzdEdyb3Vwc1tuYW1lXS50ZXN0cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgaWYgKCh0ZXN0TmFtZSA9PT0gbnVsbCkgfHwgKHRoaXMuX3Rlc3RHcm91cHNbbmFtZV0udGVzdHNbaV0ubmFtZSA9PSB0ZXN0TmFtZSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgIG1hdGNoaW5nVGVzdHMucHVzaCh0aGlzLl90ZXN0R3JvdXBzW25hbWVdLnRlc3RzW2ldKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG1hdGNoaW5nVGVzdHM7XHJcbiAgIH0sXHJcblxyXG4gICBfZ2V0VGVzdENvdW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBjb3VudCA9IDA7XHJcblxyXG4gICAgICBmb3IgKHZhciBncm91cE5hbWUgaW4gdGhpcy5fdGVzdEdyb3Vwcykge1xyXG4gICAgICAgICBjb3VudCArPSB0aGlzLl90ZXN0R3JvdXBzW2dyb3VwTmFtZV0udGVzdHMubGVuZ3RoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY291bnQ7XHJcbiAgIH0sXHJcblxyXG4gICBfcmVzZXRSZXN1bHRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX2ZhaWxDb3VudCAgICA9IDA7XHJcbiAgICAgIHRoaXMuX3J1bkNvdW50ICAgICA9IDA7XHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQgICA9IDA7XHJcbiAgICAgIHRoaXMuX2lnbm9yZUNvdW50ICA9IDA7XHJcbiAgICAgIHRoaXMuX3N0YXJ0VGltZSAgICA9IERhdGUubm93KCk7XHJcbiAgIH0sXHJcblxyXG4gICBfbG9nUmVzdWx0czogZnVuY3Rpb24gKGdyb3VwTmFtZSwgdGVzdE5hbWUpIHtcclxuICAgICAgdmFyICAgcmVzdWx0cyxcclxuICAgICAgICAgICAgdGVzdENvdW50LFxyXG4gICAgICAgICAgICBzdG9wVGltZTtcclxuXHJcbiAgICAgIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9mYWlsQ291bnQgPiAwKSB7XHJcbiAgICAgICAgIHJlc3VsdHMgPSAgIFwiRXJyb3JzIChcIiAgICAgK1xyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLl9mYWlsQ291bnQ7XHJcbiAgICAgICAgIGlmICh0aGlzLl9mYWlsQ291bnQgPT09IDEpIHtcclxuICAgICAgICAgICAgcmVzdWx0cyArPSBcIiBmYWlsdXJlLCBcIjtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0cyArPSBcIiBmYWlsdXJlcywgXCI7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgcmVzdWx0cyA9IFwiT0sgKFwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0ZXN0Q291bnQgPSB0aGlzLl9nZXRUZXN0Q291bnQoKTtcclxuICAgICAgcmVzdWx0cyArPSB0ZXN0Q291bnQ7XHJcbiAgICAgIGlmICh0ZXN0Q291bnQgPT09IDEpIHtcclxuICAgICAgICAgcmVzdWx0cyArPSBcIiB0ZXN0LCBcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgcmVzdWx0cyArPSBcIiB0ZXN0cywgXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdHMgKz0gdGhpcy5fcnVuQ291bnQgKyBcIiByYW4sIFwiO1xyXG5cclxuICAgICAgcmVzdWx0cyArPSB0aGlzLl9jaGVja0NvdW50O1xyXG4gICAgICBpZiAodGhpcy5fY2hlY2tDb3VudCA9PT0gMSkge1xyXG4gICAgICAgICByZXN1bHRzICs9IFwiIGNoZWNrLCBcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgcmVzdWx0cyArPSBcIiBjaGVja3MsIFwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXN1bHRzICs9IHRoaXMuX2lnbm9yZUNvdW50ICsgXCIgaWdub3JlZCwgXCI7XHJcbiAgICAgIHJlc3VsdHMgKz0gdGhpcy5fZ2V0VGVzdENvdW50KCkgLSAodGhpcy5fcnVuQ291bnQgKyB0aGlzLl9pZ25vcmVDb3VudCk7XHJcbiAgICAgIHJlc3VsdHMgKz0gXCIgZmlsdGVyZWQgb3V0LCBcIjtcclxuICAgICAgcmVzdWx0cyArPSAoc3RvcFRpbWUgLSB0aGlzLl9zdGFydFRpbWUpICsgXCIgbXMpXFxuXFxuXCI7XHJcblxyXG4gICAgICB0aGlzLl9sb2cocmVzdWx0cyk7XHJcbiAgIH0sXHJcblxyXG4gICBfcnVuVGVzdE9iajogZnVuY3Rpb24gKHRlc3QpIHtcclxuICAgICAgdmFyIGdyb3VwID0gdGhpcy5fdGVzdEdyb3Vwc1t0ZXN0Lmdyb3VwXTtcclxuXHJcbiAgICAgIHRoaXMuX2N1cnJlbnRHcm91cCA9IHRlc3QuZ3JvdXA7XHJcbiAgICAgIHRoaXMuX2N1cnJlbnRUZXN0ICA9IHRlc3QubmFtZTtcclxuXHJcbiAgICAgIHRoaXMuX3J1bkNvdW50Kys7XHJcblxyXG4gICAgICB0cnkge1xyXG5cclxuICAgICAgICAgaWYgKHR5cGVvZiBncm91cC5zZXR1cCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLnNldHVwKHRlc3QpO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBpZiAodHlwZW9mIHRlc3QucnVuID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGVzdC5ydW4oKTtcclxuICAgICAgICAgfVxyXG5cclxuICAgICAgICAgaWYgKHR5cGVvZiBncm91cC50ZWFyZG93biA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLnRlYXJkb3duKHRlc3QpO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICB9IGNhdGNoIChleCkge1xyXG5cclxuICAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgdGhpcy5fVGVzdEVycm9yKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9sb2coZXgubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZhaWxDb3VudCsrO1xyXG5cclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgZXg7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgX3RvSW50OiBmdW5jdGlvbiAobnVtKSB7XHJcbiAgICAgIHJldHVybiAobnVtIDwgMCkgPyBNYXRoLmNlaWwobnVtKSA6IE1hdGguZmxvb3IobnVtKTtcclxuICAgfVxyXG59O1xyXG4iLCJyZXF1aXJlKFwiLi90ZXN0c1wiKTtcclxudmFyIHVUZXN0ID0gcmVxdWlyZShcIi4uLy4uL3NyYy91VGVzdFwiKTtcclxuXHJcbi8vIEFkZCBhIGNvdXBsZSBjaGVja3Mgb3V0c2lkZSBvZiB0ZXN0cyB0byBtYWtlIHN1cmUgaXRcclxuLy8gZG9lc24ndCBjYXVzZSBwcm9ibGVtc1xyXG51VGVzdC5DSEVDSyh0cnVlKTtcclxudVRlc3QuU1RSQ01QX0VRVUFMKFwiaGVsbG9cIiwgXCJoZWxsb1wiKTtcclxuXHJcbnVUZXN0LmVuYWJsZVZlcmJvc2VMb2dnaW5nKCk7XHJcblxyXG51VGVzdC5ydW5BbGxUZXN0cygpO1xyXG4iLCJ2YXIgdVRlc3QgPSByZXF1aXJlKFwiLi4vLi4vc3JjL3VUZXN0XCIpO1xyXG5cclxudVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiU2VsZlRlc3RzXCIsXHJcblxyXG4gICBzZXR1cDogZnVuY3Rpb24gKHRlc3QpIHtcclxuICAgICAgdGVzdC5teVRlc3QgPSB1VGVzdC5jbG9uZSgpO1xyXG4gICAgICB0ZXN0Lm15VGVzdC5kaXNhYmxlTG9nZ2luZygpO1xyXG4gICB9LFxyXG5cclxuICAgdGVhcmRvd246IGZ1bmN0aW9uICh0ZXN0KSB7XHJcbiAgICAgIGRlbGV0ZSB0ZXN0Lm15VGVzdDtcclxuICAgfVxyXG59KTtcclxuXHJcbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJDbG9uZVwiLFxyXG4gICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyhPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcy5teVRlc3QpID09PSB1VGVzdCk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2dldFRlc3RDb3VudCgpID09PSAwKTtcclxuICAgfVxyXG59KTtcclxuXHJcbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJMb2dnaW5nXCIsXHJcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuX2xvZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy5teVRlc3QuZW5hYmxlTG9nZ2luZygpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9sb2dnaW5nKTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0Ll9sb2dnaW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy5teVRlc3QuZGlzYWJsZUxvZ2dpbmcoKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0aGlzLm15VGVzdC5fbG9nZ2luZywgZmFsc2UpO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuX3ZlcmJvc2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5teVRlc3QuZW5hYmxlVmVyYm9zZUxvZ2dpbmcoKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fdmVyYm9zZSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5fdmVyYm9zZSA9IHRydWU7XHJcbiAgICAgIHRoaXMubXlUZXN0LmRpc2FibGVWZXJib3NlTG9nZ2luZygpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKHRoaXMubXlUZXN0Ll92ZXJib3NlLCBmYWxzZSk7XHJcbiAgIH1cclxufSk7XHJcblxyXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiUGFzc2luZ0NoZWNrc1wiLFxyXG4gICBydW46IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIlBhc3NpbmdDaGVja3NHcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIlBhc3NpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIlRlc3RcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMHg4ZiwgMHg4Zik7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVEVYVCgxID09PSAxLCBcIldoZW4gZG9lcyAxICE9PSAxP1wiKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5ET1VCTEVTX0VRVUFMKDIuMSwgMi4yLCAwLjEwMDAwMSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoMiwgMik7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuU1RSQ01QX0VRVUFMKFwib25lXCIsIFwib25lXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX0xPT1NFX0VRVUFMKDEwMDAsIFwiMTAwMFwiKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XHJcblxyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKDEsIHRoaXMubXlUZXN0Ll9nZXRUZXN0Q291bnQoKSk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMCwgdGhpcy5teVRlc3QuX2ZhaWxDb3VudCk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMSwgdGhpcy5teVRlc3QuX3J1bkNvdW50KTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCg4LCB0aGlzLm15VGVzdC5fY2hlY2tDb3VudCk7XHJcbiAgIH1cclxufSk7XHJcblxyXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiRmFpbGluZ0NoZWNrc1wiLFxyXG4gICBydW46IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDB4OGYsIDB4OTApO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLKGZhbHNlKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJDSEVDS19FUVVBTFwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfRVFVQUxfMlwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgyLCBcIjJcIik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfTE9PU0VfRVFVQUxcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMiwgXCIzXCIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLX1RFWFRcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVEVYVCgxID09PSAwLCBcIjEgc2hvdWxkIG5vdCBlcXVhbCAwXCIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkRPVUJMRVNfRVFVQUxcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuRE9VQkxFU19FUVVBTCgyLjEsIDIuMywgMC4xMDAwMSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoNSwgNik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiU1RSQ01QX0VRVUFMXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LlNUUkNNUF9FUVVBTChcIm9uZVwiLCBcInR3b1wiKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJGQUlMXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkZBSUwoXCJGYWlsIG1lIVwiKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XHJcblxyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9nZXRUZXN0Q291bnQoKSA9PT0gMTApO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICAgICA9PT0gMTApO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICAgICA9PT0gMTApO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9jaGVja0NvdW50ICAgICA9PT0gMTApO1xyXG4gICB9XHJcbn0pO1xyXG5cclxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkxPTkdTX0VRVUFMXCIsXHJcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJMT05HU19FUVVBTF9Hcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfUGFzc1wiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAxKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAxLjEpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0xLCAtMSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoLTEsIC0xLjEpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NQVhfVkFMVUUsIE51bWJlci5NQVhfVkFMVUUpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NSU5fVkFMVUUsIE51bWJlci5NSU5fVkFMVUUpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzFcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoMSwgMik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMX0ZhaWxfMlwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAwLjEpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzNcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoLTEsIC0yKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF80XCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0yLCAtMS4xKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF81XCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NQVhfVkFMVUUsIE51bWJlci5NSU5fVkFMVUUpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3QoXCJMT05HU19FUVVBTF9QYXNzXCIpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSAwKTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3RHcm91cChcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIik7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3J1bkNvdW50ICAgID09PSA1KTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZmFpbENvdW50ICAgPT09IDUpO1xyXG4gICB9XHJcbn0pO1xyXG5cclxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkJZVEVTX0VRVUFMXCIsXHJcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJCWVRFU19FUVVBTF9Hcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfUGFzc1wiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgxLCAxKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgxLCAxLjEpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKC0xLCAtMSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoLTEsIC0xLjEpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDB4MUFBLCAweEFBKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF8xXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDEsIDIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJCWVRFU19FUVVBTF9GYWlsXzJcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMSwgMC4xKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF8zXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKC0xLCAtMik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfNFwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgtMiwgLTEuMSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5ydW5UZXN0KFwiQllURVNfRVFVQUxfUGFzc1wiKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgPT09IDEpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5ydW5UZXN0R3JvdXAoXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gNCk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSA0KTtcclxuICAgfVxyXG59KTtcclxuXHJcbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJDSEVDS19UUkhPV1NcIixcclxuXHJcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB1VGVzdC5DSEVDS19USFJPVyhcIlJlZmVyZW5jZUVycm9yXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgY2FsbEFSYW5kb21Ob25FeGlzdGluZ0Z1bmN0aW9uKCk7XHJcbiAgICAgIH0pO1xyXG4gICB9XHJcblxyXG59KTtcclxuXHJcbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJVc2VUZXN0V2l0aG91dEdyb3VwXCIsXHJcblxyXG4gICBydW46IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1Qoe25hbWU6IFwiVGVzdFdpdGhvdXRHcm91cFwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDSyh0cnVlKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3QoXCJUZXN0V2l0aG91dEdyb3VwXCIpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSAwKTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3J1bkNvdW50ICAgID09PSAxKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZmFpbENvdW50ICAgPT09IDApO1xyXG4gICB9XHJcblxyXG59KTtcclxuIl19
