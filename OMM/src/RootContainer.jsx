import "./css/Root.css";
import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MemeContainer from "./MemeContainer";
import FormContainer from "./FormContainer";

export default class RootContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caption1: "",
      caption2: "",
    };
  }

  render() {
    return (
      <Container class="AppContainer">
        <h1>Best Meme Generator</h1>
        <Row>
          <Col>
            <MemeContainer
              caption1={this.state.caption1}
              caption2={this.state.caption2}
            />
          </Col>
          <Col>
            <FormContainer
              onChangeCaption1={(caption1) =>
                this.setState({ caption1: caption1 })
              }
              onChangeCaption2={(caption2) =>
                this.setState({ caption2: caption2 })
              }
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
