
all: lint uTest-min.js

.PHONY: lint
lint:
	jshint uTest.js

uTest-min.js: uTest.js
	uglifyjs uTest.js -o uTest-min.js

.PHONY: clean
clean:
	rm -f uTest-min.js
