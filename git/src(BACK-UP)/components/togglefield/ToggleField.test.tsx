
import { render, screen, queryByAttribute, getByTestId } from "@testing-library/react";
import ToggleField from "./ToggleField";
describe('Toggle Field', () => {
    it('should render the Label',() => {
        render(<ToggleField label='Dark Mode' checked={true}/>);
        const id = screen.getByTestId("toggleField");
        expect(id).toBeInTheDocument();
    })

    it('check the toggle field is disabled or not',() => {
        render(<ToggleField checked={false}/>);
        const id = screen.getByTestId("toggleField");
        expect(id).not.toBeDisabled();
    })

    it('check the toggle field is not selected',() => {
        render(<ToggleField role={'switch'} checked={false}/>);
        const id = screen.getByTestId("toggleField");
        expect(id).not.toBeChecked();
    })

    

})