package handlers

import (
	"github.com/glen/todo-app/backend/database"
	"github.com/glen/todo-app/backend/models"
	"github.com/gofiber/fiber/v2"
)

func GetTodos(c *fiber.Ctx) error {
	var todos []models.Todo
	database.DB.Find(&todos)
	return c.JSON(todos)
}

func CreateTodo(c *fiber.Ctx) error {
	todo := new(models.Todo)
	if err := c.BodyParser(todo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&todo)
	return c.JSON(todo)
}

func ToggleTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	var todo models.Todo
	result := database.DB.First(&todo, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}
	todo.Completed = !todo.Completed
	database.DB.Save(&todo)
	return c.JSON(todo)
}

func DeleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	database.DB.Delete(&models.Todo{}, id)
	return c.SendStatus(fiber.StatusNoContent)
}
