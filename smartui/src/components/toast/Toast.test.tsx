import { render, screen, queryByAttribute, waitFor } from "@testing-library/react";
import Toast from './Toast';


describe('Toast', () => {


	// Testing if the Toastmessage is rendered correctly to the DOM	
	it("Toastmessage rendered correctly", () => {
		render(<Toast message={'Hello'} />);
		const toastElement = screen.getByTestId("toastmsg");
		expect(toastElement).toBeInTheDocument();
	});

	//Testing if the Toastmessage displays the text passed as a props
	it("Toastmessage Text", () => {
		render(<Toast message={'Hello'} />);
		const toastElement = screen.getByTestId("toastmsg");
		expect(toastElement).toHaveTextContent('Hello');
	});

	//Testing if the Toastmessage displays the text passed as a props and remove the interval of o.1sec
	jest.useFakeTimers();
	it('Toast message removes after 0.1sec', async () => {
		const { queryByText } = render(<Toast message={'Hello'} interval={100} />);
		expect(queryByText('Hello')).toBeInTheDocument();
		jest.advanceTimersByTime(100);
		await waitFor(() => {
			expect(queryByText('Hello')).not.toBeInTheDocument();
		});
	})



	//Testing if the Toastmessage with text ,interval and showclose button passed as a props; interval = 1000 /showclose = true 
	it("should render the Toastmessage with close button", () => {
		render(<Toast message={'hello'} interval={1000} showclose={true} />);
		const closebuttonElement = Array.from(
			document.getElementsByClassName(
				"close-button"
			) as HTMLCollectionOf<HTMLElement>
		);
		expect(closebuttonElement.length).toBe(1);

	});
	//Testing if the Toastmessage with text ,interval and showclose button passed as a props; interval = 1000 /showclose = false 
	it("should render the Toastmessage without close button", () => {
		render(<Toast message={'hello'} interval={1000} showclose={false} />);
		const closebuttonElement = Array.from(
			document.getElementsByClassName(
				"close-button"
			) as HTMLCollectionOf<HTMLElement>
		);
		expect(closebuttonElement.length).toBe(0);
	});
	//Testing if the Toastmessage with text ,interval and showclose button passed as a props; interval = 0 /showclose = true 
	it("should render the Toastmessage with close button will interval is zero and close button is true", () => {
		render(<Toast message={'hello'} interval={0} showclose={true} />);
		const closebuttonElement = Array.from(
			document.getElementsByClassName(
				"close-button"
			) as HTMLCollectionOf<HTMLElement>
		);
		expect(closebuttonElement.length).toBe(1);
	});
	//Testing if the Toastmessage with text ,interval and showclose button passed as a props; interval = 0 /showclose = false 
	it("should render the Toastmessage without close button will interval is zero and close button is false", () => {
		render(<Toast message={'hello'} interval={0} showclose={false} />);
		const closebuttonElement = Array.from(
			document.getElementsByClassName(
				"close-button"
			) as HTMLCollectionOf<HTMLElement>
		);
		expect(closebuttonElement.length).toBe(0);
	});
})	