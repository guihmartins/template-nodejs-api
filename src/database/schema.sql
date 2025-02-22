-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS template
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE template;

-- Criar a tabela users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- inserir um usuário
INSERT INTO users (name, email, password) VALUES ('Admin', 'admin@admin.com.br', '876s7d56d9');
INSERT INTO users (name, email, password) VALUES ('User 1', 'usuario1@usuario.com.br', '876s73ss');
INSERT INTO users (name, email, password) VALUES ('User 2', 'usuario2@usuario.com.br', 'sfd987asd6');

-- select dos usuários
select * from users;
