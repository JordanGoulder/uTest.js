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
      var   divElement,
            textNode;

      if (this._logging === true) {
         if ((typeof window !== "undefined") && document.body) {

            textNode = document.createTextNode(text);

            divElement = document.createElement("div");
            divElement.appendChild(textNode);

            document.body.appendChild(divElement);
         } else {
            console.log(text);
         }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyJjOlxcVXNlcnNcXGpnb3VsZGVyXFxBcHBEYXRhXFxSb2FtaW5nXFxucG1cXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZjovcmVwb3MvdXRlc3Qvc3JjL3VUZXN0LmpzIiwiZjovcmVwb3MvdXRlc3QvdGVzdHMvc2NyaXB0cy9tYWluLmpzIiwiZjovcmVwb3MvdXRlc3QvdGVzdHMvc2NyaXB0cy90ZXN0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdG9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxyXG4gICBUaGUgTUlUIExpY2Vuc2UgKE1JVClcclxuXHJcbiAgIENvcHlyaWdodCAoYykgMjAxNCBKb3JkYW4gR291bGRlciwgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuXHJcbiAgIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuICAgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gICBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiAgIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuICAgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiAgIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG4gICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcclxuICAgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiAgIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuICAgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiAgIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gICBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiAgIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiAgIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXHJcbiAgIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAgIEEgdW5pdCB0ZXN0IGZyYW1ld29yayBmb3IgSmF2YVNjcmlwdCBtb2RlbGVkIGFmdGVyIGNwcFVUZXN0LlxyXG4gICBAbW9kdWxlIHVUZXN0XHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICAgLyoqXHJcbiAgICAgIERlZmluZSBhIHRlc3QgZ3JvdXAuXHJcblxyXG4gICAgICBAaW5zdGFuY2UgXHJcbiAgICAgIEBwYXJhbSB7b2JqZWN0fSBncm91cCAtIEEgZ3JvdXAgb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5uYW1lPC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBuYW1lIG9mIHRoZSBncm91cDwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5zZXR1cCA8ZW0+KG9wdGlvbmFsKTwvZW0+PC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSBzZXR1cCBmdW5jdGlvbiB0aGF0IGlzIHJ1biBiZWZvcmUgZWFjaCB0ZXN0IGluIHRoZSBncm91cDwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD50ZWFyZG93biA8ZW0+KG9wdGlvbmFsKTwvZW0+PC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkPlRoZSB0ZWFyZG93biBmdW5jdGlvbiB0aGF0IGlzIHJ1biBhZnRlciBlYWNoIHRlc3QgaW4gdGhlIGdyb3VwPC9kZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kbD5cclxuICAgKi9cclxuICAgVEVTVF9HUk9VUDogZnVuY3Rpb24gKGdyb3VwKSB7XHJcbiAgICAgIGdyb3VwLnRlc3RzID0gWyBdO1xyXG4gICAgICB0aGlzLl90ZXN0R3JvdXBzW2dyb3VwLm5hbWVdID0gZ3JvdXA7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgRGVmaW5lIGEgdGVzdC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge29iamVjdH0gdGVzdCAtIEEgdGVzdCBvYmplY3QgdGhhdCBoYXMgdGhlIGZvbGx3aW5nIHByb3BlcnRpZXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pmdyb3VwIDxlbT4ob3B0aW9uYWwpPC9lbT48L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIGdyb3VwIGluIHdoaWNoIHRoZSB0ZXN0IGJlbG9uZ3M8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+bmFtZTwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgdGVzdDwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5ydW48L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIGZ1bmN0aW9uIHRoYXQgaXMgcnVuIHRvIHBlcmZvcm0gdGhlIHRlc3Q8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxyXG4gICAqL1xyXG4gICBURVNUOiBmdW5jdGlvbiAodGVzdCkge1xyXG4gICAgICB0ZXN0Lmdyb3VwID0gdGVzdC5ncm91cCB8fCBcIl9kZWZhdWx0XCI7XHJcbiAgICAgIHRlc3QudVRlc3QgPSB0aGlzO1xyXG4gICAgICB0ZXN0Lmlnbm9yZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLl90ZXN0R3JvdXBzW3Rlc3QuZ3JvdXBdLnRlc3RzLnB1c2godGVzdCk7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgRGVmaW5lIGEgdGVzdCB0aGF0IHdpbGwgYmUgaWdub3JlZC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge29iamVjdH0gdGVzdCAtIEEgdGVzdCBvYmplY3QgdGhhdCBoYXMgdGhlIGZvbGx3aW5nIHByb3BlcnRpZXM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGR0Pmdyb3VwIDxlbT4ob3B0aW9uYWwpPC9lbT48L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIGdyb3VwIGluIHdoaWNoIHRoZSB0ZXN0IGJlbG9uZ3M8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+bmFtZTwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgdGVzdDwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdD5ydW48L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIGZ1bmN0aW9uIHRoYXQgaXMgcnVuIHRvIHBlcmZvcm0gdGhlIHRlc3Q8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxyXG4gICAqL1xyXG4gICBJR05PUkVfVEVTVDogZnVuY3Rpb24gKHRlc3QpIHtcclxuICAgICAgdGhpcy5URVNUKHRlc3QpO1xyXG4gICAgICB0ZXN0Lmlnbm9yZSA9IHRydWU7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ2hlY2sgYSBib29sZWFuIHJlc3VsdC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXHJcbiAgICovXHJcbiAgIENIRUNLOiBmdW5jdGlvbiAoY29uZGl0aW9uKSB7XHJcbiAgICAgIHZhciBlcnJvclN0cmluZztcclxuXHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcclxuXHJcbiAgICAgIGlmIChjb25kaXRpb24gIT09IHRydWUpIHtcclxuICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyBcIlxcdENIRUNLIGZhaWxlZFwiO1xyXG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XHJcbiAgICAgIH1cclxuICAgfSxcclxuXHJcbiAgIC8qKlxyXG4gICAgICBDaGVjayBmb3IgYSB0cnVlIHJlc3VsdC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXHJcbiAgICovXHJcbiAgIENIRUNLX1RSVUU6IGZ1bmN0aW9uIChjb25kaXRpb24pIHtcclxuICAgICAgdGhpcy5DSEVDSyhjb25kaXRpb24pO1xyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIENoZWNrIGZvciBhIGZhbHNlIHJlc3VsdC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAtIFRoZSByZXN1bHQgdGhhdCBpcyBjaGVja2VkXHJcbiAgICovXHJcbiAgIENIRUNLX0ZBTFNFOiBmdW5jdGlvbiAoY29uZGl0aW9uKSB7XHJcbiAgICAgIHZhciBlcnJvclN0cmluZztcclxuXHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcclxuXHJcbiAgICAgIGlmIChjb25kaXRpb24gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgXCJcXHRDSEVDS19GQUxTRSBmYWlsZWRcIjtcclxuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ2hlY2sgYSBib29sZWFuIHJlc3VsdCBhbmQgcHJpbnQgdGV4dCBvbiBmYWlsdXJlLlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICAgIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uIC0gVGhlIHJlc3VsdCB0aGF0IGlzIGNoZWNrZWRcclxuICAgICAgQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBwcmludCBvbiBmYWlsdXJlXHJcbiAgICovXHJcbiAgIENIRUNLX1RFWFQ6IGZ1bmN0aW9uIChjb25kaXRpb24sIHRleHQpIHtcclxuICAgICAgdmFyIGVycm9yU3RyaW5nO1xyXG5cclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xyXG5cclxuICAgICAgaWYgKGNvbmRpdGlvbiAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArIFwiXFx0TWVzc2FnZTogXCIgKyB0ZXh0ICsgXCJcXG5cXHRDSEVDSyBmYWlsZWRcIjtcclxuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ2hlY2sgZm9yIGVxdWFsaXR5IGJldHdlZW4gdHdvIGVudGl0aWVzIHVzaW5nIHN0cmljdCBlcXVhbGl0eSAoPT09KVxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICAgIEBwYXJhbSB7YW55fSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCByZXN1bHRcclxuICAgICAgQHBhcmFtIHthbnl9IGFjdHVhbCAtIFRoZSBhY3R1YWwgcmVzdWx0XHJcbiAgICovXHJcbiAgIENIRUNLX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xyXG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XHJcblxyXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XHJcblxyXG4gICAgICBpZiAoZXhwZWN0ZWQgIT09IGFjdHVhbCkge1xyXG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIGV4cGVjdGVkICArIFwiPlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBhY3R1YWwgICAgKyBcIj5cIjtcclxuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ2hlY2sgZm9yIGVxdWFsaXR5IGJldHdlZW4gdHdvIGVudGl0aWVzIHVzaW5nIGxvb3NlIGVxdWFsaXR5ICg9PSlcclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge2FueX0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgcmVzdWx0XHJcbiAgICAgIEBwYXJhbSB7YW55fSBhY3R1YWwgLSBUaGUgYWN0dWFsIHJlc3VsdFxyXG4gICAqL1xyXG4gICBDSEVDS19MT09TRV9FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwpIHtcclxuICAgICAgdmFyIGVycm9yU3RyaW5nO1xyXG5cclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xyXG5cclxuICAgICAgaWYgKGV4cGVjdGVkICE9IGFjdHVhbCkge1xyXG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIGV4cGVjdGVkICArIFwiPlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBhY3R1YWwgICAgKyBcIj5cIjtcclxuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ2hlY2sgZm9yIGFuIGV4Y2VwdGlvbiB0byBiZSB0aHJvd24gYnkgY2FsbGluZyBhIHNwZWNpZmllZCBmdW5jdGlvbi5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge0Vycm9yfSBleGNlcHRpb24gLSBUaGUgcmVzdWx0aW5nIGV4Y2VwdGlvbiB0aGF0IHNob3VsZCBiZSB0aHJvd24gYnkgY2FsbGluZyBmdW5jXHJcbiAgICAgIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgLSBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZFxyXG4gICAqL1xyXG4gICBDSEVDS19USFJPVzogZnVuY3Rpb24gKGV4Y2VwdGlvbiwgZnVuYykge1xyXG4gICAgICB2YXIgICBlcnJvclN0cmluZyxcclxuICAgICAgICAgICAgdGhyb3duID0gZmFsc2U7XHJcblxyXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgICBmdW5jKCk7XHJcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgIGlmIChleC5uYW1lID09PSBleGNlcHRpb24pIHtcclxuICAgICAgICAgICAgdGhyb3duID0gdHJ1ZTtcclxuICAgICAgICAgfVxyXG4gICAgICAgICBlbHNlXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgZXg7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aHJvd24pIHtcclxuICAgICAgICAgICAgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyAgXCJcXHRleHBlY3RlZCBcIiArIGV4Y2VwdGlvbiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIHdhcyBub3QgdGhyb3duXCI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XHJcbiAgICAgIH1cclxuICAgfSxcclxuXHJcbiAgIC8qKlxyXG4gICAgICBDaGVjayBmb3IgZXF1YWxpdHkgdXNpbmcgZXhwZWN0ZWQudG9TdHJpbmcoKSA9PT0gYWN0dWFsLnRvU3RyaW5nKClcclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAgICBAcGFyYW0ge2FueX0gZXhwZWN0ZWQgLSBUaGUgZXhwZWN0ZWQgcmVzdWx0XHJcbiAgICAgIEBwYXJhbSB7YW55fSBhY3R1YWwgLSBUaGUgYWN0dWFsIHJlc3VsdFxyXG4gICAqL1xyXG4gICBTVFJDTVBfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsKSB7XHJcbiAgICAgIHZhciBlcnJvclN0cmluZztcclxuXHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQrKztcclxuXHJcbiAgICAgIGlmIChleHBlY3RlZC50b1N0cmluZygpICE9PSBhY3R1YWwudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICBlcnJvclN0cmluZyA9IHRoaXMuX2J1aWxkRXJyb3JTdHJpbmcoKSArICBcIlxcdGV4cGVjdGVkIDxcIiArIGV4cGVjdGVkLnRvU3RyaW5nKCkgICArIFwiPlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBhY3R1YWwudG9TdHJpbmcoKSAgICAgKyBcIj5cIjtcclxuICAgICAgICAgdGhpcy5fdGhyb3dUZXN0RXJyb3IoZXJyb3JTdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgQ29tcGFyZSB0d28gaW50ZWdlcnMuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIGludGVnZXIgcmVzdWx0XHJcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBhY3R1YWwgLSBUaGUgYWN0dWFsIGludGVnZXIgcmVzdWx0XHJcbiAgICovXHJcbiAgIExPTkdTX0VRVUFMOiBmdW5jdGlvbiAoZXhwZWN0ZWQsIGFjdHVhbCkge1xyXG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XHJcblxyXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XHJcblxyXG4gICAgICBpZiAodGhpcy5fdG9JbnQoZXhwZWN0ZWQpICE9PSB0aGlzLl90b0ludChhY3R1YWwpKSB7XHJcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgPFwiICsgTWF0aC5mbG9vcihleHBlY3RlZCkgICsgXCI+XFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlxcdGJ1dCB3YXMgIDxcIiArIE1hdGguZmxvb3IoYWN0dWFsKSAgICArIFwiPlwiO1xyXG4gICAgICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XHJcbiAgICAgIH1cclxuICAgfSxcclxuXHJcbiAgIC8qKlxyXG4gICAgICBDb21wYXJlIHR3byA4LWJpdCB3aWRlIGludGVnZXJzLlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBleHBlY3RlZCAtIFRoZSBleHBlY3RlZCA4LWJpdCB3aWRlIGludGVnZXIgcmVzdWx0XHJcbiAgICAgIEBwYXJhbSB7bnVtYmVyfSBhY3R1YWwgLSBUaGUgYWN0dWFsIDgtYml0IHdpZGUgaW50ZWdlciByZXN1bHRcclxuICAgKi9cclxuICAgQllURVNfRVFVQUw6IGZ1bmN0aW9uIChleHBlY3RlZCwgYWN0dWFsKSB7XHJcbiAgICAgIHRoaXMuTE9OR1NfRVFVQUwoZXhwZWN0ZWQgJiAweEZGLCBhY3R1YWwgJiAweEZGKTtcclxuICAgfSxcclxuXHJcbiAgIC8qKlxyXG4gICAgICBDb21wYXJlcyB0d28gbnVtYmVycyB3aXRoaW4gc29tZSB0b2xlcmFuY2UuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHtudW1iZXJ9IGV4cGVjdGVkIC0gVGhlIGV4cGVjdGVkIHJlc3VsdFxyXG4gICAgICBAcGFyYW0ge251bWJlcn0gYWN0dWFsIC0gVGhlIGFjdHVhbCByZXN1bHRcclxuICAgICAgQHBhcmFtIHtudW1iZXJ9IHRvbGVyYW5jZSAtIFRoZSBtYXhpbXVtIGRpZmZlcmVuY2UgdGhhdCBpcyB0b2xlcmFibGVcclxuICAgKi9cclxuICAgRE9VQkxFU19FUVVBTDogZnVuY3Rpb24gKGV4cGVjdGVkLCBhY3R1YWwsIHRvbGVyYW5jZSkge1xyXG4gICAgICB2YXIgZXJyb3JTdHJpbmc7XHJcblxyXG4gICAgICB0aGlzLl9jaGVja0NvdW50Kys7XHJcblxyXG4gICAgICBpZiAoTWF0aC5hYnMoZXhwZWN0ZWQgLSBhY3R1YWwpID4gdG9sZXJhbmNlKSB7XHJcbiAgICAgICAgIGVycm9yU3RyaW5nID0gdGhpcy5fYnVpbGRFcnJvclN0cmluZygpICsgIFwiXFx0ZXhwZWN0ZWQgPFwiICsgZXhwZWN0ZWQgICsgXCI+XFxuXCIgICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXHRidXQgd2FzICA8XCIgKyBhY3R1YWwgICAgKyBcIj5cIiAgICArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIHRocmVzaG9sZCB3YXMgPFwiICsgdG9sZXJhbmNlICsgXCI+XCI7XHJcbiAgICAgICAgIHRoaXMuX3Rocm93VGVzdEVycm9yKGVycm9yU3RyaW5nKTtcclxuICAgICAgfVxyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIEFsd2F5cyBmYWlscyBhbmQgcHJpbnRzIHRleHQuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBwcmludCBvbiBmYWlsdXJlLlxyXG4gICAqL1xyXG4gICBGQUlMOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICB2YXIgZXJyb3JTdHJpbmcgPSB0aGlzLl9idWlsZEVycm9yU3RyaW5nKCkgKyBcIlxcdFwiICsgdGV4dDtcclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCsrO1xyXG4gICAgICB0aGlzLl90aHJvd1Rlc3RFcnJvcihlcnJvclN0cmluZyk7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgUmV0dXJuIGEgY2xvbmUgb2YgdGhlIHVUZXN0IG9iamVjdCB0aGF0IGhhcyBiZWVuIGluaXRpYWxpemVkLlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICovXHJcbiAgIGNsb25lOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIG5ld09iaiA9IE9iamVjdC5jcmVhdGUodGhpcyk7XHJcbiAgICAgIG5ld09iai5faW5pdCgpO1xyXG4gICAgICByZXR1cm4gbmV3T2JqO1xyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIEVuYWJsZSBsb2dnaW5nLiBUaGlzIGlzIGVuYWJsZWQgYnkgZGVmYXVsdC5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAqL1xyXG4gICBlbmFibGVMb2dnaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX2xvZ2dpbmcgPSB0cnVlO1xyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIERpc2FibGUgbG9nZ2luZy5cclxuXHJcbiAgICAgIEBpbnN0YW5jZVxyXG4gICAqL1xyXG4gICBkaXNhYmxlTG9nZ2luZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9sb2dnaW5nID0gZmFsc2U7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgRW5hYmxlIHZlcmJvc2UgbG9nZ2luZy4gVGhpcyBpcyBkaXNhYmxlZCBieSBkZWZhdWx0LlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICovXHJcbiAgIGVuYWJsZVZlcmJvc2VMb2dnaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX3ZlcmJvc2UgPSB0cnVlO1xyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIERpc2FibGUgdmVyYm9zZSBsb2dnaW5nLlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICovXHJcbiAgIGRpc2FibGVWZXJib3NlTG9nZ2luZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl92ZXJib3NlID0gZmFsc2U7XHJcbiAgIH0sXHJcblxyXG4gICAvKipcclxuICAgICAgUnVuIGFsbCB0aGUgdGVzdHMgdGhhdCBhcmUgY3VycmVudGx5IGRlZmluZWQuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgKi9cclxuICAgcnVuQWxsVGVzdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fcnVuKG51bGwsIG51bGwpO1xyXG4gICB9LFxyXG5cclxuICAgLyoqXHJcbiAgICAgIFJ1biBhIHNwZWNpZmljIHRlc3QgZ3JvdXAuXHJcblxyXG4gICAgICBAaW5zdGFuY2VcclxuICAgICAgQHBhcmFtIHtzdHJpbmd9IGdyb3VwTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBncm91cCB0byBydW5cclxuICAgKi9cclxuICAgcnVuVGVzdEdyb3VwOiBmdW5jdGlvbiAoZ3JvdXBOYW1lKSB7XHJcbiAgICAgIHRoaXMuX3J1bihncm91cE5hbWUsIG51bGwpO1xyXG4gICB9LFxyXG5cclxuICAgLyoqIFxyXG4gICAgICBSdW4gYSBzcGVjaWZpYyB0ZXN0LlxyXG5cclxuICAgICAgQGluc3RhbmNlXHJcbiAgICAgIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gdGVzdCAtIElmIHRlc3QgaXMgYSBzdHJpbmcgdGhlbiBydW4gYWxsIHRoZSB0ZXN0cyB3aXRoIHRoYXQgbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJ3aXNlLCB0ZXN0IHNob3VsZCBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbHdpbmcgcHJvcGVydGllczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+Z3JvdXA8L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQ+VGhlIG5hbWUgb2YgdGhlIGdyb3VwIGluIHdoaWNoIHRoZSB0ZXN0IGJlbG9uZ3M8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQ+bmFtZTwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZD5UaGUgbmFtZSBvZiB0aGUgdGVzdCB0byBydW48L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2RsPlxyXG4gICAqL1xyXG4gICBydW5UZXN0OiBmdW5jdGlvbiAodGVzdCkge1xyXG4gICAgICB2YXIgICBncm91cE5hbWUgPSBudWxsLFxyXG4gICAgICAgICAgICB0ZXN0TmFtZSA9IG51bGw7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIHRlc3QgPT09IFwic3RyaW5nXCIpIHtcclxuXHJcbiAgICAgICAgIHRlc3ROYW1lID0gdGVzdDtcclxuXHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRlc3QgPT09IFwib2JqZWN0XCIpIHtcclxuXHJcbiAgICAgICAgIGlmIChcImdyb3VwXCIgaW4gdGVzdCkge1xyXG4gICAgICAgICAgICBncm91cE5hbWUgPSB0ZXN0Lmdyb3VwO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBpZiAoXCJuYW1lXCIgaW4gdGVzdCkge1xyXG4gICAgICAgICAgICB0ZXN0TmFtZSA9IHRlc3QubmFtZTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGVzdE5hbWUgIT09IG51bGwpIHtcclxuICAgICAgICAgdGhpcy5fcnVuKGdyb3VwTmFtZSwgdGVzdE5hbWUpO1xyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICBfdGVzdEdyb3VwczogICB7IFwiX2RlZmF1bHRcIjogeyBuYW1lOiBcIl9kZWZhdWx0XCIsIHRlc3RzOiBbIF0gfSB9LFxyXG4gICBfZmFpbENvdW50OiAgICAwLFxyXG4gICBfcnVuQ291bnQ6ICAgICAwLFxyXG4gICBfY2hlY2tDb3VudDogICAwLFxyXG4gICBfaWdub3JlQ291bnQ6ICAwLFxyXG4gICBfc3RhcnRUaW1lOiAgICAwLFxyXG4gICBfdmVyYm9zZTogICAgICBmYWxzZSxcclxuICAgX2xvZ2dpbmc6ICAgICAgdHJ1ZSxcclxuICAgX2N1cnJlbnRHcm91cDogXCJcIixcclxuICAgX2N1cnJlbnRUZXN0OiAgXCJcIixcclxuXHJcbiAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX3Rlc3RHcm91cHMgICAgID0geyBcIl9kZWZhdWx0XCI6IHsgbmFtZTogXCJfZGVmYXVsdFwiLCB0ZXN0czogWyBdIH0gfTtcclxuICAgICAgdGhpcy5fZmFpbENvdW50ICAgICAgPSAwO1xyXG4gICAgICB0aGlzLl9ydW5Db3VudCAgICAgICA9IDA7XHJcbiAgICAgIHRoaXMuX2NoZWNrQ291bnQgICAgID0gMDtcclxuICAgICAgdGhpcy5faWdub3JlQ291bnQgICAgPSAwO1xyXG4gICAgICB0aGlzLl9zdGFydFRpbWUgICAgICA9IDA7XHJcbiAgICAgIHRoaXMuX3ZlcmJvc2UgICAgICAgID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuX2xvZ2dpbmcgICAgICAgID0gdHJ1ZTtcclxuICAgICAgdGhpcy5fY3VycmVudEdyb3VwICAgPSBcIlwiO1xyXG4gICAgICB0aGlzLl9jdXJyZW50VGVzdCAgICA9IFwiXCI7XHJcbiAgIH0sXHJcblxyXG4gICBfbG9nOiBmdW5jdGlvbiAodGV4dCkge1xyXG4gICAgICB2YXIgICBkaXZFbGVtZW50LFxyXG4gICAgICAgICAgICB0ZXh0Tm9kZTtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9sb2dnaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgIGlmICgodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikgJiYgZG9jdW1lbnQuYm9keSkge1xyXG5cclxuICAgICAgICAgICAgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcclxuXHJcbiAgICAgICAgICAgIGRpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBkaXZFbGVtZW50LmFwcGVuZENoaWxkKHRleHROb2RlKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGl2RWxlbWVudCk7XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRleHQpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgfSxcclxuXHJcbiAgIF9ydW46IGZ1bmN0aW9uIChncm91cE5hbWUsIHRlc3ROYW1lKSB7XHJcbiAgICAgIHZhciAgIHRlc3RzLFxyXG4gICAgICAgICAgICBzdGFydDtcclxuXHJcbiAgICAgIHRoaXMuX3Jlc2V0UmVzdWx0cygpO1xyXG5cclxuICAgICAgdGVzdHMgPSB0aGlzLl9maW5kVGVzdHMoZ3JvdXBOYW1lLCB0ZXN0TmFtZSk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlc3RzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICBzdGFydCA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICAgICBpZiAodGVzdHNbaV0uaWdub3JlID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fdmVyYm9zZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICB0aGlzLl9sb2coXCJJR05PUkVfVEVTVChcIiArIHRlc3RzW2ldLmdyb3VwICtcclxuICAgICAgICAgICAgICAgICAgICAgXCIsIFwiICsgdGVzdHNbaV0ubmFtZSArIFwiKVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5faWdub3JlQ291bnQrKztcclxuICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl92ZXJib3NlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuX2xvZyhcIlRFU1QoXCIgKyB0ZXN0c1tpXS5ncm91cCArXHJcbiAgICAgICAgICAgICAgICAgICAgIFwiLCBcIiArIHRlc3RzW2ldLm5hbWUgKyBcIilcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3J1blRlc3RPYmoodGVzdHNbaV0pO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBpZiAodGhpcy5fdmVyYm9zZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2coXCIgLSBcIiArIChEYXRlLm5vdygpIC0gc3RhcnQpICsgXCIgbXNcXG5cIik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fbG9nUmVzdWx0cyhncm91cE5hbWUsIHRlc3ROYW1lKTtcclxuICAgfSxcclxuXHJcbiAgIF9UZXN0RXJyb3I6IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IFwiVGVzdEVycm9yXCI7XHJcbiAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcblwiO1xyXG4gICB9LFxyXG5cclxuICAgX3Rocm93VGVzdEVycm9yOiBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgICBpZiAodGhpcy5fVGVzdEVycm9yLnByb3RvdHlwZS50b1N0cmluZygpICE9PSBcIkVycm9yXCIpIHtcclxuICAgICAgICAgdGhpcy5fVGVzdEVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xyXG4gICAgICB9XHJcbiAgICAgIHRocm93IG5ldyB0aGlzLl9UZXN0RXJyb3IobWVzc2FnZSk7XHJcbiAgIH0sXHJcblxyXG4gICBfYnVpbGRFcnJvclN0cmluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgICBlcnJvciA9IChmdW5jdGlvbiAoKSB7IHRyeSB7IHRocm93IG5ldyBFcnJvcigpOyB9IGNhdGNoIChleCkge3JldHVybiBleDt9fSkoKSxcclxuICAgICAgICAgICAgZXJyb3JTdHJpbmcgPSBcIlwiLFxyXG4gICAgICAgICAgICBjYWxsZXJMaW5lcyxcclxuICAgICAgICAgICAgbWF0Y2hlcztcclxuXHJcbiAgICAgIGlmIChlcnJvci5zdGFjaykge1xyXG4gICAgICAgICBjYWxsZXJMaW5lcyA9IGVycm9yLnN0YWNrLnNwbGl0KFwiXFxuXCIpWzRdO1xyXG4gICAgICAgICBtYXRjaGVzID0gY2FsbGVyTGluZXMubWF0Y2goL1xcKCguKilcXCkvKTtcclxuICAgICAgICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgZXJyb3JTdHJpbmcgKz0gbWF0Y2hlc1sxXSArIFwiOiBcIjtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBlcnJvclN0cmluZyArPSBcImVycm9yOiBGYWlsdXJlIGluIFRFU1QoXCI7XHJcblxyXG4gICAgICBpZiAodGhpcy5fY3VycmVudEdyb3VwICE9PSBcIl9kZWZhdWx0XCIpIHtcclxuICAgICAgICAgZXJyb3JTdHJpbmcgKz0gdGhpcy5fY3VycmVudEdyb3VwICsgXCIsIFwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBlcnJvclN0cmluZyArPSB0aGlzLl9jdXJyZW50VGVzdCArIFwiKVxcblwiO1xyXG5cclxuICAgICAgcmV0dXJuIGVycm9yU3RyaW5nO1xyXG4gICB9LFxyXG5cclxuICAgX2ZpbmRUZXN0czogZnVuY3Rpb24gKGdyb3VwTmFtZSwgdGVzdE5hbWUpIHtcclxuICAgICAgdmFyIG1hdGNoaW5nVGVzdHMgPSBbIF07XHJcblxyXG4gICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMuX3Rlc3RHcm91cHMpIHtcclxuXHJcbiAgICAgICAgIGlmICgoZ3JvdXBOYW1lID09PSBudWxsKSB8fCAobmFtZSA9PT0gZ3JvdXBOYW1lKSkge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90ZXN0R3JvdXBzW25hbWVdLnRlc3RzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICBpZiAoKHRlc3ROYW1lID09PSBudWxsKSB8fCAodGhpcy5fdGVzdEdyb3Vwc1tuYW1lXS50ZXN0c1tpXS5uYW1lID09IHRlc3ROYW1lKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgbWF0Y2hpbmdUZXN0cy5wdXNoKHRoaXMuX3Rlc3RHcm91cHNbbmFtZV0udGVzdHNbaV0pO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWF0Y2hpbmdUZXN0cztcclxuICAgfSxcclxuXHJcbiAgIF9nZXRUZXN0Q291bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGNvdW50ID0gMDtcclxuXHJcbiAgICAgIGZvciAodmFyIGdyb3VwTmFtZSBpbiB0aGlzLl90ZXN0R3JvdXBzKSB7XHJcbiAgICAgICAgIGNvdW50ICs9IHRoaXMuX3Rlc3RHcm91cHNbZ3JvdXBOYW1lXS50ZXN0cy5sZW5ndGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjb3VudDtcclxuICAgfSxcclxuXHJcbiAgIF9yZXNldFJlc3VsdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5fZmFpbENvdW50ICAgID0gMDtcclxuICAgICAgdGhpcy5fcnVuQ291bnQgICAgID0gMDtcclxuICAgICAgdGhpcy5fY2hlY2tDb3VudCAgID0gMDtcclxuICAgICAgdGhpcy5faWdub3JlQ291bnQgID0gMDtcclxuICAgICAgdGhpcy5fc3RhcnRUaW1lICAgID0gRGF0ZS5ub3coKTtcclxuICAgfSxcclxuXHJcbiAgIF9sb2dSZXN1bHRzOiBmdW5jdGlvbiAoZ3JvdXBOYW1lLCB0ZXN0TmFtZSkge1xyXG4gICAgICB2YXIgICByZXN1bHRzLFxyXG4gICAgICAgICAgICB0ZXN0Q291bnQsXHJcbiAgICAgICAgICAgIHN0b3BUaW1lO1xyXG5cclxuICAgICAgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX2ZhaWxDb3VudCA+IDApIHtcclxuICAgICAgICAgcmVzdWx0cyA9ICAgXCJFcnJvcnMgKFwiICAgICArXHJcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhaWxDb3VudDtcclxuICAgICAgICAgaWYgKHRoaXMuX2ZhaWxDb3VudCA9PT0gMSkge1xyXG4gICAgICAgICAgICByZXN1bHRzICs9IFwiIGZhaWx1cmUsIFwiO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHRzICs9IFwiIGZhaWx1cmVzLCBcIjtcclxuICAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICByZXN1bHRzID0gXCJPSyAoXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRlc3RDb3VudCA9IHRoaXMuX2dldFRlc3RDb3VudCgpO1xyXG4gICAgICByZXN1bHRzICs9IHRlc3RDb3VudDtcclxuICAgICAgaWYgKHRlc3RDb3VudCA9PT0gMSkge1xyXG4gICAgICAgICByZXN1bHRzICs9IFwiIHRlc3QsIFwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICByZXN1bHRzICs9IFwiIHRlc3RzLCBcIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVzdWx0cyArPSB0aGlzLl9ydW5Db3VudCArIFwiIHJhbiwgXCI7XHJcblxyXG4gICAgICByZXN1bHRzICs9IHRoaXMuX2NoZWNrQ291bnQ7XHJcbiAgICAgIGlmICh0aGlzLl9jaGVja0NvdW50ID09PSAxKSB7XHJcbiAgICAgICAgIHJlc3VsdHMgKz0gXCIgY2hlY2ssIFwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICByZXN1bHRzICs9IFwiIGNoZWNrcywgXCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdHMgKz0gdGhpcy5faWdub3JlQ291bnQgKyBcIiBpZ25vcmVkLCBcIjtcclxuICAgICAgcmVzdWx0cyArPSB0aGlzLl9nZXRUZXN0Q291bnQoKSAtICh0aGlzLl9ydW5Db3VudCArIHRoaXMuX2lnbm9yZUNvdW50KTtcclxuICAgICAgcmVzdWx0cyArPSBcIiBmaWx0ZXJlZCBvdXQsIFwiO1xyXG4gICAgICByZXN1bHRzICs9IChzdG9wVGltZSAtIHRoaXMuX3N0YXJ0VGltZSkgKyBcIiBtcylcXG5cXG5cIjtcclxuXHJcbiAgICAgIHRoaXMuX2xvZyhyZXN1bHRzKTtcclxuICAgfSxcclxuXHJcbiAgIF9ydW5UZXN0T2JqOiBmdW5jdGlvbiAodGVzdCkge1xyXG4gICAgICB2YXIgZ3JvdXAgPSB0aGlzLl90ZXN0R3JvdXBzW3Rlc3QuZ3JvdXBdO1xyXG5cclxuICAgICAgdGhpcy5fY3VycmVudEdyb3VwID0gdGVzdC5ncm91cDtcclxuICAgICAgdGhpcy5fY3VycmVudFRlc3QgID0gdGVzdC5uYW1lO1xyXG5cclxuICAgICAgdGhpcy5fcnVuQ291bnQrKztcclxuXHJcbiAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICBpZiAodHlwZW9mIGdyb3VwLnNldHVwID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgZ3JvdXAuc2V0dXAodGVzdCk7XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgIGlmICh0eXBlb2YgdGVzdC5ydW4gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0ZXN0LnJ1bigpO1xyXG4gICAgICAgICB9XHJcblxyXG4gICAgICAgICBpZiAodHlwZW9mIGdyb3VwLnRlYXJkb3duID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgZ3JvdXAudGVhcmRvd24odGVzdCk7XHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcblxyXG4gICAgICAgICBpZiAoZXggaW5zdGFuY2VvZiB0aGlzLl9UZXN0RXJyb3IpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2xvZyhleC5tZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5fZmFpbENvdW50Kys7XHJcblxyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBleDtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgIH0sXHJcblxyXG4gICBfdG9JbnQ6IGZ1bmN0aW9uIChudW0pIHtcclxuICAgICAgcmV0dXJuIChudW0gPCAwKSA/IE1hdGguY2VpbChudW0pIDogTWF0aC5mbG9vcihudW0pO1xyXG4gICB9XHJcbn07XHJcbiIsInJlcXVpcmUoXCIuL3Rlc3RzXCIpO1xyXG52YXIgdVRlc3QgPSByZXF1aXJlKFwiLi4vLi4vc3JjL3VUZXN0XCIpO1xyXG5cclxuZnVuY3Rpb24gbWFpbiAoKSB7XHJcbiAgIC8vIEFkZCBhIGNvdXBsZSBjaGVja3Mgb3V0c2lkZSBvZiB0ZXN0cyB0byBtYWtlIHN1cmUgaXRcclxuICAgLy8gZG9lc24ndCBjYXVzZSBwcm9ibGVtc1xyXG4gICB1VGVzdC5DSEVDSyh0cnVlKTtcclxuICAgdVRlc3QuU1RSQ01QX0VRVUFMKFwiaGVsbG9cIiwgXCJoZWxsb1wiKTtcclxuXHJcbiAgIHVUZXN0LmVuYWJsZVZlcmJvc2VMb2dnaW5nKCk7XHJcblxyXG4gICB1VGVzdC5ydW5BbGxUZXN0cygpO1xyXG59XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgbWFpbik7XHJcbn0gZWxzZSB7XHJcbiAgIG1haW4oKTtcclxufVxyXG4iLCJ2YXIgdVRlc3QgPSByZXF1aXJlKFwiLi4vLi4vc3JjL3VUZXN0XCIpO1xyXG5cclxudVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiU2VsZlRlc3RzXCIsXHJcblxyXG4gICBzZXR1cDogZnVuY3Rpb24gKHRlc3QpIHtcclxuICAgICAgdGVzdC5teVRlc3QgPSB1VGVzdC5jbG9uZSgpO1xyXG4gICAgICB0ZXN0Lm15VGVzdC5kaXNhYmxlTG9nZ2luZygpO1xyXG4gICB9LFxyXG5cclxuICAgdGVhcmRvd246IGZ1bmN0aW9uICh0ZXN0KSB7XHJcbiAgICAgIGRlbGV0ZSB0ZXN0Lm15VGVzdDtcclxuICAgfVxyXG59KTtcclxuXHJcbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJDbG9uZVwiLFxyXG4gICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyhPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcy5teVRlc3QpID09PSB1VGVzdCk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2dldFRlc3RDb3VudCgpID09PSAwKTtcclxuICAgfVxyXG59KTtcclxuXHJcbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJMb2dnaW5nXCIsXHJcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuX2xvZ2dpbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy5teVRlc3QuZW5hYmxlTG9nZ2luZygpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9sb2dnaW5nKTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0Ll9sb2dnaW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy5teVRlc3QuZGlzYWJsZUxvZ2dpbmcoKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0aGlzLm15VGVzdC5fbG9nZ2luZywgZmFsc2UpO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuX3ZlcmJvc2UgPSBmYWxzZTtcclxuICAgICAgdGhpcy5teVRlc3QuZW5hYmxlVmVyYm9zZUxvZ2dpbmcoKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fdmVyYm9zZSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5fdmVyYm9zZSA9IHRydWU7XHJcbiAgICAgIHRoaXMubXlUZXN0LmRpc2FibGVWZXJib3NlTG9nZ2luZygpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKHRoaXMubXlUZXN0Ll92ZXJib3NlLCBmYWxzZSk7XHJcbiAgIH1cclxufSk7XHJcblxyXG51VGVzdC5URVNUKHsgZ3JvdXA6IFwiU2VsZlRlc3RzXCIsIG5hbWU6IFwiUGFzc2luZ0NoZWNrc1wiLFxyXG4gICBydW46IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIlBhc3NpbmdDaGVja3NHcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIlBhc3NpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIlRlc3RcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMHg4ZiwgMHg4Zik7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVFJVRSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19GQUxTRShmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVEVYVCgxID09PSAxLCBcIldoZW4gZG9lcyAxICE9PSAxP1wiKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5ET1VCTEVTX0VRVUFMKDIuMSwgMi4yLCAwLjEwMDAwMSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoMiwgMik7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuU1RSQ01QX0VRVUFMKFwib25lXCIsIFwib25lXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkNIRUNLX0xPT1NFX0VRVUFMKDEwMDAsIFwiMTAwMFwiKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XHJcblxyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLX0VRVUFMKDEsIHRoaXMubXlUZXN0Ll9nZXRUZXN0Q291bnQoKSk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMCwgdGhpcy5teVRlc3QuX2ZhaWxDb3VudCk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMSwgdGhpcy5teVRlc3QuX3J1bkNvdW50KTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgxMCwgdGhpcy5teVRlc3QuX2NoZWNrQ291bnQpO1xyXG4gICB9XHJcbn0pO1xyXG5cclxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkZhaWxpbmdDaGVja3NcIixcclxuICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJCWVRFU19FUVVBTFwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgweDhmLCAweDkwKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJDSEVDS1wiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDSyhmYWxzZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfVFJVRVwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19UUlVFKGZhbHNlKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJDSEVDS19GQUxTRVwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19GQUxTRSh0cnVlKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJDSEVDS19FUVVBTFwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfRVFVQUxfMlwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDS19FUVVBTCgyLCBcIjJcIik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiQ0hFQ0tfTE9PU0VfRVFVQUxcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfRVFVQUwoMiwgXCIzXCIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkNIRUNLX1RFWFRcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0tfVEVYVCgxID09PSAwLCBcIjEgc2hvdWxkIG5vdCBlcXVhbCAwXCIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkZhaWxpbmdDaGVja3NHcm91cFwiLCBuYW1lOiBcIkRPVUJMRVNfRVFVQUxcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuRE9VQkxFU19FUVVBTCgyLjEsIDIuMywgMC4xMDAwMSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoNSwgNik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiRmFpbGluZ0NoZWNrc0dyb3VwXCIsIG5hbWU6IFwiU1RSQ01QX0VRVUFMXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LlNUUkNNUF9FUVVBTChcIm9uZVwiLCBcInR3b1wiKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJGYWlsaW5nQ2hlY2tzR3JvdXBcIiwgbmFtZTogXCJGQUlMXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkZBSUwoXCJGYWlsIG1lIVwiKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1bkFsbFRlc3RzKCk7XHJcblxyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9nZXRUZXN0Q291bnQoKSA9PT0gMTIpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICAgICA9PT0gMTIpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICAgICA9PT0gMTIpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9jaGVja0NvdW50ICAgICA9PT0gMTIpO1xyXG4gICB9XHJcbn0pO1xyXG5cclxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkxPTkdTX0VRVUFMXCIsXHJcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJMT05HU19FUVVBTF9Hcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfUGFzc1wiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAxKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAxLjEpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0xLCAtMSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoLTEsIC0xLjEpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NQVhfVkFMVUUsIE51bWJlci5NQVhfVkFMVUUpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NSU5fVkFMVUUsIE51bWJlci5NSU5fVkFMVUUpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVF9HUk9VUCh7IG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzFcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoMSwgMik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiTE9OR1NfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkxPTkdTX0VRVUFMX0ZhaWxfMlwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5MT05HU19FUVVBTCgxLCAwLjEpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJMT05HU19FUVVBTF9GYWlsXzNcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuTE9OR1NfRVFVQUwoLTEsIC0yKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF80XCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKC0yLCAtMS4xKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJMT05HU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiTE9OR1NfRVFVQUxfRmFpbF81XCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkxPTkdTX0VRVUFMKE51bWJlci5NQVhfVkFMVUUsIE51bWJlci5NSU5fVkFMVUUpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3QoXCJMT05HU19FUVVBTF9QYXNzXCIpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSAwKTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LnJ1blRlc3RHcm91cChcIkxPTkdTX0VRVUFMX0ZhaWxfR3JvdXBcIik7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX3J1bkNvdW50ICAgID09PSA1KTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fZmFpbENvdW50ICAgPT09IDUpO1xyXG4gICB9XHJcbn0pO1xyXG5cclxudVRlc3QuVEVTVCh7IGdyb3VwOiBcIlNlbGZUZXN0c1wiLCBuYW1lOiBcIkJZVEVTX0VRVUFMXCIsXHJcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLm15VGVzdC5URVNUX0dST1VQKHsgbmFtZTogXCJCWVRFU19FUVVBTF9Hcm91cFwiIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfUGFzc1wiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgxLCAxKTtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgxLCAxLjEpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKC0xLCAtMSk7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoLTEsIC0xLjEpO1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDB4MUFBLCAweEFBKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1RfR1JPVVAoeyBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF8xXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKDEsIDIpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5teVRlc3QuVEVTVCh7IGdyb3VwOiBcIkJZVEVTX0VRVUFMX0ZhaWxfR3JvdXBcIiwgbmFtZTogXCJCWVRFU19FUVVBTF9GYWlsXzJcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQllURVNfRVFVQUwoMSwgMC4xKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1QoeyBncm91cDogXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIsIG5hbWU6IFwiQllURVNfRVFVQUxfRmFpbF8zXCIsXHJcbiAgICAgICAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVUZXN0LkJZVEVTX0VRVUFMKC0xLCAtMik7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5URVNUKHsgZ3JvdXA6IFwiQllURVNfRVFVQUxfRmFpbF9Hcm91cFwiLCBuYW1lOiBcIkJZVEVTX0VRVUFMX0ZhaWxfNFwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5CWVRFU19FUVVBTCgtMiwgLTEuMSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5ydW5UZXN0KFwiQllURVNfRVFVQUxfUGFzc1wiKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgPT09IDEpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5ydW5UZXN0R3JvdXAoXCJCWVRFU19FUVVBTF9GYWlsX0dyb3VwXCIpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gNCk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSA0KTtcclxuICAgfVxyXG59KTtcclxuXHJcbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJDSEVDS19UUkhPV1NcIixcclxuXHJcbiAgIHJ1bjogZnVuY3Rpb24gKCkge1xyXG4gICAgICB1VGVzdC5DSEVDS19USFJPVyhcIlJlZmVyZW5jZUVycm9yXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgY2FsbEFSYW5kb21Ob25FeGlzdGluZ0Z1bmN0aW9uKCk7XHJcbiAgICAgIH0pO1xyXG4gICB9XHJcblxyXG59KTtcclxuXHJcbnVUZXN0LlRFU1QoeyBncm91cDogXCJTZWxmVGVzdHNcIiwgbmFtZTogXCJVc2VUZXN0V2l0aG91dEdyb3VwXCIsXHJcblxyXG4gICBydW46IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LlRFU1Qoe25hbWU6IFwiVGVzdFdpdGhvdXRHcm91cFwiLFxyXG4gICAgICAgICBydW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy51VGVzdC5DSEVDSyh0cnVlKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMubXlUZXN0LklHTk9SRV9URVNUKHtuYW1lOiBcIklnbm9yZVRlc3RXaXRob3V0R3JvdXBcIixcclxuICAgICAgICAgcnVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodHJ1ZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5ydW5UZXN0KFwiVGVzdFdpdGhvdXRHcm91cFwiKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5fcnVuQ291bnQgICAgPT09IDEpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9mYWlsQ291bnQgICA9PT0gMCk7XHJcblxyXG4gICAgICB0aGlzLm15VGVzdC5ydW5BbGxUZXN0cygpO1xyXG4gICAgICB0aGlzLnVUZXN0LkNIRUNLKHRoaXMubXlUZXN0Ll9ydW5Db3VudCAgICA9PT0gMSk7XHJcbiAgICAgIHRoaXMudVRlc3QuQ0hFQ0sodGhpcy5teVRlc3QuX2ZhaWxDb3VudCAgID09PSAwKTtcclxuICAgICAgdGhpcy51VGVzdC5DSEVDSyh0aGlzLm15VGVzdC5faWdub3JlQ291bnQgPT09IDEpO1xyXG4gICB9XHJcblxyXG59KTtcclxuIl19
