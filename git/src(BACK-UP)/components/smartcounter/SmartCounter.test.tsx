import { render, screen } from "@testing-library/react"
import SmartCounter from "./SmartCounter"

describe('Smart Counter Test Cases', () => {
    it('Should render the input', () => {
        render(<SmartCounter />)
        const inputId = screen.getByTestId('input')
        expect(inputId).toBeInTheDocument()
    })

    it('Should render the increment and decrement buttons', () => {
        render(<SmartCounter />)
        const incrementId = screen.getByTestId('increment')
        const decrementId = screen.getByTestId('decrement')
        
        expect(incrementId).toBeInTheDocument()
        expect(decrementId).toBeInTheDocument()
        
    })

    it('Should Display the Default Value', () => {
        render(<SmartCounter defaultValue={10} />)
        const inputId = screen.getByTestId('input')        
        expect(inputId).toHaveValue(10)        
    })

    it('Should Display the Label', () => {
        render(<SmartCounter label={'Counter'} />)
        const inputId = screen.getByTestId('input')        
        expect(inputId).toBeInTheDocument()        
    })
})