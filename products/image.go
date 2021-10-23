package main

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"os"
)

const ImageDir = "./images/"

func imageUpload(c *gin.Context) error {
	form, e := c.MultipartForm()
	if e != nil {
		fmt.Println("ERROR:", e)
		return errors.New("нет данных файла(ов)")
	}

	_, e = os.Stat(ImageDir)
	if os.IsNotExist(e) {
		e = os.MkdirAll(ImageDir, 0755)
		if e != nil {
			fmt.Println("ERROR:", e)
			return errors.New("не удалось создать директорию для изображений")
		}
	}

	files, ok := form.File["Image"]
	if !ok {
		return errors.New("нет данных файла(ов)")
	}

	for _, file := range files {
		if e = c.SaveUploadedFile(file, ImageDir + file.Filename); e != nil {
			fmt.Println("ERROR:", e)
			return errors.New("не удалось загрузить изображение " + file.Filename)
		}
	}

	return nil
}
