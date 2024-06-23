# macOS-Style React Desktop Environment

This project is an open-source macOS-style desktop environment built with React. It was initially created by Claude, an AI assistant, and is open for contributions from other Claude instances or developers who want to add new applications to the environment.

demo: https://mac-a-iverse.vercel.app/

## Project Overview

The desktop environment consists of several key components:

- `Desktop.js`: The main container for the entire desktop environment.
- `Window.js`: A reusable component for creating application windows.
- `appConfig.js`: Configuration file for all available applications.
- Individual application components (e.g., `WallpaperSetter.js`, `Notepad.js`, `Calendar.js`).

## Adding a New Application

To add a new application to the desktop environment, follow these steps:

1. Create a new React component for your application in a separate file (e.g., `MyNewApp.js`).
2. Design your application UI following macOS design guidelines (more on this below).
3. Add your application to the `appConfig.js` file.

### Creating the Application Component

When creating your application component, keep these points in mind:

- The component should accept at least one prop: `onClose`, which is a function to close the window.
- If your application needs to interact with the desktop environment (e.g., changing the wallpaper), additional props may be passed as needed.

Example structure for a new application component:

```jsx
import React from 'react';

const MyNewApp = ({ onClose }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Your app content here */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default MyNewApp;
```

### Adding the Application to appConfig.js

Once your application component is ready, add it to the `appConfig.js` file:

```javascript
import MyNewApp from './MyNewApp';

const appConfig = [
  // ... existing apps
  {
    name: 'My New App',
    icon: '🆕', // Choose an appropriate emoji or use a custom icon
    component: MyNewApp,
    defaultSize: { width: 600, height: 400 }
  },
];
```

## macOS Design Guidelines

When designing your application, it's crucial to follow macOS design principles to maintain consistency with the overall desktop environment. Here are some key points to consider:

1. **Color Scheme**: Use a light color scheme with subtle gradients. Stick to neutral colors for most UI elements, using vibrant colors sparingly for emphasis.

2. **Typography**: Use the San Francisco font or a similar sans-serif font. Font sizes should be readable, typically ranging from 13px to 16px for body text.

3. **Icons**: Use simple, outlined icons that are consistent with the macOS style. When possible, use SF Symbols or similar icon sets.

4. **Layout**: Employ a clean, organized layout with ample white space. Use a grid system for alignment and consistency.

5. **Components**: Utilize macOS-style UI components such as:
   - Rounded rectangle buttons with subtle shadows
   - Segmented controls for related options
   - Sheet-style dialogs for important actions
   - Sidebar navigation with a light background

6. **Animations**: Incorporate smooth, subtle animations for transitions and user interactions.

7. **Window Design**: 
   - Use a light title bar with close, minimize, and maximize buttons on the left
   - Implement proper window behaviors (resize, drag, focus)

8. **Contextual Menus**: Provide right-click context menus where appropriate.

9. **Accessibility**: Ensure your app is accessible, with proper contrast ratios and keyboard navigation support.

## Implementation Tips

- Use Tailwind CSS classes to style your components, as it's already set up in the project.
- Leverage the `framer-motion` library for smooth animations, following the example in existing components.
- Ensure your application is responsive within its window and handles different window sizes gracefully.
- Test your application thoroughly to ensure it doesn't conflict with existing desktop functionalities.

## Contribution Guidelines

1. Ensure your code is well-commented and follows the existing code style.
2. Test your application thoroughly before submitting.
3. Update this README if you add any new dependencies or require any additional setup steps.
4. Have fun and be creative, but always prioritize user experience and consistency with the macOS aesthetic!

By following these guidelines, you'll help maintain a cohesive and visually appealing desktop environment that stays true to the macOS design philosophy. Happy coding!