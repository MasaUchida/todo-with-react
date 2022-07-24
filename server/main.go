package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
	Body  string `json:"body"`
}

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		//httpメソッドを飛ばすことが許されるアドレス
		AllowOrigins: "http://localhost:5173",
		//許されるメソッド　デフォはGET,POST,HEAD,PUT,DELETE,PATCHのはずだがなぜか書かされる
		AllowMethods: "Origin, Content-Type, Accept,GET,POST,HEAD,PUT,DELETE,PATCH",
	}))

	todos := []Todo{}

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("繋がってるでぇ")
	})

	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		err := c.BodyParser(todo)
		if err != nil {
			return err
		}

		todo.ID = len(todos) + 1
		todos = append(todos, *todo)

		return c.JSON(todos)
	})

	app.Patch("/api/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString("Incalid id")
		}

		for i, t := range todos {
			if t.ID == id {
				todos[i].Done = true
				break
			}
		}

		return c.JSON(todos)
	})

	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":7777")) //App.tsxのフェッチ先
}
