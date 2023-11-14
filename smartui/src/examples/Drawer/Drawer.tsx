
import * as React from "react";

import SUIDrawer from "sui-components/Drawer/Drawer";

const DrawerExample = (props: any) => {
    return (
        <SUIDrawer
            PaperProps={{ style: { position: "absolute", width: "60vw" } }}
            anchor="right"
            variant="permanent"
            elevation={8}
            open={false}
        >
            Place add the content here.
        </SUIDrawer>
    );
}

export default DrawerExample;