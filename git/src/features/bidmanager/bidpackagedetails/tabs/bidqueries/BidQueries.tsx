import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { InputLabel } from '@mui/material';
import './BidQueries.scss';

import BidQueriesIcon from 'resources/images/bidManager/bid-queries-gray.svg';
import UserHead from 'resources/images/sample-user.jpg';
import LadyUserHead from 'resources/images/Woman.jpg';
import IQSearch from 'components/iqsearchfield/IQSearchField';
import IQComment from 'components/iqcommentfield/IQCommentField';
import Posts from 'components/posts/Posts';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import convertDateToDisplayFormat, { stringToUSDateTime, convertISOToDispalyFormat, removeHtmlFromString } from 'utilities/commonFunctions';
import { CreateBidQueries, ResponseBidQueries } from 'features/bidmanager/stores/BidQueriesAPI';
import { getServer } from 'app/common/appInfoSlice';
import { loadBidQueriesByPackage } from 'features/bidmanager/stores/BidQueriesSlice';
import { formatDate } from 'utilities/datetime/DateTimeUtils';

const Grouping = ({ data, groupKey, onResponseClick, readOnly }: any) => {

	var tinycolor = require('tinycolor2');
	// Group the data by companyName
	const groupedData = data && data?.reduce((groups: any, item: any) => {
		const groupValue = item[groupKey];
		if (!groups[groupValue]) {
			groups[groupValue] = [];
		}
		groups[groupValue].push(item);
		return groups;
	}, {});

	// Create a new array of grouped data objects
	const newArray = Object.keys(groupedData).map((groupValue) => ({
		groupValue,
		items: groupedData[groupValue],
	}));

	const QueryType = (value: any) => {
		return (
			value == 1 ? 'Public' : 'Private'
		)
	}
	return (
		<div>
			{newArray.map((group: any) => (

				<div>
					<div className='groupBy'>
						{groupKey == 'companyName' &&
							<div>
								{group?.items[0]?.companyThumbnail ?
									<img className="post-thumbnail" src={group?.items[0]?.companyThumbnail} />
									:
									<div
										className="post-thumbnail-word"
										style={{
											background: '#059cdf',
											color: tinycolor('#059cdf').isDark() ? 'white' : 'black',
										}}

									>{group?.groupValue?.substring(0, 1)}</div>
								}
							</div>
						}
						<span className='name'>
							{groupKey == 'companyName' ? group?.groupValue : QueryType(group?.groupValue)}
						</span>
					</div>
					<Posts
						posts={group?.items}
						readOnly={readOnly}
						emptyText={
							<>
								<span className="common-icon-BidQueries"></span>
								No Bid Queries Exist
							</>
						}
						onResponseClick={(value: any) => {
							onResponseClick(value);
						}}
					/>
				</div>
			))}
		</div>
	)
}

const BidQueries = (props: any) => {
	const dispatch = useAppDispatch();
	const appInfo = useAppSelector(getServer);
	const { BidQueriesData } = useAppSelector((state) => state.bidQueries);
	const [queriesData, setQueriesData] = useState<any>([]);
	const [aliasQueriesData, setAliasQueriesData] = useState([]);
	const [query, setQuery] = useState<any>();
	const { selectedRecord } = useAppSelector((state) => state.bidManager);
	const { activeCompaniesList } = useAppSelector((state) => state.bidManagerGrid);
	const [companyList, setCompanyList] = useState<any>();
	const [group, setGroup] = useState<any>({
		value: '', status: ''
	});

	const groupOptions = [
		{ text: "Query Type", value: "privacy" },
		{ text: "Companies", value: "companyName" },
	];

	const filterOptions = [
		{
			text: "Query Type",
			value: "queryType",
			key: "queryType",
			// iconCls: "common-icon-name-id",
			children: {
				type: "checkbox",
				items: [{
					text: 'Private',
					id: 'private',
					key: 'private',
					value: 'private'

				}, {
					text: 'Public',
					id: 'public',
					key: 'public',
					value: 'public'
				}],
			},
		},
		{
			text: "Companies",
			value: "company",
			key: "company",
			// iconCls: "common-icon-Safety-Onboarding-Flyer",
			children: {
				type: "checkbox",
				items: [],
			},
		}
	];
	const [filters, setFilters] = React.useState<any>(filterOptions);

	React.useEffect(() => {
		dispatch(loadBidQueriesByPackage({ appInfo: appInfo, packageId: selectedRecord?.id }));
		if (selectedRecord) {
			const companiesList: any = [];
			selectedRecord?.bidders?.map((bidder: any) => {
				!companiesList?.map((a: any) => a.value)?.includes(bidder?.company?.id) && companiesList.push({
					text: bidder?.company?.name,
					key: bidder?.company?.id,
					value: bidder?.company?.id
				})
			})
			setCompanyList(companiesList)
		}
	}, [selectedRecord])

	React.useEffect(() => {
		const filtersCopy = [...filters];
		let companyItem = filtersCopy.find((rec: any) => rec?.value === "company");
		companyItem.children.items = companyList;
		setFilters(filtersCopy);

	}, [companyList])


	useEffect(() => {
		const finaldata: any = [];
		console.log('BidQueriesData', BidQueriesData)
		BidQueriesData?.map((data: any) => {
			var status = data?.queryResponse !== null ? false : true;
			finaldata.push({
				id: data?.id,
				name: data?.queryBy?.firstName + ' ' + data?.queryBy?.lastName,
				thumbnailUrl: data?.queryBy?.thumbnail,
				timestamp: formatDate(data?.queryDate),
				text: data?.queryText,
				isQuestion: true,
				companyId: data?.queryBy?.companyUId,
				companyName: data?.queryBy?.companyName,
				companyThumbnail: data?.queryBy?.companyThumbnail,
				privacy: data?.queryResponse?.isPrivate ? 0 : 1,
				privacyduplicate: data?.queryResponse?.isPrivate == false ? 'Public' : 'Private',
				isReply: status,
				responseName: data?.queryResponse?.responseBy?.firstName + ' ' + data?.queryResponse?.responseBy?.lastName,
				responseTimestamp: formatDate(data?.queryResponse?.responseDate),
				responseThumbnailUrl: data?.queryResponse?.responseBy?.thumbnail,
				responseText: data?.queryResponse?.responseText,
			});
		});
		setQueriesData(finaldata);
		setAliasQueriesData(finaldata);
	}, [BidQueriesData])

	const queryHandleClick = () => {
		const payLoad = {
			isPrivate: true,
			queryText: query
		}
		setQuery('');
		CreateBidQueries(appInfo, selectedRecord?.id, appInfo?.currentUserInfo?.userid, payLoad).then(() => {
			dispatch(loadBidQueriesByPackage({ appInfo: appInfo, packageId: selectedRecord?.id }));
		});
	};

	const responseClick = (data: any) => {
		const queryId = data.queryId;
		const payLoad = {
			responseText: data.responseText,
			isPrivate: (data.isPrivate === 0)
		};

		ResponseBidQueries(appInfo, selectedRecord?.id, appInfo?.currentUserInfo?.userid, queryId, payLoad).then(() => {
			dispatch(loadBidQueriesByPackage({ appInfo: appInfo, packageId: selectedRecord?.id }));
		});;
	};

	const handleOnSearchChange = (searchText: string) => {
		if (searchText !== '') {
			const firstResult = aliasQueriesData.length > 0 && aliasQueriesData.filter((obj: any) => {
				return JSON.stringify(obj).toLowerCase().includes(searchText.toLowerCase());
			});
			setQueriesData(firstResult);
		} else {
			setQueriesData(aliasQueriesData);
		}
	};

	const handleFilterChange = (filters: any) => {
		let filteredData: any = [...aliasQueriesData]
		if (filters?.queryType?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				if (filters?.queryType?.includes('private') && rec?.privacy == 0) return rec
				if (filters?.queryType?.includes('public') && rec?.privacy == 1) return rec
			});
		}
		if (filters?.company?.length > 0) {
			filteredData = filteredData.filter((rec: any) => {
				return filters?.company?.includes(rec?.companyId);
			});
		}
		setQueriesData(filteredData);
	}

	const handleGroupChange = (group: any) => {
		if (group == undefined || group == '') {
			setGroup({
				value: group, status: false
			});
		}
		else {
			setGroup({
				value: group, status: true
			});
		}
	}

	return (
		<Box className="tab-bid-queries">
			<Stack direction="row" className="header-box">
				<span className="header-text">Bid Queries</span>
				<IQSearch
					groups={groupOptions}
					filters={filters}
					onSearchChange={(text: string) => handleOnSearchChange(text)}
					onFilterChange={(filters: any) => handleFilterChange(filters)}
					onGroupChange={(group: any) => handleGroupChange(group)}
				/>
			</Stack>
			{!props.readOnly && (
				<>
					<InputLabel className='inputlabel'>Post a Comment</InputLabel>
					<IQComment
						onChange={(event: any) => {
							setQuery(event.target.value);
						}}
						value={query}
						onButtonClick={queryHandleClick}
						placeholder={'Enter your comment here'}
					/>
				</>
			)}
			{group?.status == true ?
				<Grouping
					data={queriesData}
					groupKey={group?.value}
					onResponseClick={(value: any) => {
						responseClick(value);
					}}
					readOnly={props.readOnly}
				/> :
				<Posts
					posts={queriesData}
					readOnly={props.readOnly}
					emptyText={
						<>
							<span className="common-icon-BidQueries"></span>
							No Bid Queries Exist
						</>
					}
					onResponseClick={(value: any) => {
						responseClick(value);
					}}
				/>
			}
		</Box>
	);
};

export default BidQueries;



