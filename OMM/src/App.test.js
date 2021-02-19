import App from './App';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom'
import { cleanup, render, screen } from '@testing-library/react';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

describe('App', () => {
    it('renders App component', () => {
        render(<App />);
    });
});