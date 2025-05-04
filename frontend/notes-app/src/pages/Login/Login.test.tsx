import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login"; 

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {
  test("shows error message when invalid email is entered", async () => {
    renderWithRouter(<Login />);

    // Find inputs and button
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    // Type invalid email and valid password
    fireEvent.change(emailInput, { target: { value: "invalidEmail" } });
    fireEvent.blur(emailInput); // Triggers validation on blur
    fireEvent.change(passwordInput, { target: { value: "test1234" } });

    // Submit form
    fireEvent.click(submitButton);

    // Assert error message is shown
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test("shows error message when password is empty", async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    // Enter valid email, leave password empty
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
