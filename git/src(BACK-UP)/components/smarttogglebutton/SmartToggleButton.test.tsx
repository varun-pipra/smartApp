import { render, screen, queryByAttribute, getByTestId } from "@testing-library/react";
import { Button, ToggleButton } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import SmartToggleButton, { ToggleButtonMetaProps }  from "./SmartToggleButton";

const metaData: ToggleButtonMetaProps[] = [
    {
      "text": "Tool",
      "icon": "plumbing",
      "disabled": false,
      "selected": false
    },
    {
      "text": "Equipment",
      "icon": "construction",
      "disabled": true,
      "selected": false
    }
  ]

describe("Smart Toggle Button",() => {
    it ("should render the toggle buttons", () =>{
        render(<SmartToggleButton toggleButtonMeta={metaData} showLabel={false} />);
        const button1Id = screen.getByTestId("0toggle");
        const button2Id = screen.getByTestId('1toggle')
        expect(button1Id).toBeInTheDocument();
        expect(button2Id).toBeInTheDocument();        
        
    })

    it ("check the button is disabled or not", () =>{
        render(<SmartToggleButton toggleButtonMeta={metaData} showLabel={false} />);
        const notDisabledButton = screen.getByTestId("0toggle");
        const disabledButton = screen.getByTestId("1toggle");
        expect(disabledButton).toBeDisabled()
        expect(notDisabledButton).not.toBeDisabled()
    })

    it("check the value", () => {
        render(<SmartToggleButton toggleButtonMeta={metaData} showLabel={false} />);
        const firstButtonValue = screen.getByTestId("0toggle");
        const secondButtonValue = screen.getByTestId("1toggle");
        
        expect(firstButtonValue).toHaveValue('Tool')
        expect(secondButtonValue).toHaveValue('Equipment')      
    })

    it("should render the button with Icon", () => {
            const {getByTestId} = render(
                <SmartToggleButton toggleButtonMeta={metaData} showLabel={false} />
            );
            expect(getByTestId('0icon')).toBeVisible();
    });

    

})
