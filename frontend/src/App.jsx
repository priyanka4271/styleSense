import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuizContainer from './components/Quiz/QuizContainer';
import ResultsPage from './components/Results/ResultsPage';
import ColorGuide from './components/ColorGuide';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/quiz"        element={<QuizContainer />} />
        <Route path="/results"     element={<ResultsPage />} />
        <Route path="/color-guide" element={<ColorGuide />} />
      </Routes>
    </BrowserRouter>
  );
}
