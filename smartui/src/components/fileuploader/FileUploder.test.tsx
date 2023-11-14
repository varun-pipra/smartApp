import {
  render,
  queryByAttribute,
  waitFor,
  act,
} from "@testing-library/react";
import { FileUploader } from "./Fileuploader";
import userEvent from "@testing-library/user-event";

describe("File Upload Field", () => {
  it("should render a label and a file input field", () => {
    const getById = queryByAttribute.bind(null, "id");
    const dom = render(<FileUploader />);
    const label = getById(dom.container, "previewImg");
    const fileInputField = getById(dom.container, "file-input");
    expect(label).toBeInTheDocument();
    expect(fileInputField).toBeInTheDocument();
  });

  it("should not show documents if there is no file has been selected", () => {
    const { getByTestId } = render(<FileUploader />);
    const DocumentSection = getByTestId("no-document");
    expect(DocumentSection).toBeInTheDocument();
  });

  it("Upload Files", async () => {
    const { getByTestId, queryByTestId } = render(<FileUploader />);
    const fakeFile = new File(["hello"], "hello.png", { type: "image/png" });
    const inputFile = getByTestId("file-input");
    await act(async () => {
      await waitFor(() => {
        userEvent.upload(inputFile, fakeFile);
      });
    });
    await waitFor(() => expect(queryByTestId("documents")).toBeTruthy());
  });

  it("Upload multiple Files", async () => {
    const files = [
      new File(["hello"], "hello.png", { type: "image/png" }),
      new File(["there"], "there.png", { type: "image/png" }),
    ];

    const { getByTestId, queryByTestId } = render(<FileUploader />);
    const inputFile = getByTestId("file-input");
    userEvent.upload(inputFile, files);
    await act(async () => {
      await waitFor(() => {
        userEvent.upload(inputFile, files);
      });
    });
    await waitFor(() => expect(queryByTestId("documents")).toBeTruthy());
  });
});
