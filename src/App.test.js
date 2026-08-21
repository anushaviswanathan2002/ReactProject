import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders counter app with initial value of 0', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /counter/i })).toBeInTheDocument();
  expect(screen.getByText('0')).toBeInTheDocument();
});

test('increments, decrements, and resets the counter', () => {
  render(<App />);

  userEvent.click(screen.getByRole('button', { name: '+' }));
  userEvent.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getByText('2')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: '−' }));
  expect(screen.getByText('1')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /reset/i }));
  expect(screen.getByText('0')).toBeInTheDocument();
});