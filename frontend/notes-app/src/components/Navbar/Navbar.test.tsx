import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  const mockSearch = jest.fn();
  const mockClearSearch = jest.fn();

  const renderNavbar = (searchValue = "") => {
    render(
      <MemoryRouter>
        <Navbar
          userInfo={{ fullName: "John" }} 
          onSearchNote={mockSearch}
          handleClearSearch={mockClearSearch}
        />
      </MemoryRouter>
    );

    // Set search value if provided
    if (searchValue) {
      const input = screen.getByPlaceholderText(/search/i);
      fireEvent.change(input, { target: { value: searchValue } });
    }
  };

  it("renders user info", () => {
    renderNavbar();
    expect(screen.getByText(/john/i)).toBeInTheDocument();
  });

  it("triggers onSearchNote when search is performed", () => {
    renderNavbar("note");
    const searchBtn = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchBtn);
    expect(mockSearch).toHaveBeenCalledWith("note");
  });

  it("calls handleClearSearch when clear button is clicked", () => {
    renderNavbar("note"); // ✅ ensure clear button shows up
    const clearBtn = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearBtn);
    expect(mockClearSearch).toHaveBeenCalled();
  });
});
