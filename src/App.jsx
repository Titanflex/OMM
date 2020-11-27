import "./css/App.css";
import Container from "react-bootstrap/Container";
import MemeContainer from "./MemeContainer";
import FormContainer from "./FormContainer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function App() {

  return (
    <Container class="AppContainer">
      <h1>Best Meme Generator</h1>
      <Row>
        <Col><MemeContainer /></Col>
        <Col><FormContainer /></Col>
      </Row>
    </Container>
  );
}

export default App;
