import "./Email.scss";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import { Autocomplete, Grid, InputAdornment, TextField, Typography } from "@mui/material";

interface SUIEmailSelectorProps {
	emailOptions: any;
	selectedEmailList: any;
	onBlur?: any;
	emailLabel?: any;
	emailIcon?: any;
	width?: any;
	defaultSelectedValue?: any;
	required?: boolean;
	disabled?: boolean;
	displayInTextField?: any;
}

const SUIEmailSelector = (props: SUIEmailSelectorProps) => {
	const { emailOptions, selectedEmailList, onBlur, emailLabel, disabled = false, emailIcon, required = false, defaultSelectedValue, width = 600, displayInTextField = 'name' } = props;
	const [selectedEmails, setSelectedEmails] = React.useState<string[]>(defaultSelectedValue || []);
	const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 5.2 + ITEM_PADDING_TOP,
				width: 250,
			},
		},
	};
	React.useEffect(() => {
		if (defaultSelectedValue)
			setSelectedEmails([...defaultSelectedValue])
	}, [defaultSelectedValue])
	const handleChange = (event: any, value: any) => {
		const errorEmail = value.find((emailList: any) => {
			if (typeof (emailList) != 'object') {
				return !emailRegex.test(emailList)
			}
		});
		if (errorEmail) {
			//   console.log('In valid email');
		} else {
			setSelectedEmails(value);
			selectedEmailList(value);
		}
	};
	const handleOnBlur = () => {
		if (onBlur) onBlur(selectedEmails)
	}
	return (
		<div className="email-container">
			<InputLabel
				required={required}
				style={{ textAlign: "left" }}
				className="inputlabel"
				sx={{
					'& .MuiFormLabel-asterisk': {
						color: 'red'
					}
				}}
			>
				{emailLabel}
			</InputLabel>
			<Autocomplete
				sx={{ m: 1, width: width }}
				multiple
				id="tags-filled"
				className="email-auto-complete"
				onChange={handleChange}
				onBlur={handleOnBlur}
				options={emailOptions}
				// defaultValue={defaultSelectedValue}
				value={selectedEmails}
				freeSolo
				disabled={disabled}
				renderTags={(value: any, getTagProps) =>
					value.map((option: any, index: number) => (
						<Chip
							icon={<>{option?.thumbnail ? <img
								src={option?.thumbnail}
								alt="Avatar"
								style={{ width: "20px", height: "20px" }}
								className="chip-base-custom-img"
							/> : ''}</>}
							label={displayInTextField == 'name' && option ? (option?.firstName + ' ' + option?.lastName) : option.email}
							{...getTagProps({ index })}
							className="email-dropdown-chip-cls"
						/>
					))
				}
				renderInput={(params) => <TextField {...params} type="email"
				// InputProps={{
				//   startAdornment: (
				//     <InputAdornment position="start">
				//       {emailIcon}
				//     </InputAdornment>
				//   ),
				// }}
				/>
				}
				getOptionLabel={(option: any) => option?.email}
				renderOption={(props, option: any) => {
					return (
						<li {...props} key={option?.email}>
							<Grid container alignItems="center">
								<Grid item sx={{ display: 'flex', width: 44 }}>
									<img
										src={option?.thumbnail}
										alt="Avatar"
										style={{ width: "28px", height: "28px" }}
										className="base-custom-img"
									/>
								</Grid>
								<Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
									<Typography>
										{option?.firstName + ' ' + option?.lastName}
									</Typography>
									<Typography>
										{option?.email}
									</Typography>
								</Grid>
							</Grid>
						</li>
					);
				}}
			/>
		</div>
	);
};

export default SUIEmailSelector;
