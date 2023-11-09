import './LienFileViewer.scss';

import React, { useMemo } from 'react';

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

export interface FileViewerProps {
	filesToView?: any;
	closeFileViewer?: any;
	openContracts?: any;
	showClose?: boolean;
};

const LienFileViewer = (props: FileViewerProps) => {
	const {
		filesToView,
		closeFileViewer,
		openContracts,
		showClose = true,
	} = props;

	const closeViewer = () => {
		closeFileViewer();
	};

	const renderContent = useMemo(
		() => (
			<div className="file-viewer-cont">
				{filesToView?.length ? (
					<div className="file-viewer-view">
						<div className="file-viewer-heading">
							<p className="file-viewer-header">
								Contract's Final Release and waiver of lien
							</p>
							{showClose && (
								<div className="closeicon" onClick={closeViewer}>
									<span className="common-icon-Cancel"></span>
								</div>
							)}
						</div>
						<DocViewer
							prefetchMethod="GET"
							documents={filesToView}
							config={{
								header: {
									disableHeader: false,
									disableFileName: false,
									retainURLParams: false,
								},
							}}
							pluginRenderers={DocViewerRenderers}
							style={{ height: 350 }}
						/>
					</div>
				) : (
					<div className="file-empty-viewer" onClick={openContracts}>
						<span className="common-icon-lien-waiver"></span>
						<div className="empty-text">Click here to add Lien Waiver File</div>
					</div>
				)}
			</div>
		),
		[filesToView]
	);
	return renderContent;
};

export default LienFileViewer;
