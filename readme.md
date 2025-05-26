1.
go mod init github.com/yourname/todo-app

go get github.com/gofiber/fiber/v2
go get gorm.io/gorm
go get gorm.io/driver/sqlite

# Later for MySQL or PostgreSQL:
# go get gorm.io/driver/mysql
# go get gorm.io/driver/postgres