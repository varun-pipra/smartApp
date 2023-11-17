import {
    render,
    fireEvent,
    screen
  } from "@testing-library/react";
  import {CustomizedTextFeild} from './smartappTextFeild';

  
  describe("TextFiled ", () => {
    test("Should Use Placeholder", () => {
        render(<CustomizedTextFeild  placeholder="email" />);
        const Placeholder = screen.getByPlaceholderText(
          "enter an email"
        );
        expect(Placeholder).toBeInTheDocument();
      });
    test("Should Use TexxtField Or Should Change Value In Input", () => {
        render(<CustomizedTextFeild />);
        const TextField = screen.getByTestId("TextField-id").querySelector("input");
        expect(TextField).toBeInTheDocument();
        if (TextField) {
          fireEvent.change(TextField, { target: { value: "input" } });
          expect(TextField.value).toBe("");
        }
      });
      test("Should Use Label", () => {
        render(<CustomizedTextFeild label="email" />);
        const Label = screen.getByText("email");
        expect(Label).toBeInTheDocument();
      });


  });
  