package database

import (
	"log"

	"github.com/glen/todo-app/backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	DB, err = gorm.Open(sqlite.Open("todos.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	DB.AutoMigrate(&models.Todo{})
}

/* ✅ For MySQL later, change:

go
Copy
Edit
import "gorm.io/driver/mysql"
// ...
dsn := "user:password@tcp(127.0.0.1:3306)/dbname?parseTime=true"
DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{}) */
