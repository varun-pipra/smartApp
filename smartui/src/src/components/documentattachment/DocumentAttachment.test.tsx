import { render, screen, fireEvent } from "@testing-library/react";
import DocumentAttachment from "./DocumentAttachment";

const label = "Specification";
const placeholder = "Specification link or Document Attachment";

test("Should Use Label", () => {
  render(<DocumentAttachment label={label} placeholder={placeholder} />);
  const Label = screen.getByText("Specification");
  expect(Label).toBeInTheDocument();
});

test("Should Use Placeholder", () => {
  render(<DocumentAttachment label={label} placeholder={placeholder} />);
  const Placeholder = screen.getByPlaceholderText(
    "Specification link or Document Attachment"
  );
  expect(Placeholder).toBeInTheDocument();
});

test("Should Use Icon", () => {
  render(<DocumentAttachment label={label} placeholder={placeholder} />);
  const icon = screen.getByTestId("Icon-id");
  expect(icon).toBeInTheDocument();
});

test("Should Use Button", () => {
  render(<DocumentAttachment label={label} placeholder={placeholder} />);
  const button = screen.getByTestId("button-id");
  expect(button).toBeInTheDocument();
});

test("Should Use TexxtField Or Should Change Value In Input", () => {
  render(<DocumentAttachment label={label} placeholder={placeholder} />);
  const TextField = screen.getByTestId("TextField-id").querySelector("input");
  expect(TextField).toBeInTheDocument();
  if (TextField) {
    fireEvent.change(TextField, { target: { value: "input" } });
    expect(TextField.value).toBe("");
  }
});
