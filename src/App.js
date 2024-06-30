import React from 'react';
import Desktop from './components/Desktop';
import * as Heroicons from '@heroicons/react/24/solid';
import * as FramerMotion from 'framer-motion';


// Make dependencies globally available
window.React = React;
window.FramerMotion = FramerMotion;
window.HeroIcons = Heroicons;

function App() {
  return (
    <div className="App">
      <Desktop />
    </div>
  );
}

export default App;