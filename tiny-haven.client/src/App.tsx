import './App.css';
import { MapDisplay } from './Components/GameRender/MapDisplay';
import { TestDataFetcher } from './Components/Tests/TestDataFetcher';

function App() {
    return (
        <div className="App">
            {/* <MapDisplay/> */}
            <TestDataFetcher/>
        </div>
    );
}

export default App;