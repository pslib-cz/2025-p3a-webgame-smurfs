import { Routes, Route } from "react-router-dom";
import './App.css';
import { MapDisplay } from './Pages/Game';
import { GameMenu } from './Pages/GameMenu';

function App() {
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
        e.preventDefault();
        }
        }, { passive: false });
        
        document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0' ||
        e.key === '=' || e.keyCode === 107 || e.keyCode === 109)) {
        e.preventDefault();
        }
    });

    return (
        <Routes>
            <Route path="/" element={ <GameMenu/> }/>
            <Route path="/play" element={<MapDisplay/> }/>
        </Routes>
    );
}

export default App;