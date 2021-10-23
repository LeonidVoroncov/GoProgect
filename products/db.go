package main

import (
	"database/sql"
	_ "github.com/lib/pq"
	"strings"
)

var Connection *sql.DB

func init() {
	var e error
	Connection, e = sql.Open("postgres",
		`host=localhost
						port=5432
						user=postgres
						password=master123!
						dbname=postgres
						sslmode=disable`)
	if Connection.Ping() != nil {
		panic("Не удалось подключиться к базе")
	}

	// Create database
	_, e = Connection.Exec(`CREATE DATABASE go_shop`)
	if e != nil {
		_ = Connection.Close()
		if strings.Contains(e.Error(), "база данных \"go_shop\" уже существует") {
			Connection, e = sql.Open("postgres",
				`host=localhost
						port=5432
						user=postgres
						password=master123!
						dbname=go_shop
						sslmode=disable`)
			if Connection.Ping() != nil {
				panic("Не удалось подключиться к базе")
			}

			_, _ = Connection.Exec(`create table product
(
    id          serial not null primary key,
    name        varchar not null,
    description varchar not null,
    image       varchar not null,
    price       double precision not null
)`)

			return
		}
		panic(e.Error())
	}
}
