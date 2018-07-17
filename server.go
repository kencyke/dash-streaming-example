package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	var port string
	flag.StringVar(&port, "port", "8081", `TCP address to listen on, ":8081" if empty`)
	flag.Parse()

	pwd, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Serving HTTP on %s at %s", port, pwd)
	log.Fatal(http.ListenAndServe(":"+port, http.FileServer(http.Dir(pwd))))
}
