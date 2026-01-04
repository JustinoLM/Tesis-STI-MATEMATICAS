# Sistema de Tutoría Inteligente (STI)

Sistema adaptativo para enseñanza de matemáticas de 5to grado con enfoque en operaciones decimales.

## 🏗️ Arquitectura

Este proyecto utiliza una arquitectura **monorepo** con:

- **Backend**: FastAPI + PostgreSQL + SQLAlchemy
- **Frontend**: React + TypeScript + TailwindCSS
- **LLM**: Ollama + DeepSeek-R1:7B (local)
- **Deploy**: Railway (backend) + Vercel (frontend)

## 📁 Estructura del Proyecto
```
sti-proyecto/
├── backend/          # API REST con FastAPI
├── frontend/         # Interfaz React
├── docs/             # Documentación técnica
└── docker-compose.yml # PostgreSQL + Ollama local
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git

### Instalación

Ver instrucciones en:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## 📚 Documentación

- [Arquitectura del Sistema](docs/architecture/README.md)
- [API Documentation](docs/api/README.md)

## 📄 Licencia

Proyecto académico - Tesis de grado
