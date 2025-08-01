// Vitor h. Lemes

package main

import (
	"log"
	"net/http"

	"agrisynth.com/api-gateway/internal/database"
	"agrisynth.com/api-gateway/internal/transport"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDatabase()

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "UP",
		})
	})

	apiV1 := router.Group("/api/v1")
	{
		projects := apiV1.Group("/projects")
		{
			// Rotas CRUD
			projects.POST("/", transport.CreateProject)
			projects.GET("/", transport.ListProjects)
			projects.GET("/:id", transport.GetProject)
			projects.PUT("/:id", transport.UpdateProject)
			projects.DELETE("/:id", transport.DeleteProject)

			// Rotas de Análise de IA
			projects.POST("/:id/upload-soil-report", transport.UploadSoilReport)
			projects.POST("/:id/upload-plot-image", transport.UploadPlotImage)
			projects.GET("/:id/soil-analyses", transport.ListSoilAnalysesForProject)
			projects.GET("/:id/image-analyses", transport.ListImageAnalysesForProject)
		}

		scenarios := apiV1.Group("/scenarios")
		{
			// Rota de Síntese de Cenários agora está ativa.
			scenarios.POST("/:projectId", transport.SynthesizeScenarios) // <-- LINHA MODIFICADA
			
			scenarios.GET("/:id", NotImplemented) // Rota para buscar um cenário salvo (futuro)
		}
	}

	log.Println("Iniciando o servidor na porta :8080...")
	err := router.Run(":8080")
	if err != nil {
		log.Fatalf("Não foi possível iniciar o servidor: %v", err)
	}
}

func NotImplemented(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"message": "Endpoint ainda não implementado.",
	})
}