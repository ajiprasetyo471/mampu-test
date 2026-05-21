import { render, screen } from "@testing-library/react";
import UsersPage from "./page";
import { useEnrichedUsers } from "@/hooks/useEnrichedUsers";

// Mock the hook
jest.mock("@/hooks/useEnrichedUsers");

let mockQuery: Record<string, string> = {};

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn((url: string) => {
        const queryStr = url.split("?")[1] || "";
        const params = new URLSearchParams(queryStr);
        mockQuery = {};
        params.forEach((value, key) => {
          mockQuery[key] = value;
        });
      }),
    };
  },
  usePathname() {
    return "/users";
  },
  useSearchParams() {
    return new URLSearchParams(mockQuery);
  },
}));

const mockEnrichedUsers = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "bret",
    email: "Sincere@april.biz",
    website: "hildegard.org",
    totalPosts: 10,
    completedTodos: 5,
    pendingTodos: 15,
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "antonette",
    email: "Shanna@melissa.tv",
    website: "anastasia.net",
    totalPosts: 5,
    completedTodos: 0,
    pendingTodos: 20,
  },
  {
    id: 3,
    name: "Clementina DuBuque",
    username: "moriah.stanton",
    email: "Rey.Padberg@karina.biz",
    website: "ambrose.net",
    totalPosts: 8,
    completedTodos: 10,
    pendingTodos: 0,
  },
];

describe("UsersPage", () => {
  beforeEach(() => {
    mockQuery = {};
    (useEnrichedUsers as jest.Mock).mockReturnValue({
      data: mockEnrichedUsers,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });
  });

  it("renders the enriched users list correctly with activity counts", () => {
    render(<UsersPage />);
    expect(screen.getAllByText("Leanne Graham")[0]).toBeInTheDocument();
    expect(screen.getAllByText("10 posts")[0]).toBeInTheDocument();
    expect(screen.getAllByText("✓ 5 completed")[0]).toBeInTheDocument();
    expect(screen.getAllByText("⏰ 15 pending")[0]).toBeInTheDocument();
  });

  it("filters users by name search query from URL", () => {
    mockQuery = { search: "leanne" };
    render(<UsersPage />);
    expect(screen.getAllByText("Leanne Graham")[0]).toBeInTheDocument();
    expect(screen.queryAllByText("Ervin Howell").length).toBe(0);
  });

  it("filters users by email search query from URL", () => {
    mockQuery = { search: "melissa.tv" };
    render(<UsersPage />);
    expect(screen.getAllByText("Ervin Howell")[0]).toBeInTheDocument();
    expect(screen.queryAllByText("Leanne Graham").length).toBe(0);
  });

  it("sorts users by name descending from URL", () => {
    mockQuery = { order: "desc" };
    render(<UsersPage />);
    
    const rowNames = screen.getAllByText(
      /Leanne Graham|Ervin Howell|Clementina DuBuque/i
    );
    // Desktop list renders first, then Mobile list.
    // Desktop: Leanne Graham -> Ervin Howell -> Clementina DuBuque
    // Mobile: Leanne Graham -> Ervin Howell -> Clementina DuBuque
    expect(rowNames[0]).toHaveTextContent("Leanne Graham");
    expect(rowNames[1]).toHaveTextContent("Ervin Howell");
    expect(rowNames[2]).toHaveTextContent("Clementina DuBuque");
    expect(rowNames[3]).toHaveTextContent("Leanne Graham");
    expect(rowNames[4]).toHaveTextContent("Ervin Howell");
    expect(rowNames[5]).toHaveTextContent("Clementina DuBuque");
  });

  it("sorts users by pending todos ascending from URL", () => {
    mockQuery = { sort: "pendingTodos", order: "asc" };
    render(<UsersPage />);
    
    const rowNames = screen.getAllByText(
      /Leanne Graham|Ervin Howell|Clementina DuBuque/i
    );
    // Desktop: Clementina DuBuque -> Leanne Graham -> Ervin Howell
    // Mobile: Clementina DuBuque -> Leanne Graham -> Ervin Howell
    expect(rowNames[0]).toHaveTextContent("Clementina DuBuque");
    expect(rowNames[1]).toHaveTextContent("Leanne Graham");
    expect(rowNames[2]).toHaveTextContent("Ervin Howell");
    expect(rowNames[3]).toHaveTextContent("Clementina DuBuque");
    expect(rowNames[4]).toHaveTextContent("Leanne Graham");
    expect(rowNames[5]).toHaveTextContent("Ervin Howell");
  });

  it("filters users with pending todos", () => {
    mockQuery = { filter: "pending" };
    render(<UsersPage />);
    
    expect(screen.getAllByText("Leanne Graham")[0]).toBeInTheDocument(); // 15 pending
    expect(screen.getAllByText("Ervin Howell")[0]).toBeInTheDocument(); // 20 pending
    expect(screen.queryAllByText("Clementina DuBuque").length).toBe(0); // 0 pending
  });

  it("filters users with no completed todos", () => {
    mockQuery = { filter: "no-completed" };
    render(<UsersPage />);
    
    expect(screen.getAllByText("Ervin Howell")[0]).toBeInTheDocument(); // 0 completed
    expect(screen.queryAllByText("Leanne Graham").length).toBe(0); // 5 completed
    expect(screen.queryAllByText("Clementina DuBuque").length).toBe(0); // 10 completed
  });
});
