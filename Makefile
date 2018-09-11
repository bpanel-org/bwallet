PATH := $(shell npm bin):$(PATH)
TLS_OUT := config/certs

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

ssl:
	@openssl req -newkey rsa:2048 \
		-nodes -sha512 -x509 -days 3650 -nodes \
		-subj '/CN=0.0.0.0' \
		-out $(TLS_OUT)/cert.pem -keyout $(TLS_OUT)/key.pem

.PHONY: all browserify webpack clean lint lint-fix test ssl
