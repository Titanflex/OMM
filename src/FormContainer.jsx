import './css/Form.css';
import React, {Component} from 'react';
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MemeContainer from "./MemeContainer";



export default class FormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caption1: '',
            caption2: '',
        };

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value});
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col><MemeContainer caption1 ={this.state.caption1} caption2={this.state.caption2}/></Col>
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Control type="email" placeholder="Upper text" name="caption1" onChange={this.handleChange}/>
                                <Form.Control type="email" placeholder="Lower text" name="caption2" onChange={this.handleChange}/>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>

        );
    }
}