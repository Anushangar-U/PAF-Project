import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the home hero and tickets navigation link', () => {
  render(<App />);
  expect(screen.getByText(/empower your/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /tickets/i })).toBeInTheDocument();
});
