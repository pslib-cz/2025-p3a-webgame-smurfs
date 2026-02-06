import { Routes, Route } from "react-router-dom";
import './App.css';
import { MapDisplay } from './Pages/Game';
import { GameMenu } from './Pages/GameMenu';

function App() {
    return (
        <Routes>
            <Route path="/" element={ <GameMenu/> }/>
            <Route path="/play" element={<MapDisplay/> }/>
        </Routes>
    );
}

export default App;