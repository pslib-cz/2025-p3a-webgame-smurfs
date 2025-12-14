import './App.css';
import { TestDataFetcher } from "./Components/TestDataFetcher";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>My Game Editor</h1>
            </header>
            
            <main>
                <TestDataFetcher />
            </main>
        </div>
    );
}

export default App;