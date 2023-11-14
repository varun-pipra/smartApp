import React, { useEffect, useState } from 'react';
import { Box, Stack, Button, ToggleButton, ToggleButtonGroup, ButtonGroup } from '@mui/material';
import { Reply } from '@mui/icons-material';

import './Posts.scss';

import IQComment from 'components/iqcommentfield/IQCommentField';

interface PostProps {
	id: any;
	name: string;
	timestamp: string;
	thumbnailUrl: string;
	text: string;
	isQuestion?: boolean;
	privacy?: number;
	isReply?: boolean;

	responseName?: string;
	responseTimestamp?: string;
	responseThumbnailUrl?: string;
	responseText?: string;
	readOnly?: boolean;
	responseButtonClick?: (value: any) => void;

};

const PostList = ({ posts, emptyText, onResponseClick, readOnly }: any) => {
	return <Box className='post-list'>
		{posts && posts.length > 0 ?
			<div className='post-box'>{posts.map((post: PostProps) => <Post {...post} readOnly={readOnly} responseButtonClick={(value) => { onResponseClick(value) }} />)}</div> :
			<div className='post-empty-text'>{emptyText}</div>}
	</Box>;
};

const Post = ({ id, name, timestamp, thumbnailUrl, privacy, text, isQuestion, isReply, responseText, responseName, responseTimestamp, responseThumbnailUrl, responseButtonClick, readOnly }: PostProps) => {
	const [showReply, setShowReply] = useState(false);
	const [replyType, setReplyType] = useState(0);
	const [query, setQuery] = useState();
	const onReplyTypeChange = (e: any, value: any) => {
		if (value === 0 || value === 1) setReplyType(value);
	};

	const commentHandleClick = (id: any) => {
		const data = {
			queryId: id,
			responseText: query,
			isPrivate: replyType
		}
		if (responseButtonClick) {
			responseButtonClick(data);
			setShowReply(false);
		}
	}
	return (
		<>
			<Stack className={`post-item${isQuestion ? " question" : ""}`}>
				<div className="post-header">
					<img className="post-thumbnail" src={thumbnailUrl} />
					<span className="post-metadata">
						<div className="post-author">{name}</div>
						<div>
							<span className="post-timestamp">{timestamp}</span>
							{!isReply && privacy !== undefined ? (
								<span className={`privacy-badge ${privacy === 1 ? " public" : " private"}`}>
									{privacy === 1 ? "Public" : "Private"}
								</span>
							) : (
								""
							)}
						</div>
					</span>
				</div>
				<div className="post-body">{text}</div>
			</Stack>
			{isReply == false ? (
				<Stack className={`post-item`}>
					<div className="post-header">
						<img className="post-thumbnail" src={responseThumbnailUrl} />
						<span className="post-metadata">
							<div className="post-author">{responseName}</div>
							<div>
								<span className="post-timestamp">{responseTimestamp}</span>
							</div>
						</span>
					</div>
					<div className="post-body">{responseText}</div>
				</Stack>
			) : null}


			{(isReply && !readOnly) ? (
				<div className="post-reply-box">
					{showReply ? (
						<div>
							<IQComment
								onChange={(event: any) => {
									setQuery(event.target.value);
								}}
								onButtonClick={() => {
									commentHandleClick(id);
								}}
								placeholder={'Enter your reply'}
							/>
							<div className="privacy-settings">
								<span className="privacy-toggle-label">
									Mark my response as
								</span>
								<ToggleButtonGroup
									exclusive
									className="privacy-toggle"
									value={replyType}
									onChange={onReplyTypeChange}
								>
									<ToggleButton className="privacy-toggle-btn" value={0}>
										Private
									</ToggleButton>
									<ToggleButton className="privacy-toggle-btn" value={1}>
										Public
									</ToggleButton>
								</ToggleButtonGroup>
							</div>
						</div>
					) : (
						<Button
							className="post-reply-btn"
							variant="outlined"
							startIcon={<Reply />}
							onClick={() => setShowReply(true)}
						>
							Reply
						</Button>
					)}
				</div>
			) : ''}
		</>
	);
};

export default PostList;