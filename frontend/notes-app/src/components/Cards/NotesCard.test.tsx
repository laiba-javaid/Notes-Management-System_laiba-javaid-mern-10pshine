import { render, screen, fireEvent } from "@testing-library/react";
import NotesCard from "../Cards/NotesCard";

const mockEdit = jest.fn();
const mockDelete = jest.fn();
const mockPin = jest.fn();

const note = {
  _id: "1",
  title: "Test Note",
  content: "This is a test note.",
  tags: ["test"],
  isPinned: false,
  createdOn: "2025-01-01"
};

describe("NotesCard Component", () => {
  it("renders note title and content", () => {
    render(
      <NotesCard
        title={note.title}
        date={note.createdOn}
        content={note.content}
        tags={note.tags}
        isPinned={note.isPinned}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onPinNote={mockPin}
      />
    );
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("This is a test note.")).toBeInTheDocument();
  });

  it("triggers edit and delete actions", () => {
    render(
      <NotesCard
        title={note.title}
        date={note.createdOn}
        content={note.content}
        tags={note.tags}
        isPinned={note.isPinned}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onPinNote={mockPin}
      />
    );

    fireEvent.click(screen.getByLabelText("edit"));
    expect(mockEdit).toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText("delete"));
    expect(mockDelete).toHaveBeenCalled();
  });

  it("toggles pin status", () => {
    render(
      <NotesCard
        title={note.title}
        date={note.createdOn}
        content={note.content}
        tags={note.tags}
        isPinned={note.isPinned}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onPinNote={mockPin}
      />
    );
    fireEvent.click(screen.getByTestId("pin-icon"));
    expect(mockPin).toHaveBeenCalled();
  });
});
