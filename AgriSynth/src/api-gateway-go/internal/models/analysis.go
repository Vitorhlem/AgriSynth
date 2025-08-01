// Vitor h. Lemes

package models

import (
	"time"

	"gorm.io/datatypes" // <-- NOVA IMPORTAÇÃO para o tipo JSON
)

// SoilAnalysis representa o resultado de uma única análise de laudo de solo
// que foi processada por um serviço de IA.
type SoilAnalysis struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	ProjectID string    `json:"project_id" gorm:"type:uuid;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`

	// Guarda a origem da análise, ex: "spaCy Matcher Extraction" ou "YOLOv8-seg".
	AnalysisSource string `json:"analysis_source"`

	// Armazena o resultado JSON completo retornado pelo serviço de IA.
	// O tipo JSONB do PostgreSQL é altamente eficiente para armazenar e consultar dados semi-estruturados.
	ResultData datatypes.JSON `json:"result_data" gorm:"type:jsonb"`

	// Define a relação de pertencimento. Uma Análise pertence a um Projeto.
	// O GORM usa esta tag para criar a chave estrangeira corretamente.
	Project Project `gorm:"foreignKey:ProjectID"`
}