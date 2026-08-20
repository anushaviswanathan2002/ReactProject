import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the counter with an initial value of 0', () => {
  render(<App />);
  expect(screen.getByText('Counter')).toBeInTheDocument();
  expect(screen.getByText('0')).toBeInTheDocument();
});

test('clicking + increments the counter', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  expect(screen.getByText('1')).toBeInTheDocument();
});

test('clicking − decrements the counter', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '−' }));
  expect(screen.getByText('-1')).toBeInTheDocument();
});

test('clicking Reset returns the counter to 0', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByText('0')).toBeInTheDocument();
});
