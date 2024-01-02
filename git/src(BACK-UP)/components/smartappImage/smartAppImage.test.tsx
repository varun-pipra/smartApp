import {
    render,
    queryByAttribute,
    waitFor,
    act,
  } from "@testing-library/react";
  import { Addimage } from './smartAppImage';
  import userEvent from "@testing-library/user-event";
  
  describe("File Upload Field", () => {
    it("should render a label and a file input field", () => {
      const getById = queryByAttribute.bind(null, "id");
      const dom = render(<Addimage />);
      const label = getById(dom.container, "previewImg");
      const fileInputField = getById(dom.container, "file-input");
      expect(label).toBeInTheDocument();
      expect(fileInputField).toBeInTheDocument();
    });

  
    it("Upload Image Files", async () => {
      const { getByTestId, queryByTestId } = render(<Addimage />);
      const fakeFile = new File(["hello"], "hello.png", { type: "image/png" });
      const inputFile = getByTestId("file-input");
      await act(async () => {
        await waitFor(() => {
          userEvent.upload(inputFile, fakeFile);
        });
      });
      await waitFor(() => expect(queryByTestId("documents")).toBeTruthy());
    });
  
    it("Upload Supported Images", async () => {
      const files = [
        new File(["hello"], "hello.png", { type: "image/png" }),
        new File(["Png"], "image/gif", { type: "image/gif" }),
        new File(["Jpeg"], "image/jpeg", { type: "image/jpeg" }),
        new File(["Jpng"], "image/jpng", { type: "image/jpng" }),
        new File(["jpg"], "image.jpg", { type: "image.jpg" }),
      ];
  
      const { getByTestId, queryByTestId } = render(<Addimage />);
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
  