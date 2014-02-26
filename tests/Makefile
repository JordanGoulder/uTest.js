
all: release debug

release: lint self-test-app-min.js

debug: lint self-test-app-debug.js

.PHONY: lint
lint:
	jshint scripts/main.js scripts/tests.js

self-test-app-min.js: self-test-app.js
	uglifyjs scripts/self-test-app.js -o scripts/self-test-app-min.js

self-test-app-debug.js:
	browserify --debug scripts/main.js -o scripts/self-test-app-debug.js

self-test-app.js:
	browserify scripts/main.js -o scripts/self-test-app.js

.PHONY: clean
clean:
	rm -f scripts/self-test-app.js
	rm -f scripts/self-test-app-debug.js
	rm -f scripts/self-test-app-min.js
