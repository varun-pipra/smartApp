import { render, screen, queryByAttribute, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Uniqueid from './Uniqueid';


describe('Uniqueid', () => {

	// Testing if the Uniqueid is rendered correctly to the DOM
	it("Uniqueid Component rendered correctly", () => {
		render(<Uniqueid label={'Unique ID'} />);
		const uniqueidElement = screen.getByTestId("uniqueId");
		expect(uniqueidElement).toBeInTheDocument();
	})
	//Testing if the Uniqueid component displaying the label and inputLabel  passed as a props
	it("Uniqueid component label and inputLabel are there", () => {
		render(<Uniqueid label={'Unique ID'} />);
		const uniqueidElement = screen.getByTestId("uniqueId");
		expect(uniqueidElement).toHaveTextContent('Unique ID');
	});

	//Testing Checkbox is initialy notchecked and after click its checked 
	it('Uniqueid component checkbox is checked/unchecked', () => {
		render(<Uniqueid label={'Unique ID'} />)
		const checkboxElement = screen.getByRole('checkbox')
		const uniqueidElement = screen.getByTestId('uniqueId')

		expect(checkboxElement).not.toBeChecked(); // Check that the checkbox starts out unchecked

		fireEvent.click(checkboxElement); // clicking the checkbox

		expect(checkboxElement).toBeChecked(); // Check that the checkbox is checked
		expect(uniqueidElement).toBeInTheDocument();

	})

	//Testing if the Uniqueid with label ,inputLabel and required passed as a props; required = true
	it("should render the Uniqueid with required", () => {
		render(<Uniqueid label={'Unique ID'} required={true} />);
		const closebuttonElement = Array.from(
			document.getElementsByClassName(
				"uniqueid_label_required"
			) as HTMLCollectionOf<HTMLElement>
		);
		expect(closebuttonElement.length).toBe(1);
	});

	//Testing if the Uniqueid with label ,inputLabel and required passed as a props; required = false
	it("should render the Uniqueid with required", () => {
		render(<Uniqueid label={'Unique ID'} />);
		const closebuttonElement = Array.from(
			document.getElementsByClassName(
				"uniqueid_label"
			) as HTMLCollectionOf<HTMLElement>
		);
		expect(closebuttonElement.length).toBe(1);
	});

});