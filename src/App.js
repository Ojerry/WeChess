import './App.css';
import Chessgameui from './wechess/ui/chessgameui';
import Home from './pages/Home';
import ChooseName from './pages/ChooseName';
import Room from './pages/Room';


function App() {

  return (
    <div className="App">
      {/* <Home /> */}
      {/* <div style={{display: "flex", justifyContent: 'center',}}>
        <Chessgameui color={true}/>
      </div> */}
      {/* <ChooseName /> */}
      <Room />
      
      
    </div>
  );
}

export default App;
