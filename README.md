# AI-Powered Travel Planner with Cost Estimation

A smart travel planning application that generates personalized trip itineraries with AI-powered recommendations and cost breakdowns.

## Features

- **AI-Generated Travel Plans**: Get customized itineraries based on your preferences (e.g., mountains, beaches, cities).
- **Cost Estimation**: Detailed cost breakdowns for travel, food, and accommodation.
- **Recommended Plans**: AI suggests the best plan based on your input.
- **Interactive UI**: View, compare, and select travel plans with a clean, responsive interface.

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **AI Integration**: LangChain with Mistral AI
- **Validation**: Pydantic
- **Async Support**: Async/await with Uvicorn

## Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- npm or yarn
- Git

### Installation

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: `.venv\Scripts\activate`
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the `backend` directory:
```env
VITE_API_URL=http://localhost:8000  # Frontend only
```

For the backend, ensure required API keys (e.g., Mistral AI) are set in `.env`.

## Running the Project

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
uvicorn app.main:app --reload
```

## Usage

1. Open the frontend in your browser (e.g., `http://localhost:5174`).
2. Fill in your travel preferences (e.g., destinations, budget, days).
3. Click **Generate Plan** to receive AI-generated itineraries.
4. View, compare, and select plans.

## Project Structure

```
travel/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── App.jsx     # Main app logic
│   │   └── ...
│   └── ...
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py    # FastAPI app
│   │   └── ...
│   └── ...
└── README.md
```

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License.
