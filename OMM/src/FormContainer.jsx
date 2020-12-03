import "./css/Form.css";
import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";



export default class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caption1: "",
      caption2: "",
    };

  }


  render() {
    return (
      <Container>
        <Form>
          <Form.Group id='captionInput'>
            <Form.Control
              type="email"
              placeholder="Upper text"
              name="caption1"
              onChange={(event) => {
                this.props.onChangeCaption1(event.target.value)
              }}
            />
            <Form.Control
              type="email"
              placeholder="Lower text"
              name="caption2"
              onChange={(event) => {
                this.props.onChangeCaption2(event.target.value)
              }}
            />
          </Form.Group>
        </Form>
      </Container>
    );
  }
}
