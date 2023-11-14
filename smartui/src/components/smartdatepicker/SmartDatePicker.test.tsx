import { fireEvent, render, screen } from "@testing-library/react"
import SmartDatePicker from './SmartDatePicker'
import TextField from '@mui/material/TextField';


function handleOnChange(value:any)  {}

describe('Smart Date Picker Test Cases', () => {
    it('Should render the Icon', () => {
        render(<SmartDatePicker iconName={'home'} onChange={(value:any) => handleOnChange(value)} value={null} renderInput={(params) => <TextField variant={'filled'} {...params} />}/>)
        const inputId = screen.getByTestId('icon')
        expect(inputId).toBeInTheDocument()
    })

    it('Should render the Date Picker button', () => {
        render(<SmartDatePicker onChange={(value:any) => handleOnChange(value)} value={null} renderInput={(params) => <TextField variant={'filled'} {...params} />} />)
        const datPickerId = screen.getByTestId('datePicker')        
        expect(datPickerId).toBeInTheDocument()
        
    })

    it('Should Display the Default Value', () => {
        render(<SmartDatePicker value={new Date('07-15-2022')} onChange={(value:any) => handleOnChange(value)} renderInput={(params) => <TextField variant={'filled'} {...params} />}/>)
        const inputId = screen.getByTestId('datePicker')        
        expect(inputId).toHaveValue('07-15-2022')        
    })

    it('Should Display the Label', () => {
        render(<SmartDatePicker label={'From'} onChange={(value:any) => handleOnChange(value)} value={null} renderInput={(params) => <TextField variant={'filled'} {...params} />} />)
        const inputId = screen.getByTestId('datePicker')        
        expect(inputId).toBeInTheDocument()        
    })

    it('Date picker should be disabled', () => {
        render(<SmartDatePicker label={'From'} disabled onChange={(value:any) => handleOnChange(value)} value={null} renderInput={(params) => <TextField variant={'filled'} {...params} />} />)
        const inputId = screen.getByTestId('datePicker')        
        expect(inputId).toBeDisabled()        
    })

    it('Disable a particular month', () => {
        render(<SmartDatePicker disableMonth={5} label={'From'} disabled onChange={(value:any) => handleOnChange(value)} value={null} renderInput={(params) => <TextField variant={'filled'} {...params} />} />)
        const inputId = screen.getByTestId('datePicker').querySelector('input')       
        if (inputId) {
            fireEvent.change(inputId, { target: { value: "input" } });
            expect(inputId.value).toBe("");
          }       
    })

    it('Date picker should be disabled', () => {
        render(<SmartDatePicker label={'From'} disabled onChange={(value:any) => handleOnChange(value)} value={null} renderInput={(params) => <TextField variant={'filled'} {...params} />} />)
        const inputId = screen.getByTestId('datePicker')        
        expect(inputId).toBeDisabled()        
    })


})