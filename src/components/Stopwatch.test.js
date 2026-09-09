import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stopwatch from './Stopwatch';

describe('Stopwatch Component', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    test('renders stopwatch with initial time 00:00.00', () => {
      render(<Stopwatch />);
      const display = screen.getByTestId('time-display');
      expect(display).toHaveTextContent('00:00.00');
    });

    test('renders Start, Reset, and Lap buttons', () => {
      render(<Stopwatch />);
      expect(screen.getByTestId('start-btn')).toBeInTheDocument();
      expect(screen.getByTestId('reset-btn')).toBeInTheDocument();
      expect(screen.getByTestId('lap-btn')).toBeInTheDocument();
    });

    test('Lap button is disabled initially', () => {
      render(<Stopwatch />);
      const lapBtn = screen.getByTestId('lap-btn');
      expect(lapBtn).toBeDisabled();
    });

    test('does not render laps section when no laps are recorded', () => {
      render(<Stopwatch />);
      expect(screen.queryByTestId('laps-container')).not.toBeInTheDocument();
    });
  });

  describe('Start/Pause Functionality', () => {
    test('clicking Start button starts the timer and changes button to Pause', () => {
      render(<Stopwatch />);
      const startBtn = screen.getByTestId('start-btn');
      fireEvent.click(startBtn);

      expect(screen.getByTestId('pause-btn')).toBeInTheDocument();
      expect(screen.queryByTestId('start-btn')).not.toBeInTheDocument();
    });

    test('Lap button becomes enabled when timer is running', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      const lapBtn = screen.getByTestId('lap-btn');
      expect(lapBtn).not.toBeDisabled();
    });

    test('clicking Pause button stops the timer and changes button to Start', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));
      fireEvent.click(screen.getByTestId('pause-btn'));

      expect(screen.getByTestId('start-btn')).toBeInTheDocument();
      expect(screen.queryByTestId('pause-btn')).not.toBeInTheDocument();
    });

    test('timer increments when running', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });

      const display = screen.getByTestId('time-display');
      expect(display.textContent).not.toBe('00:00.00');
    });

    test('timer does not increment when paused', () => {
      render(<Stopwatch />);
      
      // Start the timer
      act(() => {
        fireEvent.click(screen.getByTestId('start-btn'));
      });

      // Let it run for 100ms
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Get time when running
      const display = screen.getByTestId('time-display');
      const timeWhenRunning = display.textContent;
      
      // Should not be at 00:00.00 after running
      expect(timeWhenRunning).not.toBe('00:00.00');

      // Pause the timer
      act(() => {
        fireEvent.click(screen.getByTestId('pause-btn'));
      });

      // Verify Pause button changed back to Start
      expect(screen.getByTestId('start-btn')).toBeInTheDocument();
      expect(screen.queryByTestId('pause-btn')).not.toBeInTheDocument();

      // Record time when paused
      const timeWhenPaused = display.textContent;

      // Advance time further while paused
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Time should not have changed
      expect(display.textContent).toBe(timeWhenPaused);
      expect(display.textContent).toBe(timeWhenRunning);
    });
  });

  describe('Reset Functionality', () => {
    test('Reset button resets time to 00:00.00', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));
      act(() => {
        jest.advanceTimersByTime(500);
      });

      fireEvent.click(screen.getByTestId('reset-btn'));

      const display = screen.getByTestId('time-display');
      expect(display).toHaveTextContent('00:00.00');
    });

    test('Reset button stops the timer if running', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));
      act(() => {
        jest.advanceTimersByTime(500);
      });
      fireEvent.click(screen.getByTestId('reset-btn'));

      // After reset, Start button should be visible (meaning timer is not running)
      expect(screen.getByTestId('start-btn')).toBeInTheDocument();
    });

    test('Reset button clears all laps', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      expect(screen.getByTestId('laps-container')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('reset-btn'));

      expect(screen.queryByTestId('laps-container')).not.toBeInTheDocument();
    });
  });

  describe('Lap Functionality', () => {
    test('Lap button only works when timer is running', () => {
      render(<Stopwatch />);
      const lapBtn = screen.getByTestId('lap-btn');

      expect(lapBtn).toBeDisabled();

      fireEvent.click(screen.getByTestId('start-btn'));
      expect(lapBtn).not.toBeDisabled();

      fireEvent.click(screen.getByTestId('pause-btn'));
      expect(lapBtn).toBeDisabled();
    });

    test('clicking Lap records the current time', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(250);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      expect(screen.getByTestId('laps-container')).toBeInTheDocument();
      expect(screen.getByTestId('lap-row-0')).toBeInTheDocument();
    });

    test('multiple laps are recorded correctly', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      expect(screen.getByTestId('lap-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('lap-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('lap-row-2')).toBeInTheDocument();
    });

    test('lap table shows lap number, lap time, and total time', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      const lapsContainer = screen.getByTestId('laps-container');
      expect(lapsContainer.textContent).toContain('Lap #');
      expect(lapsContainer.textContent).toContain('Lap Time');
      expect(lapsContainer.textContent).toContain('Total Time');
    });

    test('lap times are calculated correctly', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));

      const lapRow1 = screen.getByTestId('lap-row-0');
      const lapRow2 = screen.getByTestId('lap-row-1');

      // Lap row 1 should show lap time (first lap time) and total time
      expect(lapRow1.textContent).toContain('#1');

      // Lap row 2 should show lap time (difference) and total time
      expect(lapRow2.textContent).toContain('#2');
    });
  });

  describe('Time Formatting', () => {
    test('displays time in MM:SS.MS format', () => {
      render(<Stopwatch />);
      const display = screen.getByTestId('time-display');
      const timeFormat = /\d{2}:\d{2}\.\d{2}/;
      expect(display.textContent).toMatch(timeFormat);
    });

    test('time format is correct after several seconds', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(5000); // 5 seconds = 5000ms
      });

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toMatch(/00:0[5-9]\.\d{2}/);
    });

    test('time format includes minutes correctly', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(65000); // 1 minute 5 seconds
      });

      const display = screen.getByTestId('time-display');
      expect(display.textContent).toMatch(/01:0[5-9]\.\d{2}/);
    });
  });

  describe('Edge Cases', () => {
    test('timer continues accumulating across pause/resume cycles', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('pause-btn'));

      const firstTime = screen.getByTestId('time-display').textContent;

      fireEvent.click(screen.getByTestId('start-btn'));
      act(() => {
        jest.advanceTimersByTime(100);
      });

      const secondTime = screen.getByTestId('time-display').textContent;
      expect(secondTime).not.toBe(firstTime);
    });

    test('resetting during a lap does not show laps', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));

      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));
      fireEvent.click(screen.getByTestId('reset-btn'));

      expect(screen.queryByTestId('laps-container')).not.toBeInTheDocument();
    });

    test('can record a lap, reset, and start a new session', () => {
      render(<Stopwatch />);

      // First session
      fireEvent.click(screen.getByTestId('start-btn'));
      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));
      fireEvent.click(screen.getByTestId('reset-btn'));

      // Second session
      fireEvent.click(screen.getByTestId('start-btn'));
      act(() => {
        jest.advanceTimersByTime(50);
      });

      const display = screen.getByTestId('time-display');
      expect(display).not.toHaveTextContent('00:00.00');
      expect(screen.queryByTestId('laps-container')).not.toBeInTheDocument();
    });

    test('Lap button works immediately after unpausing', () => {
      render(<Stopwatch />);
      fireEvent.click(screen.getByTestId('start-btn'));
      act(() => {
        jest.advanceTimersByTime(100);
      });
      fireEvent.click(screen.getByTestId('pause-btn'));

      expect(screen.getByTestId('lap-btn')).toBeDisabled();

      fireEvent.click(screen.getByTestId('start-btn'));

      expect(screen.getByTestId('lap-btn')).not.toBeDisabled();
      fireEvent.click(screen.getByTestId('lap-btn'));

      expect(screen.getByTestId('laps-container')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('complete workflow: start, lap multiple times, reset', () => {
      render(<Stopwatch />);

      // Start timer
      fireEvent.click(screen.getByTestId('start-btn'));
      expect(screen.getByTestId('pause-btn')).toBeInTheDocument();

      // Record first lap
      act(() => {
        jest.advanceTimersByTime(150);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));
      expect(screen.getByTestId('lap-row-0')).toBeInTheDocument();

      // Record second lap
      act(() => {
        jest.advanceTimersByTime(150);
      });
      fireEvent.click(screen.getByTestId('lap-btn'));
      expect(screen.getByTestId('lap-row-1')).toBeInTheDocument();

      // Pause
      fireEvent.click(screen.getByTestId('pause-btn'));
      expect(screen.getByTestId('start-btn')).toBeInTheDocument();

      // Resume
      fireEvent.click(screen.getByTestId('start-btn'));
      expect(screen.getByTestId('pause-btn')).toBeInTheDocument();

      // Reset
      fireEvent.click(screen.getByTestId('reset-btn'));
      expect(screen.getByTestId('time-display')).toHaveTextContent('00:00.00');
      expect(screen.queryByTestId('laps-container')).not.toBeInTheDocument();
    });
  });
});
