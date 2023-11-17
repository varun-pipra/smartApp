import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import { makeStyles } from '@mui/styles';
import { useAppSelector } from 'app/hooks';
import { getSketchIns, getSketchPageInfo } from 'app/common/appInfoSlice';
import SMBrenaRightPanel from './rightPanel/SMBrenaRightPanel';
import ReSizeIcon from 'resources/images/dragger.jpg';
import { Box } from '@mui/material';
import useWindowSize from '../WindowReSize';
const useStyles: any = makeStyles(() => ({
    root: {
        flexGrow: 1,
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        display: 'flex',
        width: '100%',
        "& .MuiDrawer-root": {
            position: 'unset',
            "& .MuiPaper-root": {
                height: 'calc(100% - 5em) !important'
            }
        }
    },
    drawerPaper: {

    },
    content: {
        flexGrow: 1
    },
    dragger: {
        width: '25px',
        height: '25px',
        cursor: 'ew-resize',
        padding: '2px',
        border: '1px solid #ddd',
        position: 'absolute',
        left: '2px',
        bottom: 0,
        zIndex: '99999',
        backgroundColor: '#fff',
        borderRadius: '50%',
        top: '50%',
        boxShadow: '0px 0px 4px 2px #dadada',
    }
}));
export default function CustomDrawer(props: any) {
    const { resizePanel, ...rest } = props;
    const sketchInstance = useAppSelector(getSketchIns);
    const [docViewerins, setDocViewerins] = React.useState<any>({});
    const [state, setState] = React.useState<any>({
        mobileOpen: false,
        isResizing: false,
        lastDownX: 0,
        newWidth: {}
    });
    const defaultDrawerWidth = resizePanel ? 'calc(100% - 26%)' : 'calc(100% - 40%)';
    const isCompMountedOnce = React.useRef(false);
    const [width, height] = useWindowSize();
    const [drawerWidth, setDrawerWidth] = React.useState<any>(defaultDrawerWidth);
    const classes = useStyles();
    React.useEffect(() => {
        if (resizePanel) {
            docViewerins?.rerenderCanvas();
            setDrawerWidth('calc(100% - 26%)')
        } else {
            // docViewerins?.rerenderCanvas();
            setDrawerWidth('calc(100% - 40%)')
        }
    }, [resizePanel])
    React.useEffect(() => {
        if (width && height && isCompMountedOnce?.current) {
            const containerWidth: any = document.querySelector('.iq-brena-cont')?.getBoundingClientRect()?.width;
            const leftPanelWidth: any = document.querySelector('.iq-brena-left-panel')?.getBoundingClientRect()?.width;
            docViewerins?.rerenderCanvas();
            setDrawerWidth(containerWidth - leftPanelWidth);
        }
    }, [width, height])
    React.useEffect(() => {
        setDocViewerins(sketchInstance);
    }, [sketchInstance]);
    const handleMousedown = (e: any) => {
        setState({ isResizing: true, lastDownX: e.clientX });
        window.addEventListener("mousemove", handleMousemove);
        window.addEventListener("mouseup", handleMouseup);
        isCompMountedOnce.current = true;
    };

    const handleMousemove = (e: any) => {
        // we don't want to do anything if we aren't resizing.
        if (!state.isResizing) {
            return;
        };
        const containerWidth: any = document.querySelector('.iq-brena-cont')?.getBoundingClientRect()?.width;
        const leftPanelWidth: any = document.querySelector('.iq-brena-left-panel')?.getBoundingClientRect()?.width;
        let offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
        if (offsetRight <= (containerWidth - 200) && offsetRight >= (containerWidth - leftPanelWidth)) {
            docViewerins?.rerenderCanvas();
            setDrawerWidth(offsetRight);
            setState({ newWidth: { width: offsetRight } });
        }
    };

    const handleMouseup = (e: any) => {
        setState({ isResizing: false });
        window.removeEventListener("mousemove", handleMousemove);
        window.removeEventListener("mouseup", handleMouseup);
    };
    React.useEffect(() => {
        if (state?.isResizing) {
            window.addEventListener("mousemove", handleMousemove);
            window.addEventListener("mouseup", handleMouseup);
        };
    }, [state]);
    React.useEffect(() => {
        setTimeout(() => {
            document
              .querySelector(".iq-brena-right-panel .MuiPaper-root")
              ?.removeAttribute("tabindex");
          }, 1000);
    },[])
    return (
        <div className={classes.root}>
            <Drawer
                hideBackdrop={true}
                variant="temporary"
                anchor={'right'}
                open={true}
                elevation={8}
                PaperProps={{
                    style: {
                        top: '80px', position: 'absolute', right: '0px', height: 'calc(100% - 5em) !important',
                        minWidth: drawerWidth, width: drawerWidth, boxShadow: '-2px 1px 8px #0000001a', whiteSpace: 'nowrap'
                    }
                }}
                ModalProps={{
                    disablePortal: true,
                    // hideBackdrop: true
                }}
            >
                {/* <div
                    id="dragger"
                    onMouseDown={(e: any) => handleMousedown(e)}
                    className={classes.dragger}
                > */}
                <Box component='img'
                    src={ReSizeIcon}
                    id="dragger"
                    className={classes.dragger}
                    alt='Resize Icon'
                    onMouseDown={(e: any) => handleMousedown(e)}
                />

                {/* </div> */}
                <SMBrenaRightPanel />
            </Drawer>
        </div>
    );
}
