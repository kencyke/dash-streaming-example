DIR_BIN := ./bin

.PHONY: build
build:
	mkdir -p $(DIR_BIN)
	go build -o $(DIR_BIN)/server ./server/server.go