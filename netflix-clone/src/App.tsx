import { requests } from "./request"
import { Row } from "./components/Row";

function App() {
  return (
    <div className="App">
      <Row fetchUrl={requests.fetchNetflixOriginals} />
    </div>
  )
}

export default App;