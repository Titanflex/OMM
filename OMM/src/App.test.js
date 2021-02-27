import App from './App';
import React from 'react';
import userEvent from '@testing-library/user-event';
import 'regenerator-runtime/runtime';
import { within } from '@testing-library/dom';
import { cleanup, render, screen } from '@testing-library/react';
import NavBar from './components/NavBar/NavBar';
import ImageSelection from './components/ImageSelection/ImageSelection';
import MemeCreator from './components/MemeCreator/MemeCreator';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('App', () => {
    it('renders App component', () => {
        render(<App />);
    });
});
/*
describe('Clear', () => {
    it('Tests if clear button works', () => {
        const { getByTestId } = render(<MemeCreator />);
        userEvent.click(screen.getByText('1'));
userEvent.click(screen.getByText('+'));
userEvent.click(screen.getByText('4'));
const { getByText } = within(getByTestId('term-text'));
expect(getByText('1+4')).toBeInTheDocument();
userEvent.click(screen.getByText('C'));
expect(getByText('')).toBeInTheDocument();
});
});

describe('Divide by Zero', () => {
it('Tests if divide by zero is possible.', () => {
const { getByTestId } = render(<ImageSelection />);
/* userEvent.click(screen.getByText('5'));
 userEvent.click(screen.getByText('/'));
 userEvent.click(screen.getByText('0'));
 const { getByText } = within(getByTestId('term-text'));
 expect(getByText('5/0')).toBeInTheDocument();
 userEvent.click(screen.getByText('='));
 expect(getByText('Infinity')).toBeInTheDocument();
 userEvent.click(screen.getByText('='));
 expect(getByText('Infinity')).toBeInTheDocument();
});
});

describe('Header', () => {
it('Tests if Header gets shown', () => {
render(<NavBar />);
expect(screen.getByText('Good ol')).toBeInTheDocument();
});
});*/
