// Vitor h. Lemes

package database

import (
	"log"
	"os"

	"agrisynth.com/api-gateway/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error

	dsn := os.Getenv("DB_SOURCE")
	if dsn == "" {
		log.Fatal("Variável de ambiente DB_SOURCE não definida.")
	}

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Falha ao conectar ao banco de dados: %v", err)
	}

	log.Println("Conexão com o banco de dados estabelecida com sucesso.")

	log.Println("Executando migrações do banco de dados...")
	// Adicionamos o novo modelo Scenario à migração.
	err = DB.AutoMigrate(&models.Project{}, &models.SoilAnalysis{}, &models.ImageAnalysis{}, &models.Scenario{}) // <-- LINHA MODIFICADA
	if err != nil {
		log.Fatalf("Falha ao executar a migração: %v", err)
	}
	log.Println("Migrações do banco de dados concluídas.")
}