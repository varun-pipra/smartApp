import { ThemeProvider } from "@emotion/react"
import Button from "@mui/material/Button"
import React from "react"
import OutlinedInput from "@mui/material/OutlinedInput"
import { createTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import styles from './SmartCounter.module.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Input from "@mui/material/Input"
import InputLabel from "@mui/material/InputLabel"
import FormGroup from "@mui/material/FormGroup"
import { FormControlLabel, IconButton, IconButtonProps } from "@mui/material"


export interface SmartCounterProps extends IconButtonProps {
    label?: string;
    defaultValue?: number;
    textColor?: string;
    inputChange?: (value: number) => void
}


export default function SmartCounter({ label = '', defaultValue = 0, textColor = '', inputChange, ...rest }: SmartCounterProps) {
    const [value, setValue] = React.useState<number>(0)

    React.useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue])

    function handleDecrement() {
        const currentValue: number = value - 1
        setValue(currentValue);
        emitChanges(currentValue);

    }
    function handleIncrement() {
        const currentValue: number = value + 1
        setValue(currentValue);
        emitChanges(currentValue);
    }

    function emitChanges(currentValue: any) {
        // console.log("emitt");
        if (inputChange) inputChange(currentValue);

    }

    function handleInput(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const currentValue: number = !Number.isNaN(Number(event.target.value)) ? Number(event.target.value) : value;
        setValue(currentValue)
        emitChanges(currentValue);

    }

    return (
        <>
            <label style={{ color: textColor }}>{label}</label>
            <IconButton data-testid='decrement' onClick={handleDecrement} {...rest}>
                <RemoveCircleOutlineIcon />
            </IconButton>
            <OutlinedInput
                style={{ width: '47px', height: '30px' }}
                data-testid="input"
                value={value}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleInput(event)}
            />
            <IconButton data-testid='increment' onClick={handleIncrement} {...rest}>
                <AddCircleOutlineIcon />
            </IconButton>

        </>)

}

