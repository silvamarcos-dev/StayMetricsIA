# 🏨 Stay Metrics IA

> Sistema inteligente de gestão, análise e automação para operações de aluguel por temporada.

O **Stay Metrics IA** é uma plataforma proprietária desenvolvida para transformar dados operacionais de imóveis de aluguel por temporada em **informações úteis, relatórios inteligentes e automações**, centralizando também CRM, atendimento via WhatsApp, agenda, reconhecimento de voz e recursos de Inteligência Artificial.

O projeto é desenvolvido pela **Aurion System**, sob desenvolvimento de **Marcos Silva**, para uso exclusivo da **Aurion System** e da **Imobiliária Meta**.

---

# 🏢 Propriedade e Desenvolvimento

| Informação                       | Detalhe               |
| -------------------------------- | --------------------- |
| **Projeto**                      | Stay Metrics IA       |
| **Desenvolvedora**               | Aurion System         |
| **Desenvolvedor**                | Marcos Silva          |
| **Cliente / Usuário autorizado** | Imobiliária Meta      |
| **Tipo**                         | Software proprietário |
| **Ano**                          | 2026                  |

O Stay Metrics IA foi desenvolvido pela **Aurion System** especificamente para atender às necessidades operacionais da **Imobiliária Meta**.

O código-fonte, arquitetura, componentes, lógica de negócio, integrações, banco de dados, interfaces e demais elementos técnicos do sistema possuem caráter **proprietário e restrito**.

### 🔒 Uso exclusivo

Este projeto **não é open source**.

O Stay Metrics IA é destinado exclusivamente à:

* **Aurion System**
* **Imobiliária Meta**

Não é permitida, sem autorização expressa:

* cópia do código-fonte;
* redistribuição;
* comercialização por terceiros;
* sublicenciamento;
* publicação do código;
* utilização do sistema por terceiros;
* modificação para terceiros;
* hospedagem não autorizada;
* reutilização da arquitetura ou lógica de negócio em outros projetos;
* distribuição de componentes proprietários.

Qualquer utilização, reprodução, distribuição ou modificação por terceiros depende de **autorização expressa da Aurion System** e, quando aplicável, da **Imobiliária Meta**.

---

# 🎯 Objetivo

O Stay Metrics IA foi projetado para centralizar:

* 📊 Dados financeiros e operacionais
* 🏠 Informações de imóveis
* 📈 Indicadores de desempenho
* 📄 Geração automatizada de relatórios
* 👥 CRM e gerenciamento de contatos
* 💬 Atendimento via WhatsApp
* 🎙️ Reconhecimento e transcrição de voz
* 🤖 Inteligência Artificial
* 📅 Agenda e compromissos
* ⚙️ Automações

A proposta é transformar o fluxo:

```text
DADOS
  ↓
PROCESSAMENTO
  ↓
ANÁLISE
  ↓
RELATÓRIO
  ↓
DECISÃO
  ↓
AUTOMAÇÃO
```

---

# 🚀 Funcionalidades

## 📊 Relatórios Airbnb

O núcleo do Stay Metrics IA é o processamento de dados de operações de aluguel por temporada.

### Funcionalidades

* Importação de planilhas
* Processamento dos dados
* Análise de faturamento
* Análise de custos
* Análise de ocupação
* Organização dos resultados
* Geração de relatórios
* Exportação em PDF
* Organização dos relatórios em arquivos ZIP

### Fluxo

```text
Planilha
   ↓
Leitura dos dados
   ↓
Processamento
   ↓
Cálculos e indicadores
   ↓
Relatório
   ↓
PDF
   ↓
ZIP
```

---

# 👥 CRM

O sistema possui um módulo de CRM para centralizar informações de clientes e contatos.

### Funcionalidades

* Cadastro de contatos
* Listagem de contatos
* Busca por ID
* Atualização de contatos
* Exclusão de contatos
* Organização das informações
* Integração com os demais módulos

O CRM poderá ser utilizado pela IA, WhatsApp e Agenda.

---

# 💬 WhatsApp

O Stay Metrics IA possui uma central de atendimento integrada ao WhatsApp.

### Funcionalidades implementadas

* Conexão da instância WhatsApp
* QR Code para autenticação
* Verificação do status da conexão
* Listagem de conversas
* Listagem de mensagens
* Envio de mensagens
* Envio de arquivos
* Envio de áudio
* Interface de atendimento
* Indicador de conexão
* Reprodução de áudios recebidos

### Fluxo de conexão

```text
Stay Metrics IA
       ↓
Solicita conexão
       ↓
Servidor WhatsApp
       ↓
QR Code
       ↓
Usuário escaneia
       ↓
WhatsApp conectado
```

---

# 🎙️ Reconhecimento de Voz

O sistema possui suporte para entrada de informações através de voz.

A arquitetura utiliza processamento de áudio para transformar fala em texto.

### Fluxo

```text
🎙️ Voz
 ↓
Captura de áudio
 ↓
Processamento
 ↓
Transcrição
 ↓
Texto
 ↓
IA / Sistema
```

O reconhecimento de voz poderá ser utilizado como uma das interfaces de interação com a **Lyra**.

---

# 🤖 Lyra — Inteligência Artificial

A **Lyra** é a camada de Inteligência Artificial do ecossistema Stay Metrics IA.

Sua função é interpretar comandos em linguagem natural e utilizar os recursos disponíveis no sistema.

### Exemplos

```text
"Crie um compromisso amanhã às 15h."

"Mostre os dados deste imóvel."

"Envie o relatório para o cliente."

"Qual foi o faturamento deste mês?"
```

A proposta é permitir que o usuário interaja com o sistema sem precisar conhecer os detalhes técnicos de cada módulo.

---

# 📅 Agenda

O módulo de Agenda será responsável pelo gerenciamento de compromissos e eventos.

### Funcionalidades previstas para a v1.0

* Criação de compromissos
* Listagem de compromissos
* Visualização por período
* Atualização
* Exclusão
* Controle de horário
* Validação de conflitos
* Integração com calendário
* Integração com a Lyra

A Agenda também poderá ser controlada pela Lyra através de comandos em linguagem natural.

---

# ⚙️ Automações

O Stay Metrics IA possui como objetivo automatizar tarefas repetitivas do fluxo operacional.

Entre as automações previstas estão:

* Processamento de dados
* Geração de relatórios
* Organização de arquivos
* Comunicação com clientes
* Integração entre CRM e WhatsApp
* Integração entre Agenda e IA
* Processamento de tarefas em background
* Execução automática de processos

---

# 🏗️ Arquitetura

A aplicação segue uma arquitetura baseada na separação entre frontend, backend, serviços, persistência e integrações externas.

```text
                    ┌─────────────────────┐
                    │   Stay Metrics IA   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
        ┌───────────────┐             ┌───────────────┐
        │    Frontend   │             │    Backend    │
        │ React + TS    │────────────▶│    FastAPI    │
        └───────────────┘             └───────┬───────┘
                                              │
                         ┌────────────────────┼───────────────────┐
                         │                    │                   │
                         ▼                    ▼                   ▼
                   PostgreSQL              Redis              Serviços
                   SQLAlchemy              Celery                 │
                                                                  │
                                      ┌───────────────────────────┼─────────────┐
                                      │                           │             │
                                      ▼                           ▼             ▼
                                   WhatsApp                    OpenAI       Google
                                   / Evolution                    IA        Calendar
```

---

# 🧰 Stack Tecnológica

## Backend

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **Alembic**
* **Pydantic**
* **PostgreSQL**
* **Uvicorn**
* **Celery**
* **Redis**
* **JWT**
* **Argon2**

## Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**

## Inteligência Artificial

* **OpenAI API**
* **Whisper** para reconhecimento e transcrição de voz

## Comunicação

* **Evolution API**
* **WhatsApp**
* **WhatsApp Business / Cloud API** em integrações oficiais previstas

## Infraestrutura

* **Docker**
* **Docker Compose**
* **Nginx**
* **Linux**
* **Git**
* **GitHub**

## Deploy / Cloud

* **AWS**
* **Vercel**
* **Render**
* **Cloudflare**

---

# 🗄️ Banco de Dados

O banco principal utilizado pelo sistema é o **PostgreSQL**.

A aplicação utiliza **SQLAlchemy** como ORM e **Alembic** para gerenciamento de migrations.

A arquitetura de persistência segue:

```text
FastAPI
   ↓
Service
   ↓
Repository
   ↓
SQLAlchemy
   ↓
PostgreSQL
```

---

# 🔐 Segurança

O sistema utiliza mecanismos de segurança para autenticação e proteção de credenciais.

### Tecnologias e práticas

* JWT para autenticação
* Argon2 para hashing de senhas
* Variáveis de ambiente para credenciais
* Separação entre configuração e código
* Controle de acesso às APIs
* Estrutura modular de autenticação e autorização

---

# 📁 Organização da aplicação

A arquitetura segue uma separação por responsabilidades.

```text
app/
├── models/
├── schemas/
├── repositories/
├── services/
├── routes/
├── core/
├── database/
└── main.py
```

### Responsabilidades

**Models**

Representação das entidades persistidas no banco.

**Schemas**

Validação e estrutura dos dados recebidos e enviados pela API.

**Repositories**

Responsáveis pelo acesso aos dados.

**Services**

Responsáveis pelas regras de negócio.

**Routes**

Responsáveis pelos endpoints HTTP.

**Core**

Configurações e componentes centrais da aplicação.

---

# 🔌 API

A comunicação entre frontend e backend ocorre através de uma API REST.

Exemplos de módulos:

```text
/auth
/contatos
/whatsapp
/agenda
/lyra
/reminders
/calendar
```

A API é construída utilizando **FastAPI**.

---

# 📱 Interface de Atendimento

A interface de atendimento permite:

* visualizar conversas;
* selecionar uma conversa;
* visualizar mensagens;
* enviar mensagens;
* enviar arquivos;
* gravar áudio;
* enviar áudio;
* acompanhar o estado da conexão do WhatsApp;
* autenticar uma instância através de QR Code.

---

# 📦 Versão 1.0

A versão 1.0 tem como objetivo entregar uma base funcional e integrada do ecossistema Stay Metrics IA.

## 📊 Relatórios

* [ ] Importação de dados
* [ ] Processamento de planilhas
* [ ] Indicadores financeiros
* [ ] Indicadores de ocupação
* [ ] Geração de relatório
* [ ] Exportação PDF
* [ ] Geração de ZIP

## 👥 CRM

* [ ] Estrutura inicial de contatos
* [ ] Criar contato
* [ ] Listar contatos
* [ ] Buscar contato
* [ ] Atualizar contato
* [ ] Deletar contato
* [ ] Interface completa do CRM

## 💬 WhatsApp

* [x] Conexão da instância
* [x] QR Code
* [x] Status da conexão
* [x] Conversas
* [x] Mensagens
* [x] Envio de mensagens
* [x] Envio de arquivos
* [x] Envio de áudio
* [x] Interface de atendimento

## 🎙️ Voz

* [ ] Captura de áudio
* [ ] Processamento de áudio
* [ ] Transcrição
* [ ] Integração com comandos da IA

## 🤖 Lyra

* [ ] Chat inteligente
* [ ] Interpretação de comandos
* [ ] Integração com Agenda
* [ ] Integração com CRM
* [ ] Integração com WhatsApp
* [ ] Automação de tarefas

## 📅 Agenda

* [ ] CRUD de compromissos
* [ ] Visualização de agenda
* [ ] Validação de conflitos
* [ ] Integração com calendário
* [ ] Integração com Lyra

## ⚙️ Automação

* [ ] Processamento automático
* [ ] Geração automática de relatórios
* [ ] Tarefas em background
* [ ] Integrações entre módulos
* [ ] Automações de comunicação

---

# 🛣️ Roadmap

## v0.x — Fundação

* Arquitetura do backend
* Banco de dados
* API
* Frontend
* Autenticação
* Estrutura de módulos
* Integração inicial com WhatsApp

## v1.0 — Produto inicial

```text
CRM
 +
Relatórios
 +
WhatsApp
 +
Agenda
 +
Voz
 +
IA
 +
Automações
```

O objetivo da v1.0 é transformar esses módulos em um **ecossistema integrado e funcional**.

## Pós-v1.0

Possíveis evoluções:

* dashboards avançados;
* análise preditiva;
* métricas avançadas;
* automações mais complexas;
* maior integração com plataformas de aluguel;
* inteligência comercial;
* notificações inteligentes;
* expansão da IA;
* aplicativos mobile;
* novos canais de atendimento.

---

# 🎯 Visão do Produto

O Stay Metrics IA busca evoluir de um sistema de geração de relatórios para uma plataforma inteligente capaz de participar ativamente da operação.

```text
                 ┌───────────────┐
                 │      DADOS    │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │    MÉTRICAS   │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │   RELATÓRIOS  │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │      IA       │
                 └───────┬───────┘
                         ↓
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       WhatsApp        Agenda          CRM
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                  ⚙️ AUTOMAÇÃO
```

---

# 📌 Status do Projeto

**Stay Metrics IA — v1.0**

🚧 **Em desenvolvimento**

O projeto está sendo desenvolvido de forma modular, priorizando:

* separação de responsabilidades;
* escalabilidade;
* segurança;
* manutenção;
* integração entre módulos;
* automação de processos;
* utilização de Inteligência Artificial.

---

# 👨‍💻 Desenvolvimento

O **Stay Metrics IA** é um projeto desenvolvido pela **Aurion System**, tendo **Marcos Silva** como desenvolvedor responsável.

O sistema foi desenvolvido para a **Imobiliária Meta**, sendo destinado às necessidades específicas da operação de aluguel por temporada.

### Responsáveis

**Aurion System**
Desenvolvimento, arquitetura e propriedade do software.

**Marcos Silva**
Desenvolvimento e implementação do sistema.

**Imobiliária Meta**
Cliente e usuário autorizado do sistema.

---

# 📄 Licença e Direitos Autorais

**Software proprietário — todos os direitos reservados.**

© 2026 **Aurion System — Stay Metrics IA**

**Desenvolvido por Marcos Silva.**

**Uso exclusivo da Aurion System e da Imobiliária Meta.**

Este repositório e seu conteúdo não devem ser copiados, distribuídos, comercializados, sublicenciados ou utilizados fora das condições autorizadas pelos responsáveis pelo projeto.
