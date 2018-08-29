PATH := $(shell npm bin):$(PATH)

all:
	@npm run browserify

babel:
	@npm run babel

browserify:
	@npm run browserify

watch:
	@npm run watch

webpack:
	@npm run webpack

clean:
	@npm run clean

lint:
	@npm run lint

lint-fix:
	@npm run lint:fix

test:
	@npm test

.PHONY: all browserify webpack clean lint lint-fix test
