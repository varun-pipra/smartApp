import { FormControlLabel, FormGroup, FormLabel, ListItemIcon, SxProps, TextField, ToggleButton, ToggleButtonProps } from "@mui/material";
import ToggleButtonGroup, 
{ ToggleButtonGroupClasses, ToggleButtonGroupProps, ToggleButtonGroupPropsColorOverrides, ToggleButtonGroupPropsSizeOverrides } 
from "@mui/material/ToggleButtonGroup";
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import React from "react";
import Icon from '@mui/material/Icon';
import { OverridableStringUnion } from '@mui/types';
import { Theme } from "@emotion/react";



export interface ToggleButtonMetaProps {
    text: string;
    icon: string;
    disabled: boolean;
    selected: boolean;
}

export interface SmartToggleButtonProps {
    /**
     * Icon name should be from mui
     */
    toggleButtonMeta: ToggleButtonMetaProps[];
    showLabel: boolean;
    iconColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'disabled' | 'success' | 'inherit' | 'action';
    showLabelInsideButton?: boolean;
    classes?: Partial<ToggleButtonGroupClasses>;
    /**
     * The color of the button when it is selected.
     * It supports both default and custom theme colors, which can be added as shown in the
     * [palette customization guide](https://mui.com/material-ui/customization/palette/#adding-new-colors).
     * @default 'standard'
     */
    color?: OverridableStringUnion<
    'standard' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    ToggleButtonGroupPropsColorOverrides
    >;
    /**
     * If `true`, the component is disabled. This implies that all ToggleButton children will be disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * If `true`, the button group will take up the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
    /**
     * The component orientation (layout flow direction).
     * @default 'horizontal'
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * The size of the component.
     * @default 'medium'
     */
    size?: OverridableStringUnion<'small' | 'medium' | 'large', ToggleButtonGroupPropsSizeOverrides>;
    /**
     * The system prop that allows defining system overrides as well as additional CSS styles.
     */
    sx?: SxProps<Theme>;
    /**
     * Callback fired when the value changes.
     */
    
    onChange?: (event: React.MouseEvent<HTMLElement>,
            selectedValue: string) => void
    
}

export default function SmartToggleButton({toggleButtonMeta, showLabel, showLabelInsideButton=false, iconColor='inherit', onChange, ...rest}: SmartToggleButtonProps) {
    const [alignment, setAlignment] = React.useState<string>()
    const [showText, setShowText] = React.useState<boolean>(showLabel)

    React.useEffect(() => {
        updateLabel()        
    }, [showLabel,showLabelInsideButton])

    React.useEffect(() => {
        updateAlignment()               
    }, [toggleButtonMeta])

    function updateLabel() {
        showLabelInsideButton ? setShowText(false) : setShowText(showLabel);
    }
    function updateAlignment() {
        toggleButtonMeta.forEach((obj) => {
            if (obj.selected) setAlignment(obj.text); 
         })         

    }

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
        if (onChange) onChange(event, newAlignment);
    };

    return (
        <>
            <FormGroup>
                <FormControlLabel
                    control={
                        <ToggleButtonGroup
                            value={alignment}
                            onChange={handleAlignment}
                            exclusive
                            aria-label="text alignment"
                            {...rest}
                        >
                            {
                                toggleButtonMeta.map((obj: ToggleButtonMetaProps, index: Number) => {
                                    return (
                                        <ToggleButton
                                            key={index + 'toggle'} 
                                            data-testid={index + 'toggle'}
                                            value={obj.text}
                                            disabled={obj.disabled}
                                        >
                                            <Icon data-testid={index+'icon'} color={iconColor}>
                                            {obj.icon}
                                            </Icon>
                                            {showLabelInsideButton ? obj.text : ''}
                                        </ToggleButton>
                                    )
                                })
                            }
                        </ToggleButtonGroup>
                    }
                    label={<label style={{paddingLeft: '7px'}}>{showText ? alignment : ''} </label>} 
                />
            </FormGroup>
        </>)
}