import App from './App';
import React from 'react';
import userEvent from '@testing-library/user-event';
import 'regenerator-runtime/runtime';
import { within } from '@testing-library/dom';
import { cleanup, render, screen } from '@testing-library/react';
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

describe('Creator', () => {
    it('Tests some elements in meme creator.', () => {
        render(<MemeCreator />);
        expect(screen.getByText('Hello !')).toBeInTheDocument();
        expect(screen.getByText('Canvas Height')).toBeInTheDocument();
    });
});

describe('Templates', () => {
    it('Tests if all template options are available.', () => {
        const { getByTestId } = render(<ImageSelection />);
        userEvent.click(screen.getByText('I want more templates!'));
        const { getByText } = within(getByTestId('show-temp'));
        expect(getByText('Get Images form ImageFlip')).toBeInTheDocument();
        expect(getByText('Photo from camera')).toBeInTheDocument();
        expect(getByText('Get Image from URL')).toBeInTheDocument();
        expect(getByText('Draw your own')).toBeInTheDocument();
    });
});

/*
describe('Header', () => {
    it('Tests if Header gets shown', () => {
        render(<NavBar />);
        expect(screen.getByText('Good ol')).toBeInTheDocument();
    });
});*/
