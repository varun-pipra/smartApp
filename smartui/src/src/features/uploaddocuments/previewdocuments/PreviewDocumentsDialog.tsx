import Button from "@mui/material/Button";
import SmartDialog from "components/smartdialog/SmartDialog";
import React from "react";
import { Document } from '../UploadDocumentsDialog';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import RotateLeftTwoToneIcon from '@mui/icons-material/RotateLeftTwoTone';
import RotateRightTwoToneIcon from '@mui/icons-material/RotateRightTwoTone';
import { Card, Box } from "@mui/material";
import Toast from "components/toast/Toast";
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import './PreviewDocumentsDialog.scss'
import IQTooltip from "components/iqtooltip/IQTooltip";
interface PreviewDocumentsDialogProps {
	open: boolean;
	documents: Document[];
	previewDocumentId: number;
	onClose?: () => void;
}
export default function PreviewDocumentsDialog(props: PreviewDocumentsDialogProps) {
	const { open, documents, previewDocumentId, onClose } = props;
	const totalDocuments = documents.length;
	const [id, setId] = React.useState<number>(previewDocumentId);
	const [rotation, setRotation] = React.useState<number>(0);
	const [toastMessage, setToastMessage] = React.useState<string>(previewDocumentId + " of " + totalDocuments);
	const [showLeftIcon, setShowLeftIcon] = React.useState<boolean>(previewDocumentId > documents[0].id ? true : false);
	const [showRightIcon, setShowRightIcon] = React.useState<boolean>(documents[totalDocuments - 1].id > previewDocumentId ? true : false);
	const [imageStyle, setImageStyle] = React.useState<any>({
		height: '90%',
		width: '76%'
	})

	function handleRightButton() {
		setId(id + 1)
		const rightValue: boolean = id + 1 === documents[totalDocuments - 1].id ? false : true;
		const leftValue: boolean = id + 1 === documents[0].id ? false : true;
		setShowRightIcon(rightValue)
		setShowLeftIcon(leftValue)
		setToastMessage(id + 1 + " of " + totalDocuments)
	}

	function handleLeftButton() {
		setId(id - 1)
		const leftValue: boolean = id - 1 === documents[0].id ? false : true;
		const rightValue: boolean = id - 1 === documents[totalDocuments - 1].id ? false : true;
		setShowLeftIcon(leftValue)
		setShowRightIcon(rightValue)
		setToastMessage(id - 1 + " of " + totalDocuments)
	}

	function handleRotateRight() {
		let newRotation = rotation + 90;
		if (newRotation >= 360) {
			newRotation = - 360;
		}
		setRotation(newRotation);
	}

	function handleRotateLeft() {
		let newRotation = rotation - 90;
		if (newRotation >= 360) {
			newRotation = - 360;
		}
		setRotation(newRotation);
	}

	function handleZoomIn() {
		// if(imageStyle.height < '250%') {
		const height = parseFloat(imageStyle.height) + 10 + '%'
		const width = parseFloat(imageStyle.width) + 10 + '%'
		setImageStyle({ height: height, width: width })
		// }
	}
	function handleZoomOut() {
		if (imageStyle.height > '10%') {
			const height = parseFloat(imageStyle.height) - 10 + '%'
			const width = parseFloat(imageStyle.width) - 10 + '%'
			setImageStyle({ height: height, width: width })
		}
	}
	function handleSetToOriginal() {
		setImageStyle({ height: '90%', width: '76%' });
	}
	return (
		<SmartDialog
			open={open}
			PaperProps={{
				sx: { height: "90%", width: "80%" },
			}}
			custom={{
				closable: true,
				title: documents[id - 1].name
			}}
			onClose={onClose}
		>
			<Stack className='preview-container'>
				<Card className='header-section'>
					<Stack direction='row' spacing={2} >
						<IQTooltip title={"Rotate Right"}>
							<RotateRightTwoToneIcon onClick={handleRotateRight} className='rotateright' />
						</IQTooltip>
						<IQTooltip title={'Rotate Left'}>
							<RotateLeftTwoToneIcon onClick={handleRotateLeft} className='rotateleft' />
						</IQTooltip>
					</Stack>
				</Card>
				<Stack direction='row' className='preview-content-section'>

					<Box className="leftarrow-section" display='flex' alignItems='center'>
						{showLeftIcon ? <ChevronLeftIcon className="leftarrow" onClick={handleLeftButton} /> : null}
					</Box>

					<Box className='image-section'>
						<img src={documents[id - 1].image} key={'img'} style={{ ...imageStyle, transform: `rotate(${rotation}deg)` }} />
					</Box>
					<Box className="rightarrow-section" display='flex' alignItems='center' >
						{showRightIcon ? <ChevronRightIcon className="rightarrow" onClick={handleRightButton} /> : null}
					</Box>


				</Stack>
				<Stack direction='row' className="fottersection">
					<Box style={{ width: '12%' }}></Box>
					<Box style={{ width: '76%', textAlign: 'center', padding: '4px 0px 0px 0px' }}>
						<span className='image-count'>{toastMessage}</span>
					</Box>
					<Box style={{ width: '12%' }}>
						<AddIcon className='icon' onClick={handleZoomIn} />
						<ZoomInMapIcon className='icon' onClick={handleSetToOriginal} />
						<RemoveIcon className='icon' onClick={handleZoomOut} />
					</Box>
				</Stack>
			</Stack>
		</SmartDialog>
	)

}