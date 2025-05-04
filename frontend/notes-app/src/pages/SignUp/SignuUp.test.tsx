import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "./SignUp";
import axiosInstance from "../../utils/axiosInstance";

// Mock navigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock axiosInstance
jest.mock("../../utils/axiosInstance");

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Signup Success Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("signs up successfully and redirects to dashboard", async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { accessToken: "fake-token" },
    });

    const localStorageSetItemSpy = jest.spyOn(Storage.prototype, "setItem");

    renderWithRouter(<Signup />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "user@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: "test1234" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    });

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/create-account", {
        fullName: "John Doe",
        email: "user@example.com",
        password: "test1234",
      });
      expect(localStorageSetItemSpy).toHaveBeenCalledWith("token", "fake-token");
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});

describe("Signup Form Validation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows an error when name is empty", async () => {
    renderWithRouter(<Signup />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "user@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: "test1234" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  test("shows an error when email is invalid", async () => {
    renderWithRouter(<Signup />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "invalid-email" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: "test1234" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    });

    expect(
        screen.getByText((text) => text.toLowerCase().includes("email"))
      ).toBeInTheDocument();
  });

  test("shows an error when email is already registered", async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { error: "Email already exists" },
    });

    renderWithRouter(<Signup />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "existing-email@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: "test1234" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  test("shows an error when password is empty", async () => {
    renderWithRouter(<Signup />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "user@example.com" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test("displays unexpected response error if neither token nor error returned", async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: {},
    });

    renderWithRouter(<Signup />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
        target: { value: "Jane Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
        target: { value: "jane@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: "test5678" },
      });

      fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/unexpected response from server/i)
      ).toBeInTheDocument();
    });
  });
});
