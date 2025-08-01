// Vitor h. Lemes

package models

import (
	"time"

	"gorm.io/datatypes"
)

// ImageAnalysis representa o resultado de uma única análise de imagem de lavoura
// que foi processada pelo vision-service.
type ImageAnalysis struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	ProjectID string    `json:"project_id" gorm:"type:uuid;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`

	// Guarda a origem da análise, ex: "YOLOv8-seg Extraction".
	AnalysisSource string `json:"analysis_source"`

	// Armazena o resultado JSON completo retornado pelo vision-service.
	ResultData datatypes.JSON `json:"result_data" gorm:"type:jsonb"`

	// Define a relação de pertencimento para o GORM.
	Project Project `gorm:"foreignKey:ProjectID"`
}