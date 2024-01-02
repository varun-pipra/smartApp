import SUIDrawer from "sui-components/Drawer/Drawer";
import SUIDialog from "sui-components/Dialog/Dialog";

interface SUIDetailsPanelProps {
	mode?: any;
}

const SUIDetailsPanel = (props: SUIDetailsPanelProps) => {

	const {mode} = props;

	return (
		<>
			{mode === 'drawer' && (
				<SUIDrawer>
					Add content here.
				</SUIDrawer>
			)}

			{mode === 'dailog' && (
				<SUIDialog
					headerTitle='Details panel testing'
					open={true}>
				</SUIDialog>
			)}
		</>
	);
};

SUIDetailsPanel.defaultProps = {
	mode: 'drawer'
}

export default SUIDetailsPanel;
