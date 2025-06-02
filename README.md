# AI Cost Advisor

A powerful enterprise AI cost optimization platform that provides strategic advisory for AI deployments, focusing on cost efficiency, ROI analysis, and implementation planning.

## Demo

Watch our demo video: [Strategic AI Cost Advisor Demo](https://www.youtube.com/watch?v=ehrixSj4Yzg)

## Features

- Enterprise AI cost optimization analysis
- ROI calculation and forecasting
- Implementation planning and recommendations
- Cost comparison across different AI solutions
- Customizable reporting and dashboards

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Chethan-4255/ai-cost-advisor.git
cd ai-cost-advisor
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your configuration:
```env
LYZR_AGENT_API_BASE_URL=your_api_base_url
LYZR_AGENT_ID=your_agent_id
LYZR_API_KEY=your_api_key
USER_ID=your_user_id
SESSION_ID=your_session_id
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment

The project is configured for deployment on Vercel. Simply push your changes to the repository, and Vercel will automatically build and deploy your application.

## API Documentation

### POST /api/chat
Main endpoint for AI cost optimization analysis.

Request body:
```json
{
  "message": "Your message here"
}
```

Response:
```json
{
  "message": "AI response"
}
```

## License

MIT 