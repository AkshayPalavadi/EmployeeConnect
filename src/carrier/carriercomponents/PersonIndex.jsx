import React from 'react';
import { createRoot } from 'react-dom/client';
import PersonApp from './PersonApp';
import './PersonIndex.css';
function PersonIndex(){
const root = createRoot(document.getElementById('root'));
root.render(<PersonApp />);
}
export default PersonIndex;