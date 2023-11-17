import { render, screen, queryByAttribute } from "@testing-library/react";
import { Button } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import { Prompt } from "./Prompt";

const ImagePath =
  "https://s3.amazonaws.com/smartapp-appzones/iqhome/iqthumbnail/3d8c1c02ba00401b8a4dcec4d387818b/ca8cf7301f4f4c4d92ebb74adbd01a36.png";

describe("Alert Message Popup", () => {
  it("should render the popup", () => {
    render(<Prompt open={true} />);
    const modal = Array.from(
      document.getElementsByClassName(
        "MuiModal-root"
      ) as HTMLCollectionOf<HTMLElement>
    );
    expect(modal.length).toBe(1);
  });
  it("should not render the popup", () => {
     render(<Prompt open={false} />);
    const modal = Array.from(
      document.getElementsByClassName(
        "MuiModal-root"
      ) as HTMLCollectionOf<HTMLElement>
    );
    expect(modal.length).toBe(0);
  });

  it("should render the popup with title", () => {
    render(<Prompt open={true} title={"Hello"} />);
    expect(screen.getByText("Hello"));
  });
  it("should render the popup with content", () => {
    render(<Prompt open={true} alertMessage={"Alert Message"} />);
    expect(screen.getByText("Alert Message"));
  });
  it("should render the popup with button", () => {
    const { container } = render(
      <Prompt open={true} buttons={<Button>Close</Button>} />
    );
    const buttons = Array.from(
      document.getElementsByClassName(
        "MuiDialogActions-root"
      ) as HTMLCollectionOf<HTMLElement>
    );
    expect(buttons.length).toBe(1);
  });
  it("should not render the popup with image and shpuld have src and alt propeties", () => {
    render(
      <Prompt open={true} image={ImagePath} />
    );
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', ImagePath);
    expect(image).toHaveAttribute('alt', 'alertPopupImage');

  });
  it("should render the popup with Icon", () => {
    const {getByTestId} = render(
      <Prompt open={true} icon={<AccountBoxIcon />} />
    );
    expect(getByTestId('icon')).toBeVisible();
  });
});
