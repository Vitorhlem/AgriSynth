// Vitor h. Lemes

package transport

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"agrisynth.com/api-gateway/internal/database"
	"agrisynth.com/api-gateway/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
	"gorm.io/gorm" // <-- NOVA IMPORTAÇÃO
)

// --- NOVA FUNÇÃO ABAIXO ---

// SynthesizeScenarios é o handler para a rota POST /scenarios/:projectId
// Ele orquestra a chamada ao scenario-synthesizer e salva os resultados.
func SynthesizeScenarios(c *gin.Context) {
	projectID := c.Param("projectId")

	// 1. Validar a requisição do cliente
	var clientRequest struct {
		Goals    map[string]interface{} `json:"goals"`
		PlotData map[string]interface{} `json:"plot_data"`
	}
	if err := c.ShouldBindJSON(&clientRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Corpo da requisição JSON inválido: " + err.Error()})
		return
	}

	// 2. Preparar e enviar a requisição para o serviço de IA
	synthesizerRequestBody, _ := json.Marshal(gin.H{
		"project_id": projectID,
		"goals":      clientRequest.Goals,
		"plot_data":  clientRequest.PlotData,
	})

	synthesizerServiceURL := os.Getenv("SYNTHESIZER_SERVICE_URL") + "/api/v1/synthesize"
	req, _ := http.NewRequest("POST", synthesizerServiceURL, bytes.NewBuffer(synthesizerRequestBody))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Serviço de Síntese de Cenários indisponível."})
		return
	}
	defer resp.Body.Close()

	// 3. Decodificar a resposta do serviço de IA
	responseBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		c.Data(resp.StatusCode, "application/json", responseBody)
		return
	}
	var synthesizerResponse struct {
		Scenarios []map[string]interface{} `json:"scenarios"`
	}
	json.Unmarshal(responseBody, &synthesizerResponse)

	// 4. Salvar os cenários recebidos no banco de dados DENTRO DE UMA TRANSAÇÃO
	err = database.DB.Transaction(func(tx *gorm.DB) error {
		for _, scenarioData := range synthesizerResponse.Scenarios {
			jsonData, err := json.Marshal(scenarioData)
			if err != nil {
				return err // Se a serialização falhar, a transação será revertida
			}
			scenarioRecord := models.Scenario{
				ProjectID:    projectID,
				ScenarioData: datatypes.JSON(jsonData),
			}
			if err := tx.Create(&scenarioRecord).Error; err != nil {
				return err // Se a criação falhar, a transação será revertida
			}
		}
		return nil // Se tudo correu bem, a transação é confirmada
	})

	if err != nil {
		log.Printf("Falha ao salvar cenários no banco de dados (transação revertida): %v", err)
		// Mesmo com erro no DB, retornamos o resultado da IA para o usuário.
	} else {
		log.Printf("Novos cenários para o projeto %s salvos com sucesso no banco de dados.", projectID)
	}

	// 5. Retornar a resposta original do serviço de IA para o cliente
	c.Data(resp.StatusCode, "application/json", responseBody)
}


// ... (handlers existentes: ListSoilAnalysesForProject, ListImageAnalysesForProject, UploadPlotImage, UploadSoilReport) ...