SHELL := /bin/bash

define karma
	-@node ./node_modules/karma/bin/karma start $1
endef

default: test

test:
	-@node ./node_modules/coffee-script/bin/coffee -c test/*.coffee
	$(call karma, --single-run)

lint:
	-@node ./node_modules/jshint/bin/jshint src/*.js

.PHONY: test lint
