
all: lint

min: ./src/uTest-min.js

.PHONY: lint
lint:
	jshint ./src/uTest.js

./src/uTest-min.js: ./src/uTest.js
	uglifyjs ./src/uTest.js -o ./src/uTest-min.js

.PHONY: doc
doc:
	rm -rf doc
	jsdoc -d doc ./src/uTest.js README.md

.PHONY: clean
clean:
	rm -f ./src/uTest-min.js
