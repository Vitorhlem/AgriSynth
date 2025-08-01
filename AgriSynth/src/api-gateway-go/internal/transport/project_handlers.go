// Vitor h. Lemes

package transport

import (
	"errors"
	"net/http"

	"agrisynth.com/api-gateway/internal/database"
	"agrisynth.com/api-gateway/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ListProjects é o handler para a rota GET /api/v1/projects.
func ListProjects(c *gin.Context) {
	var projects []models.Project
	result := database.DB.Find(&projects)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao listar os projetos."})
		return
	}
	c.JSON(http.StatusOK, projects)
}

// CreateProject é o handler para a rota POST /api/v1/projects.
func CreateProject(c *gin.Context) {
	var project models.Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido ou dados incompletos: " + err.Error()})
		return
	}
	result := database.DB.Create(&project)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao criar o projeto no banco de dados."})
		return
	}
	c.JSON(http.StatusCreated, project)
}

// GetProject é o handler para a rota GET /api/v1/projects/:id.
func GetProject(c *gin.Context) {
	var project models.Project
	id := c.Param("id")
	result := database.DB.First(&project, "id = ?", id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Projeto não encontrado."})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao buscar o projeto no banco de dados."})
		return
	}
	c.JSON(http.StatusOK, project)
}

// UpdateProject é o handler para a rota PUT /api/v1/projects/:id.
func UpdateProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	if err := database.DB.First(&project, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Projeto não encontrado para atualização."})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar projeto para atualização."})
		return
	}
	var updateData models.Project
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido ou dados incompletos: " + err.Error()})
		return
	}
	result := database.DB.Model(&project).Updates(updateData)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao atualizar o projeto."})
		return
	}
	c.JSON(http.StatusOK, project)
}

// DeleteProject é o handler para a rota DELETE /api/v1/projects/:id.
func DeleteProject(c *gin.Context) {
	id := c.Param("id")
	result := database.DB.Delete(&models.Project{}, "id = ?", id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao deletar o projeto."})
		return
	}
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Projeto não encontrado para exclusão."})
		return
	}
	c.Status(http.StatusNoContent)
}