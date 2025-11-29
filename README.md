# ConsulTEA – Plataforma Web (API + Front-end)

Este repositório contém a aplicação **ConsulTEA**, composta por:

- **API em C# (.NET)** localizada em `/API/ConsulTEA`
- **Front-end em React** localizado em `/Site/ConsulTEA-React`

O objetivo da aplicação é fornecer uma plataforma de auxílio a especialistas em TEA, para que possam gerenciar dados referentes a anamneses realizadas com pacientes. 
Além disso, o site permite que usuários cadastrados como adiministradores insiram informações, dados e gráficos na página sobre dados informativos.

---

## 📦 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

### 🔹 Node.js (para o front-end)
Baixe em:  
https://nodejs.org/

### 🔹 .NET SDK 8.0 ou superior (para a API)
Baixe em:  
https://dotnet.microsoft.com/download

### 🔹 Banco de dados

Precisa adicionar

Exemplo (SQL Server local):

# 🚀 Como Rodar o Projeto

## 1️⃣ Rodando a API (C# / .NET)

1. Abra um terminal na pasta:

```
API/ConsulTEA
```

2. Restaure as dependências:

```
dotnet restore
```

3. Rodar a API:

```
dotnet run
```

A API iniciará em:

```
https://localhost:5001
http://localhost:5000
```

---

## 2️⃣ Rodando o Front-end (React)

1. Abra um terminal na pasta:

```
Site/ConsulTEA-React
```

2. Instale as dependências:

```
npm install
```

3. Inicie o projeto:

```
npm start
```

A aplicação abrirá em:

```
http://localhost:3000
```

---

Se tiver qualquer dúvida sobre configuração, build ou execução, basta abrir uma issue no repositório.
