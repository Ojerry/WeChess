import './App.css';
import Chessgameui from './wechess/ui/chessgameui';

function App() {

  return (
    <div className="App">
      <h1>WeChess</h1>
      <div style={{display: "flex", justifyContent: 'center',}}>
        <Chessgameui color={true}/>
      </div>
      
    </div>
  );
}

export default App;
