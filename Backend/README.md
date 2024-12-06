
# Embedding Comparison API

This API provides a functionality to compare embeddings visually by generating plots and returning them as base64-encoded images. It uses FastAPI for the API framework and Matplotlib for plotting.

## Prerequisites

- Python 3.9 or above installed on your system.
- A terminal or command prompt with access to run Python commands.

## Setup

### 1. Clone the Repository

```bash
git clone <repository_url>
cd <repository_folder>
```

### 2. Install Dependencies

Use the following command to install the required dependencies:

```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables

The application requires environment variables to be set. Create a `.env` file in the project root with the following content:

```dotenv
# Example Environment Variables
cohere_api_key=YOUR_COHERE_API_KEY_HERE
```

Replace `YOUR_COHERE_API_KEY_HERE` with your actual API key for Cohere or any other required API.

Alternatively, you can set the environment variable directly in your terminal:

**For Linux/Mac:**

```bash
export cohere_api_key=YOUR_COHERE_API_KEY_HERE
```

**For Windows (Command Prompt):**

```cmd
set cohere_api_key=YOUR_COHERE_API_KEY_HERE
```

**For Windows (PowerShell):**

```powershell
$env:cohere_api_key="YOUR_COHERE_API_KEY_HERE"
```

### 4. Run the Application

Start the application with `uvicorn`:

```bash
uvicorn app.main:app --reload --port 8000
```

This will start the FastAPI server on port 8009. You can now access the API documentation at:

```
http://127.0.0.1:8000/docs
```

## Notes

- Ensure the environment variables are set properly before running the application.
- If you encounter errors with Matplotlib, ensure the backend is set to `Agg` as described in the code.

