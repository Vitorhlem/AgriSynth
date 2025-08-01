// Generated go
// 2025
// Vitor (usuário) & Gemini
// AgriSynth
// 01/08/2025
//
// DESCRIÇÃO: Define a struct do modelo 'Project'.
// Esta struct é usada pelo ORM GORM para interações com o banco de dados
// e pelos handlers da API para serialização/deserialização JSON.

package models

import "time"

// Project representa um gêmeo digital de um talhão agrícola no sistema.
type Project struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	Name      string    `json:"name" gorm:"not null"`
	Location  string    `json:"location"`
	UserID    string    `json:"user_id" gorm:"not null"` // Futuramente, uma chave estrangeira para a tabela de usuários
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	// O campo Geom armazenará os polígonos geoespaciais do talhão.
	// O tipo 'geography' é específico do PostGIS para cálculos precisos de geolocalização.
	Geom      string    `json:"geom" gorm:"type:geography(Polygon, 4326);"` 
}