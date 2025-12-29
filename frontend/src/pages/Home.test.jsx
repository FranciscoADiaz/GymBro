import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('muestra Home page ready', () => {
    render(<Home />);
    expect(screen.getByText(/Home page ready/i)).toBeInTheDocument();
  });
});

