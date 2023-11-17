import { render } from "@testing-library/react";
import { CountGrid } from "./CountDisplayGrid";

const GridData = [
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  },
  {
    image: "https://img.icons8.com/ios/50/000000/maintenance.png",
    count: 45,
    category: "Tools & Equipmemt",
  }
];

describe("Count Display Grid", () => {
  it("should render the Grid", () => {
    const { getByTestId } = render(<CountGrid data={GridData} />);
    const grid = getByTestId("countGrid");
    expect(grid).toBeInTheDocument();
  });

  it("should render the Grid", () => {
    const { getByTestId } = render(<CountGrid data={GridData} />);
    const grid = getByTestId("countGrid");
    expect(grid).toBeInTheDocument();
  });
});
