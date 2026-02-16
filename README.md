# mLab Chatbot Agent

An intelligent AI-powered chatbot for mLab South Africa that helps users get information about mLab programs, applications, and services. Built with React, TypeScript, Express, and Google's Gemini AI.

## UX
- **Userflow**: https://www.figma.com/board/QzD1xteTqzTLyZp7mdFVeh/Untitled?node-id=0-1&t=UxWNovKZg5O6muEV-1 
- **Sitemap**: https://www.figma.com/board/5Z0uRfIECqEtcprBmpVM8l/mLab-Chatbot-Sitemap?node-id=0-1&t=6vZf44i6wFndR8yR-1
- **Figma Design**: https://www.figma.com/design/1OGtauBfLLAbIRaYQ7L27g/mLab-Assistant-Bot?node-id=0-1&p=f&t=wnVp4Uuy2hwIZ9WV-0

## 🚀 Features

- **AI-Powered Conversations**: Uses Google Gemini AI to provide intelligent, context-aware responses
- **Program Information**: Answers questions about mLab programs including CodeTribe Academy
- **Application Guidance**: Provides information about application requirements and processes
- **Smart Model Selection**: Automatically detects and uses the best available Gemini model for your API key
- **Rate Limit Handling**: Built-in retry logic with exponential backoff for API rate limits
- **Error Handling**: Graceful error handling with user-friendly messages
- **Message Logging**: Logs all conversations for monitoring and analysis

## 🛠️ Tech Stack

### Frontend
- **Hosted at** - https://mlab-chatbot-agent-web.onrender.com
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Hosted at** - https://mlab-chatbot-agent.onrender.com
- **Express.js** - REST API server
- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **Google Generative AI SDK** - AI integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

##Colaboartors
- **Musiki Sithomola
- **Thembelihle Maluka
- **Ashley Matsekoleng
- **Mondli Khoza


## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mLab-chatbot-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Ensure data file exists**
   
   Make sure `services/mlabData.json` exists with your mLab program data.

## 🏃 Running the Project

### Development Mode

1. **Start the backend server**
   ```bash
   npm run server
   ```
   The server will start on `http://localhost:3000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port Vite assigns)

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Preview the production build**
   ```bash
   npm run preview
   ```

## 📡 API Endpoints

### POST `/api/chat`

Send a chat message to the AI assistant.

**Request Body:**
```json
{
  "message": "What is CodeTribe?"
}
```

**Response:**
```json
{
  "reply": "CodeTribe Academy is a 6-month coding programme for youth..."
}
```

### POST `/api/category`

Handle category-based queries (placeholder endpoint).

**Request Body:**
```json
{
  "category": "programmes"
}
```

## 📁 Project Structure

```
mLab-chatbot-agent/
├── services/                 # Backend services
│   ├── app.ts               # Express server setup
│   ├── aiService.ts         # AI service with Gemini integration
│   ├── dataLoader.ts        # Loads mLab data JSON
│   ├── gemini.ts            # Gemini API utilities
│   ├── mlabData.json        # mLab program data
│   └── routes/
│       └── chatRoutes.ts    # API route handlers
├── src/                     # Frontend React app
│   ├── components/          # React components
│   │   ├── CategoryButton.tsx
│   │   └── MessageBubble.tsx
│   ├── containers/
│   │   └── ChatbotModal.tsx # Main chatbot UI
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── .env                     # Environment variables (create this)
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## 🤖 How It Works

1. **Model Detection**: On startup, the backend queries Google's API to list available models
2. **Smart Selection**: Prioritizes preferred models (gemini-2.5-flash, gemini-2.0-flash, etc.)
3. **Request Handling**: When a user sends a message:
   - The system loads mLab program data
   - Constructs a prompt with system instructions and user message
   - Sends to Gemini AI API
   - Returns the AI's response
4. **Error Handling**: If rate limits are hit, the system automatically retries with exponential backoff
5. **Logging**: All messages are logged to `chatlog.json` for monitoring

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run server` | Start backend Express server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🐛 Troubleshooting

### API Key Issues
- Ensure your `.env` file exists and contains `VITE_GEMINI_API_KEY`
- Verify your API key is valid and has quota available
- Check [Google AI Studio](https://ai.google.dev/) for API status

### Port Already in Use
- Backend runs on port 3000 by default
- Frontend runs on port 5173 by default (Vite)
- Change ports in `services/app.ts` (backend) or `vite.config.ts` (frontend)

### Model Not Found Errors
- The system automatically tries multiple models
- Check console logs to see which models are available
- Ensure your API key has access to Gemini models

### Rate Limit Errors
- The system includes automatic retry logic
- Wait a few moments and try again
- Check your quota at [Google AI Rate Limits](https://ai.dev/rate-limit)

## 📄 License

This project is private and proprietary to mLab South Africa.

## 👥 Contributing

This is a private project. For contributions or questions, please contact the mLab development team.

## 📞 Support

For issues or questions:
- Email: support@mlab.co.za
- Check the [Google Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

---

