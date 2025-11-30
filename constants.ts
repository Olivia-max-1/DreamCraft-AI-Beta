import { Template } from './types';

export const INITIAL_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen text-gray-600">
    <div class="text-center p-8">
        <div class="mb-4 text-6xl text-blue-500 animate-bounce">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Ready to Build?</h1>
        <p class="text-lg mb-6">Describe your app idea in the chat to get started.</p>
        <div class="inline-flex gap-2 text-sm text-gray-400">
            <span>Try: "A modern landing page for a coffee shop"</span>
        </div>
    </div>
</body>
</html>`;

export const TEMPLATES: Template[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'High-converting landing page with hero, features, and CTA.',
    icon: 'Layout',
    initialPrompt: 'Create a modern, responsive landing page for a SaaS product called "Flow". It should have a dark theme, a sticky navbar, a hero section with a gradient headline, a features grid with icons, social proof section, and a pricing table.',
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    description: 'Data-rich dashboard with charts and sidebar.',
    icon: 'BarChart',
    initialPrompt: 'Build a comprehensive admin dashboard layout. It needs a collapsible sidebar, a top header with user profile, and a main content area with 4 key metric cards (Users, Revenue, Bounce Rate, Active Sessions) and a placeholder for a large chart.',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Product listing with cart and filters.',
    icon: 'ShoppingBag',
    initialPrompt: 'Design a clean e-commerce product listing page. Include a filter sidebar on the left (Categories, Price Range), a grid of product cards with images, titles, prices, and "Add to Cart" buttons, and a responsive top navigation bar with a cart icon.',
  },
  {
    id: 'chat',
    name: 'Chat Application',
    description: 'Messaging interface with contact list.',
    icon: 'MessageSquare',
    initialPrompt: 'Create a chat application interface similar to WhatsApp Web or Discord. Split the screen: left side for a list of recent conversations with avatars and timestamps, right side for the active chat window with message bubbles and an input area at the bottom.',
  }
];