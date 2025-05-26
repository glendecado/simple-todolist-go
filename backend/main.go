package main

import (
	"github.com/glen/todo-app/backend/handlers"

	"github.com/glen/todo-app/backend/database"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()
	database.ConnectDatabase()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // or "http://localhost:5173" to restrict
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))

	app.Get("/todos", handlers.GetTodos)
	app.Post("/todos", handlers.CreateTodo)
	app.Put("/todos/:id", handlers.ToggleTodo)
	app.Delete("/todos/:id", handlers.DeleteTodo)

	app.Listen(":3000")
}
