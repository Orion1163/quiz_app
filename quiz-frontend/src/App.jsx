import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Quiz from "./components/Quiz";

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/quiz" element={<Quiz/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;