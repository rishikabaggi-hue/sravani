# CircL Client

A modern, real-time chat application frontend built with React, Tailwind CSS, and Socket.IO.

## Features

- Real-time messaging with Socket.IO
- Public rooms and private direct messages
- Responsive UI with dark/light theme support
- Smooth animations with Framer Motion
- Role-based access control
- Message reactions and replies
- Typing indicators and online status
- Anonymous mode support

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will start at `http://localhost:3000`

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/context/` - Context providers for state management
- `src/hooks/` - Custom React hooks
- `src/pages/` - Page components
- `src/services/` - API and Socket.IO services
- `src/utils/` - Utility functions
- `src/styles/` - Global styles

## Dependencies

- **react** - UI library
- **axios** - HTTP client
- **socket.io-client** - Real-time communication
- **framer-motion** - Animations
- **tailwindcss** - CSS framework
- **lucide-react** - Icon library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
