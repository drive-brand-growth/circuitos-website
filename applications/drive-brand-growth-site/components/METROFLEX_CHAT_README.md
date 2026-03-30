# MetroFlex Events Chat Widget

A chat widget component for MetroFlex Events that connects to the MetroFlex AI agent backend.

## Features

- Red header with MetroFlex Events branding
- Dark-themed chat interface matching MetroFlex design
- Real-time conversation with MetroFlex AI assistant
- Error handling with fallback to contact information
- Responsive design with smooth animations

## Usage

### 1. Import the Component

```tsx
import MetroFlexChatWidget from '@/components/MetroFlexChatWidget';

export default function Page() {
  return (
    <div>
      {/* Your page content */}
      <MetroFlexChatWidget />
    </div>
  );
}
```

### 2. Add to Layout (Global)

To add the chat widget globally (like the Drive Brand Growth chat widget), update `app/layout.tsx`:

```tsx
import MetroFlexChatWidget from "@/components/MetroFlexChatWidget";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <MetroFlexChatWidget />
      </body>
    </html>
  );
}
```

### 3. Configure Backend URL

Set the environment variable for the MetroFlex AI agent backend URL:

**For local development:**
```bash
# .env.local
METROFLEX_AGENT_URL=http://localhost:5001
```

**For production:**
```bash
# .env.production
METROFLEX_AGENT_URL=https://your-metroflex-agent-backend.com
```

### 4. Start the MetroFlex AI Agent Backend

Make sure the MetroFlex AI agent backend is running:

```bash
cd agents
python metroflex_ai_agent.py
```

The backend should be running on `http://localhost:5001` (or your configured URL).

## API Endpoint

The chat widget calls `/api/metroflex/chat` which proxies requests to the MetroFlex AI agent backend.

**Request:**
```json
{
  "message": "I'm interested in competing at an NPC show",
  "conversationId": "metroflex-123456",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "response": "AI assistant response...",
  "timestamp": "2024-01-01T00:00:00",
  "conversationId": "metroflex-123456"
}
```

## Error Handling

If the backend is unavailable or returns an error, the widget will display:
> "I'm having trouble connecting. Please try again or contact brian@metroflexgym.com"

## Design

The widget matches the MetroFlex Events branding:
- **Header**: Red background (#DC2626) with white "MF" circle
- **AI Messages**: Dark gray bubbles (#1F2937)
- **User Messages**: Red bubbles (#DC2626)
- **Input Field**: Dark gray with red accent on focus

## Troubleshooting

1. **Connection errors**: Check that the MetroFlex AI agent backend is running and accessible
2. **CORS issues**: Ensure the backend has CORS enabled for your frontend domain
3. **Environment variables**: Verify `METROFLEX_AGENT_URL` is set correctly






