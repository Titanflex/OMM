import './css/Form.css';
import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";


export default class FormContainer extends Component {

    render() {
        return (
            <Container>
                <Form>
                    <Form.Group>
                        <Form.Control type="email" placeholder="Upper text" />
                        <Form.Control type="email" placeholder="Lower text" />
                    </Form.Group>
                </Form>
            </Container>
        );
    }
}