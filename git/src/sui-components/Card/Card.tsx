import { List, ListItem, ListItemAvatar, InputLabel, Card, Avatar, Grid, ListItemText, Typography } from "@mui/material"
import React from "react"
import BidPackageName from 'resources/images/bidManager/BidPackageName.svg';
import './Card.scss';
import Award from 'resources/images/ContractsOrange.svg'
import AwardBackGround from 'resources/images/bidManager/AwardBackGround.svg';
import { getIntendToBid, getSubmissionStatus, awardTileIntendBidBGColor, awardTileSubmissionStatusBGColor } from "utilities/bid/enums";
import { useAppSelector } from "app/hooks";
var tinycolor = require('tinycolor2');



interface SUICardProps {
	cardData?: any
	height?: string;
	width?: string;
	onClick?: any;
	selectIndex?: number;
	awarded?: boolean;
	tileNumber?: any;
}
const sampleData = {
	"id": "0bfb5732-5b81-41a4-8d66-ebc9dd1cd154",
	"company": {
		"id": "d5e5841f-404d-4f7b-b044-09665b96bdd0",
		"objectId": 9696815,
		"isRestricted": false,
		"thumbnailUrl": "https://central.smartappbeta.com/images/6f85dd23-c219-4bdd-a0a6-9f117f319d0d",
		"calendarId": null,
		"isImportedFromOrg": false,
		"name": "Smartapp Company",
		"phone": null,
		"website": null,
		"colorCode": 'DA5350',
		"vendorId": null,
		"hasSubCompany": false,
		"companyType": 0,
		"isDiverseSupplier": false,
		"complianceStatus": null
	},
	"contactPerson": {
		"id": "c93c8be6-fa7b-4c31-ac41-7eb1fb1573aa",
		"objectId": 533662,
		"phone": "8333063445",
		"email": "ndeb@smartapp.com",
		"firstName": "Nabarupam",
		"lastName": "Deb",
		"thumbnail": "https://central.smartappbeta.com/images/6f85dd23-c219-4bdd-a0a6-9f117f319d0d"
	},
	"intendToBid": 0,
	"submissionStatus": 0,
	"totalBidValue": 0,
	"bidCoverLetter": null,
	"bidInclusions": null,
	"bidExclusions": null
}
const SUICard = ({ cardData = sampleData, tileNumber, height = '30%', width = '30%', ...rest }: SUICardProps) => {
	// const {data} = props
	const { currencySymbol } = useAppSelector((state) => state.appInfo);
	const [awarded, setAwarded] = React.useState<any>(false)

	React.useEffect(() => { setAwarded(rest?.awarded) }, [rest?.awarded])

	const handleClick = (data: any, e: any) => {
		if (rest.onClick) rest.onClick(data, e);
	}
	return (
		<Card style={{ height: height, width: width, backgroundPosition: 'right', backgroundImage: rest?.awarded ? `url(${AwardBackGround})` : '', backgroundRepeat: 'no-repeat' }} className='card-container'>
			<List className='award-tile-cls'>
				<ListItem
					alignItems="flex-start"
					className={rest?.awarded ? "award-list" : ""}
					selected={rest?.selectIndex == cardData.id ? true : false}
					secondaryAction={
						<span>{tileNumber}</span>
					}
					onClick={(e: any) => handleClick(cardData, e)}
				>
					<ListItemAvatar>
						<Avatar sizes='medium' alt="Travis Howard" src={cardData?.company?.thumbnailUrl} style={{ borderRadius: '48px', width: '35px', height: '35px' }} />
					</ListItemAvatar>
					<ListItemText
						primary={<span className='inputLabel1' style={{ color: '#059CDF' }}>{cardData?.company?.name}</span>}
						secondary={
							<React.Fragment>
								<Grid container direction='row' ml={-5}>
									<Grid item sm={12}>
										<Grid container direction='row'>
											<Grid item sm={7}>
												<p>Bid Value:</p>
											</Grid>
											<Grid item sm={5}>
												<p style={{
													color: cardData?.totalBidValue > cardData?.totalBudgetValue ? 'red'
														: 'green'
												}}>{`${currencySymbol} ${cardData?.totalBidValue?.toLocaleString("en-US")}`}</p>
											</Grid>

										</Grid>
									</Grid>
									<Grid item sm={12} mt={-2}>
										<Grid container direction='row'>
											<Grid item sm={7}>
												<p>Attachments:</p>
											</Grid>
											<Grid item sm={5} mt={1.8}>
												<span style={{ color: '#059CDF', marginTop: '5px' }}>{cardData?.noOfFiles ? cardData?.noOfFiles : 0}</span>
											</Grid>

										</Grid>
									</Grid>
									<Grid item sm={12} mt={-2}>
										<Grid container direction='row'>
											<Grid item sm={7}>
												<p>Intend To Bid:</p>
											</Grid>
											<Grid item sm={5}>
												<p style={{ backgroundColor: awardTileIntendBidBGColor[cardData?.intendToBid], color: tinycolor(awardTileIntendBidBGColor[cardData?.intendToBid]).isDark() ? 'white' : 'black' }} className='intendToBid'>{getIntendToBid(cardData?.intendToBid)}</p>
											</Grid>

										</Grid>
									</Grid>
									<Grid item sm={12} mt={-2}>
										<Grid container direction='row'>
											<Grid item sm={7}>
												<p>Submission Status:</p>
											</Grid>
											<Grid item sm={5}>
												<p style={{ backgroundColor: awardTileSubmissionStatusBGColor[cardData?.submissionStatus], color: tinycolor(awardTileSubmissionStatusBGColor[cardData?.submissionStatus]).isDark() ? 'white' : 'black' }} className='intendToBid'>{getSubmissionStatus(cardData?.submissionStatus)}</p>
											</Grid>

										</Grid>
									</Grid>
								</Grid>
								{/* <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                Ali Connors
                            </Typography>
                            {" — I'll be in your neighborhood doing errands this…"} */}
							</React.Fragment>
						}
					/>
				</ListItem>
			</List>
		</Card>)
}

export default SUICard;
