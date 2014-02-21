# uTest.js

A unit test framework for JavaScript modeled after [cppUTest](http://cpputest.github.io).

The goal of this project is to help me gain experience programming 
JavaScript and hopefully make something useful too!

## Getting Started
### Define a Test
```javascript
// first-test.js

var uTest = require('./uTest.js');

uTest.TEST({ name: 'FirstTest',
   run: function() {
      this.uTest.FAIL("Fail me!");
   }
});
```

### Create a Test Runner
```javascript
// test-runner.js

require('./first-test.js');
var uTest = require('./uTest.js');

uTest.runAllTests();
```

### Run the Test
```text
$ node test-runner.js
./first-test.js:6:18: error: Failure in TEST(FirstTest)
	Fail me!

Errors (1 failure, 1 test, 1 ran, 1 check, 0 ignored, 0 filtered out, 14 ms)
```

## Assertions
* CHECK (condition) - Check a boolean result
* CHECK_TEXT (condition, text) - Check a boolean result and print text on failure
* CHECK_EQUAL (expected, actual) - Check for equality between two entities using ===
* CHECK_THROW (exception, func) - Check for an exception thrown by calling a specified function
* STRCMP_EQUAL (expected, actual) - Check for equality using expected.toString() === actual.toString()
* LONGS_EQUAL (expected, actual) - Compare two integers
* BYTES_EQUAL (expected, actual) - Compare two 8-bit wide integers
* DOUBLES_EQUAL (expected, actual, tolerance) - Compare two numbers with a given tolerance

## Defining Tests and Test Groups
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## Setup and Teardown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## More Info
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
