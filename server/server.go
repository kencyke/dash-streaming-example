package main

import (
	"flag"
	"log"
	"net/http"
	"strconv"
)

func main() {
	const defaultPort = 8080
	var p int
	flag.IntVar(&p, "p", defaultPort, "TCP port to listen")
	flag.Parse()

	log.Printf("HTTP serves on port %d", p)
	port := strconv.Itoa(p)
	log.Fatal(http.ListenAndServe(":"+port, http.FileServer(http.Dir("./server/data"))))
}
