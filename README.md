# Strategic AI Cost Advisor Manager

A powerful enterprise AI cost optimization platform that provides strategic advisory for AI deployments, focusing on cost efficiency, ROI analysis, and implementation planning.

## Features

- Enterprise AI cost optimization analysis
- AWS Bedrock model selection and pricing
- Cost-efficient MVP architecture design
- Detailed cost projections and ROI calculations
- Advanced optimization strategies
- C-suite level strategic advisory reports

## Tech Stack

- Node.js
- Express.js
- Vercel (Deployment)

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-cost-advisor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy

The project will automatically build and deploy on Vercel.

## API Endpoints

### POST /api/chat
Main endpoint for AI cost optimization analysis.

Request body:
```json
{
  "message": "Your message here",
  "context": {} // Optional context
}
```

Response:
```json
{
  "message": "AI response"
}
```

## Configuration

The server is configured with the following hardcoded values:
- Lyzr API Base URL
- Agent ID
- API Key
- User ID
- Session ID

## License

MIT 