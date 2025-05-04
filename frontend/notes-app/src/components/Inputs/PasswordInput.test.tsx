import { render, fireEvent } from '@testing-library/react';
import PasswordInput from './PasswordInput';

describe('PasswordInput Component', () => {
  const setup = () => {
    const handleChange = jest.fn();
    const utils = render(
      <PasswordInput value="test123" onChange={handleChange} placeholder="Enter your password" />
    );
    const input = utils.getByPlaceholderText(/enter your password/i) as HTMLInputElement;
    return {
      input,
      handleChange,
      ...utils,
    };
  };

  it('renders the input with placeholder and value', () => {
    const { input } = setup();
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('test123');
  });

  it('calls onChange when typing in input', () => {
    const { input, handleChange } = setup();
    fireEvent.change(input, { target: { value: 'newpassword' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('toggles password visibility', () => {
    const { getByRole, getByPlaceholderText, getByTestId } = render(
      <PasswordInput value="secret" onChange={() => {}} placeholder="Password" />
    );

    const input = getByPlaceholderText(/password/i) as HTMLInputElement;

    // Initially type should be "password"
    expect(input.type).toBe('password');

    // Find the eye icon and click
    const toggleIcon = getByRole('button');
    fireEvent.click(toggleIcon);

    // Type should now be "text"
    expect(input.type).toBe('text');

    // Click again to hide
    fireEvent.click(toggleIcon);
    expect(input.type).toBe('password');
  });
});
