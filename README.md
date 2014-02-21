# uTest.js

A unit test framework for JavaScript modeled after [cppUTest](http://cpputest.github.io).

The goal of this project is to help me gain experience programming 
JavaScript and hopefully make something useful too!

## Getting Started
### Define a Test
```javascript
// first-test.js

var uTest = require('./uTest.js');

uTest.TEST_GROUP({ name: "FirstGroup" });

uTest.TEST({ group: "FirstGroup", name: 'FirstTest',
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

### Run the Test in Node.js
```text
$ node test-runner.js
./first-test.js:9:18: error: Failure in TEST(FirstGroup, FirstTest)
	Fail me!

Errors (1 failure, 1 test, 1 ran, 1 check, 0 ignored, 0 filtered out, 36 ms)
```

### Run the Test in a Browser
```text
$ browserify test-runner.js -o bundle.js
```

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="./bundle.js"></script>
    </head>
    <body>
        <h1>My First Test!</h1>
    </body>
</html>
```

## Assertions
* **CHECK (condition)** - Check a boolean result
* **CHECK_TEXT (condition, text)** - Check a boolean result and print text on failure
* **CHECK_EQUAL (expected, actual)** - Check for equality between two entities using ===
* **CHECK_THROW (exception, func)** - Check for an exception thrown by calling a specified function
* **STRCMP_EQUAL (expected, actual)** - Check for equality using expected.toString() === actual.toString()
* **LONGS_EQUAL (expected, actual)** - Compare two integers
* **BYTES_EQUAL (expected, actual)** - Compare two 8-bit wide integers
* **DOUBLES_EQUAL (expected, actual, tolerance)** - Compare two numbers with a given tolerance

## Defining Tests and Test Groups
* **TEST_GROUP (group)** - Define a test group
    * The group parameter is an object with the following properites:
        * name {string} - The name of the group
        * setup {function} _(optional)_ - The setup function is run before each
				test in the group
        * teardown {function} _(optional)_ - The teardown function is run after
				each test in the group

* **TEST (test)** - Define a test
    * The test parameter is an object with the followig properties:
        * group {string} _(optional)_ - The name of the group in which the test belongs.
        * name {string} - The name of the test.
        * run {function} - The function that is run to perform the test.


* **IGNORE_TEST (test)** - Define a test that will be ignored.
    * This is a quick way to disable a test without removing the code.
    * See definition of test above
