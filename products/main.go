package main

import (
	"errors"
	"fmt"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Desc  string  `json:"desc"`
	Image string  `json:"image"`
	Price float64 `json:"price"`
}

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("./*.html")
	router.Static("/assets", "./assets")

	router.Use(
		static.Serve("/img", static.LocalFile(ImageDir,
			false,
		)),
	)

	router.PUT("/upload", func(context *gin.Context) {
		e := imageUpload(context)
		if e != nil {
			context.JSON(400, e.Error())
			return
		}
		context.JSON(200, nil)
	})
	router.PUT("/product", func(context *gin.Context) {
		prod := Product{}
		e := context.BindJSON(&prod)
		if e != nil {
			fmt.Println(e)
			context.JSON(400, nil)
			return
		}
		e = prod.Insert()
		if e != nil {
			fmt.Println(e)
			context.JSON(400, nil)
			return
		}
		context.JSON(200, nil)
	})
	router.GET("/", func(context *gin.Context) {
		context.HTML(200, "index.html", nil)
	})
	router.GET("/product", func(context *gin.Context) {
		prod := Product{}
		products, e := prod.Select()
		if e != nil {
			fmt.Println(e)
			context.JSON(400, nil)
			return
		}
		context.JSON(200, products)
	})
	router.POST("/product", func(context *gin.Context) {
		p := Product{}
		e := context.BindJSON(&p)
		if e != nil {
			fmt.Println("ERROR:", e)
			context.JSON(415, "ошибка получения индентификатора слайда")
			return
		}
		e = p.Update()
		if e != nil {
			fmt.Println("ERROR:", e)
			context.JSON(500, "ошибка изменения слайда")
			return
		}
		context.JSON(200, nil);
	})
	router.DELETE("/product", func(context *gin.Context) {
		// Удалить слайд
		p := Product{}
		e := context.BindJSON(&p)
		if e != nil {
			fmt.Println("ERROR:", e)
			context.JSON(400, "ошибка получения индентификатора слайда")
			return
		}
		e = p.Delete()
		if e != nil {
			fmt.Println("ERROR:", e)
			context.JSON(400, "ошибка удаления слайда")
			return
		}
		context.JSON(200, nil);
	})
	_ = router.Run(":8080")
}

func (m *Product) Insert() error {
	_, e := Connection.Exec(`INSERT INTO product(name, description, image, price) VALUES($1, $2, $3, $4)`, m.Name, m.Desc, m.Image, m.Price)
	return e
}

func (m *Product) Select() ([]Product, error) {
	rows, e := Connection.Query(`SELECT id, name, description, image, price FROM product ORDER BY name`)
	if e != nil {
		return nil, e
	}
	products := make([]Product, 0)
	for rows.Next() {
		e = rows.Scan(
			&m.ID,
			&m.Name,
			&m.Desc,
			&m.Image,
			&m.Price,
		)
		if e != nil {
			return nil, e
		}

		products = append(products, Product{
			ID:    m.ID,
			Name:  m.Name,
			Desc:  m.Desc,
			Image: m.Image,
			Price: m.Price,
		})
	}
	return products, nil
}

func (m *Product) Delete() error {
	res, e := Connection.Exec(`DELETE FROM product WHERE id=$1`, m.ID)
	if e != nil {
		fmt.Println("ERROR:", e)
		return e
	}
	count, _ := res.RowsAffected()
	if count == 0 {
		return errors.New("ни одного слайда не было удалено")
	}
	return nil
}

func (m *Product) Update() error {
	res, e := Connection.Exec(`UPDATE product SET name=$1, desc=$2, image=$3 WHERE id=$4`, m.Name, m.Desc, m.Image, m.ID)
	if e != nil {
		fmt.Println("ERROR:", e)
		return e
	}
	count, _ := res.RowsAffected()
	if count == 0 {
		return errors.New("ни одного слайда не было обновлено")
	}
	return nil
}