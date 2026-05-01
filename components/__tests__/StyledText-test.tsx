import { render, screen } from '@testing-library/react-native';

import { MonoText } from '../StyledText';

describe('MonoText', () => {
  test('renders children', () => {
    render(<MonoText>Hello</MonoText>);
    expect(screen.getByText('Hello')).toBeOnTheScreen();
  });
});
