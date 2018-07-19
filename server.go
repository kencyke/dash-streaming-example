package main

import (
	"flag"
	"log"
	"net/http"
	"strconv"
)

func main() {
	const defaultPort = 8081
	var p int
	flag.IntVar(&p, "p", defaultPort, "TCP port to listen")

	const defaultDir = "./"
	var d string
	flag.StringVar(&d, "d", defaultDir, "Directory to serve")

	flag.Parse()

	log.Printf("HTTP serves %s on %d", d, p)
	port := strconv.Itoa(p)
	log.Fatal(http.ListenAndServe(":"+port, http.FileServer(http.Dir(d))))
}
