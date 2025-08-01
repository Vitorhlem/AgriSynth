// Vitor h. Lemes

package models

import (
	"time"

	"gorm.io/datatypes"
)

// Scenario representa um único cenário de cultivo gerado pela IA,
// incluindo seu plano e os resultados da simulação preditiva.
type Scenario struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	ProjectID string    `json:"project_id" gorm:"type:uuid;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`

	// Armazena o objeto JSON completo do cenário, contendo o plano,
	// a justificativa e os resultados da simulação.
	ScenarioData datatypes.JSON `json:"scenario_data" gorm:"type:jsonb"`

	// Define a relação de pertencimento para o GORM.
	Project Project `gorm:"foreignKey:ProjectID"`
}