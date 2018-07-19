package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
)

func main() {
	const defaultPort = 8081
	var port int
	flag.IntVar(&port, "port", defaultPort, "TCP port to listen")
	flag.Parse()

	pwd, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Serving HTTP on %d at %s", port, pwd)
	p := strconv.Itoa(port)
	log.Fatal(http.ListenAndServe(":"+p, http.FileServer(http.Dir(pwd))))
}
