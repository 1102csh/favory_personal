// src/app/App.jsx
import { RouterProvider } from 'react-router-dom';
//import { router } from './router';
import { router } from '../app/router/index';

const App = () => <RouterProvider router={router} />;

export default App;
