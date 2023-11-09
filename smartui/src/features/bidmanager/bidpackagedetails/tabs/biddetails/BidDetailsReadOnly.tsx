import './BidDetailsReadOnly.scss';

import {useEffect, useState} from 'react';
import SUICountDownTimer from 'sui-components/CountDownTimer/CountDownTimer';
import Map from 'sui-components/Map/Map';
import {formatPhoneNumber} from 'utilities/commonFunctions';
import {formatDate} from 'utilities/datetime/DateTimeUtils';

import {Box} from '@mui/material';

const BidDetailsReadOnly = (props: any) => {
	const [ selectedRecord, setSelectedRecord ] = useState<any>(props?.data);
	useEffect(() => {setSelectedRecord(props?.data);}, [ props?.data ]);

	return (
		<Box className="tab-bid-details-readonly">
			<div className="header-text">Bid Package Details</div>
			<div className="details-box">
				<div className="bid-image-container">
					<img
						className="bid-image"
						src={selectedRecord?.projectInfo?.thumbnailUrl}
						alt="Bid Image"
					/>
				</div>
				<div className="package-info-container">
					<div className="package-info">
						<div className="package-timer_wrapper">
							<div className="package-info-cls">
								<span className="common-icon-bid-manager"></span>
								<span className="package-title">Bid Package ID</span>{" "}
								<span>
									{" "}
									<b> {selectedRecord?.displayId} </b>
								</span>
							</div>
							{props?.isResponseManager &&
								[ 0, 4 ].includes(props?.responseStatus) ? (
								<div className="bid-details-timer-info-box">
									<span className="bid-details-timer-info-box_label">
										Time left to Bid
									</span>
									<span>
										{[ 4 ].includes(props?.responseStatus) ? (
											<span className="bid-details-timer-info-box_expired-text">
												<b>Expired</b>
											</span>
										) : (
											<SUICountDownTimer targetDate={selectedRecord?.endDate} />
										)}
									</span>
								</div>
							) : (
								""
							)}
						</div>
						<div className="package-info-cls">
							{" "}
							<span className="common-icon-Project-ap"></span>{" "}
							<span className="package-title"> Project Name</span>{" "}
							<span>
								{" "}
								<b> {selectedRecord?.projectInfo?.name} </b>
							</span>
						</div>
					</div>
					<div className="bid-description">{selectedRecord?.description}</div>
				</div>
				<div className="map-container">
					<div className="bid-map">
						<Map
							latlng={{
								lat: selectedRecord?.projectInfo?.location?.latitude,
								lng: selectedRecord?.projectInfo?.location?.longitude,
							}}
							placename={selectedRecord?.projectInfo?.name}
							canShowCurrentLocation={true}
						/>
					</div>
					{/* <img className="bid-map" src={Map} alt="Bid Map" /> */}
				</div>
			</div>
			<div className="contact-box">
				<div className="requestedby-section">
					<div className="sub-heading">Bid Requested By</div>
					<div className="company-info">
						<div className="company-info_left-section">
							<img
								className="company-logo-img"
								src={selectedRecord?.company?.thumbnailUrl}
								alt="Company Logo"
							/>
							<div className="">
								<div className="company-name">
									{selectedRecord?.company?.name}
								</div>
								<div className="company-type">
									{selectedRecord?.company?.tradeName}
								</div>
							</div>
						</div>
						<div className="company-info_right-section">
							<div className="section-wrap">
								<span className="common-icon-email1 icon"></span>
								<div className="company-info_email">
									{selectedRecord?.company?.email}
								</div>
							</div>

							<div className="section-wrap">
								<span className="common-icon-bd-phone icon"></span>
								<div className="company-info_phone">
									{formatPhoneNumber(selectedRecord?.company?.phone)}
									{/* {formatPhoneNumber(7788996633)} */}
								</div>
							</div>

							<div className="section-wrap">
								<span className="common-icon-Location-filled icon"></span>
								<div className="company-info_location">
									{selectedRecord?.company?.address}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="point-of-contact">
					<div className="sub-heading">Bid Point of Contact</div>
					<div className="point-of-contact_left-section">
						<img
							className="point-of-contact-img"
							src={selectedRecord?.createdBy?.thumbnail}
							alt="Profile Image"
						/>
						<div className="">
							<div className="point-of-contact_name">
								{selectedRecord?.createdBy?.firstName} &nbsp;{" "}
								{selectedRecord?.createdBy?.lastName}
							</div>
							<div className="point-of-contact-type">
								{selectedRecord?.createdBy?.roles &&
									Object.values(selectedRecord?.createdBy?.roles)?.length > 0 &&
									Object.values(selectedRecord?.createdBy?.roles).join(", ")}
							</div>
						</div>
					</div>
					<div className="point-of-contact_right-section">
						<div className="section-wrap">
							<span className="common-icon-company-Icon icon"></span>
							<div className="point-of-contact_company-name">
								{selectedRecord?.company?.name}
							</div>
						</div>

						<div className="section-wrap">
							<span className="common-icon-email1 icon"></span>
							<div className="point-of-email">
								{selectedRecord?.createdBy?.email}
							</div>
						</div>

						<div className="section-wrap">
							<span className="common-icon-bd-phone icon"></span>
							<div className="point-of-contact_phone">
								{formatPhoneNumber(selectedRecord?.createdBy?.phone)}

							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bid-instruction-box">
				<span className="common-icon-BiddingInstructions icon"></span>
				<div className="sub-heading">Bid Instructions</div>
				<div
					dangerouslySetInnerHTML={{
						__html: selectedRecord?.instructions,
					}}
				></div>
			</div>
			<div className="additional-info-box">
				<span className="common-icon-BiddingInstructions icon"></span>
				<div className="sub-heading">Additional Info</div>
				<div className="bid-query-last-day-box">
					<span className='common-icon-BidQueries bid-last-date-icon'></span> Last Date for Bid Query{" "}
					<span className="bid-query-last-day-box_date">
						{selectedRecord?.queryDeadLine &&
							formatDate(selectedRecord?.queryDeadLine)}
					</span>
				</div>
				<div className="site-walkthrough-box">
					<span className='common-icon-Location-filled icon-circle bid-schedule-location-icon'></span> Site Walkthrough Schedule
					<span className="site-walkthrough_dates">
						{/* <span>{selectedRecord?.queryDeadLine &&
              formatDate(selectedRecord?.queryDeadLine)}</span> & */}

						<span>
							{selectedRecord?.siteWalkthrough &&
								formatDate(selectedRecord?.siteWalkthrough)}
						</span>
					</span>
				</div>
				<div className="site-walkthrough-notes">
					Walk-through notes:{" "}
					<span
						dangerouslySetInnerHTML={{
							__html: selectedRecord?.walkthroughNotes,
						}}
					></span>
				</div>
			</div>
		</Box>
	);
};

export default BidDetailsReadOnly;