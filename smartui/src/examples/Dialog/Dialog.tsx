
import Button from "@mui/material/Button";
import * as React from "react";

import SUIDialog from "sui-components/Dialog/Dialog"

const DialogExample = (props: any) => {

	const [isFullView, setIsFullView] = React.useState(false);
	const presenceId = 'budgetmanager-presence';

	const onClose = (event: any, reason: any) => {

	}

	return (
		<SUIDialog
			open={true}
			PaperProps={{
				sx: { height: "90%", width: "95%" },
			}}
			className={"custom-style"}
			headerTitle="Untitled Dialog"
			iframeId="budgetManagerIframe"
			toolsOpts={{
				closable: true,
				resizable: true,
				openInNewTab: true
			}}
			presenceId={presenceId}
			presenceToolsOpts={{
				showLiveSupport: true,
				showLiveLink: true,
				showStreams: true,
				showComments: true,
				showChat: true,
				hideProfile: false
			}}
			onClose={onClose}
			isFullView={isFullView}
			buttons={
				<>
					<Button>Cancel</Button>
					<Button variant="contained">Save</Button>
				</>
			}
		>
		</SUIDialog>
	);
}

export default DialogExample;