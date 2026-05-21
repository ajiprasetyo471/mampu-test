import { render, screen, fireEvent } from "@testing-library/react";
import UsersPage from "./page";
import { useUsers } from "@/hooks/useUsers";

// Mock the hook
jest.mock("@/hooks/useUsers");

const mockUsers = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "bret",
    email: "Sincere@april.biz",
    website: "hildegard.org",
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "antonette",
    email: "Shanna@melissa.tv",
    website: "anastasia.net",
  },
  {
    id: 3,
    name: "Clementina DuBuque",
    username: "moriah.stanton",
    email: "Rey.Padberg@karina.biz",
    website: "ambrose.net",
  },
];

describe("UsersPage", () => {
  beforeEach(() => {
    (useUsers as jest.Mock).mockReturnValue({
      data: mockUsers,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("renders the users list correctly", () => {
    render(<UsersPage />);
    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    expect(screen.getByText("Clementina DuBuque")).toBeInTheDocument();
  });

  it("filters users by name search query", () => {
    render(<UsersPage />);
    const searchInput = screen.getByPlaceholderText(/Search by name or email/i);
    fireEvent.change(searchInput, { target: { value: "leanne" } });

    expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.queryByText("Ervin Howell")).not.toBeInTheDocument();
  });

  it("filters users by email search query", () => {
    render(<UsersPage />);
    const searchInput = screen.getByPlaceholderText(/Search by name or email/i);
    fireEvent.change(searchInput, { target: { value: "melissa.tv" } });

    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
  });

  it("sorts users by name", () => {
    render(<UsersPage />);
    // By default, sorted ascending: Clementina -> Ervin -> Leanne
    const rowNamesBefore = screen.getAllByText(
      /Leanne Graham|Ervin Howell|Clementina DuBuque/i
    );
    expect(rowNamesBefore[0]).toHaveTextContent("Clementina DuBuque");
    expect(rowNamesBefore[1]).toHaveTextContent("Ervin Howell");
    expect(rowNamesBefore[2]).toHaveTextContent("Leanne Graham");

    // Click sort to toggle to desc: Leanne -> Ervin -> Clementina
    const sortButton = screen.getByText(/Sort by Name/i);
    fireEvent.click(sortButton);

    const rowNamesAfter = screen.getAllByText(
      /Leanne Graham|Ervin Howell|Clementina DuBuque/i
    );
    expect(rowNamesAfter[0]).toHaveTextContent("Leanne Graham");
    expect(rowNamesAfter[1]).toHaveTextContent("Ervin Howell");
    expect(rowNamesAfter[2]).toHaveTextContent("Clementina DuBuque");
  });
});
