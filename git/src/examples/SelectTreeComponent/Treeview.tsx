import * as React from "react";
import {Box, Checkbox} from "@mui/material";
import Typography from "@mui/material/Typography";
import MailIcon from "@mui/icons-material/Mail";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SvgIconProps } from "@mui/material/SvgIcon";
// import { TreeView } from "@mui/x-tree-view/TreeView";
// import {
//   TreeItem,
//   TreeItemProps,
// } from "@mui/x-tree-view/TreeItem";
import { hideLoadMask } from "app/hooks";

// type StyledTreeItemProps = TreeItemProps & {
//   labelIcon: React.ElementType<SvgIconProps>;
//   labelText: string;
// };
const treeData = [
  {
    nodeId: '1',
    nodeName: "Root 1",
    label : "Root 1",
    value : '1',
    children: [
      {
        nodeId: '2',
        nodeName: "Child 1.1",
        label : "Child 1.1",
        value : '2',
        children: [
          { nodeId: 3, nodeName: "Grandchild 1.1.1", label : "Grandchild 1.1.1", value : '3' },
          { nodeId: 4, nodeName: "Grandchild 1.1.2", label : "Grandchild 1.1.2", value : '4' },
        ],
      },
      { nodeId: 5, nodeName: "Child 1.2", label : "Child 1.2", value : '5' },
    ],
  },
  {
    nodeId: "6",
    nodeName: "Root 2",
    label : "Root 2", value : '6',
    children: [
      {
        nodeId: "7",
        nodeName: "Child 2.1",
        label : "Child 2.1", value : '7' ,
        children: [
          { nodeId: 8, nodeName: "Grandchild 2.1.1",  label : "Grandchild 2.1.1", value : '8' },
          { nodeId: 9, nodeName: "Grandchild 2.1.2",  label : "Grandchild 2.1.2", value : '9' },
        ],
      },
      { nodeId: 10, nodeName: "Child 2.2" ,  label : "Child 2.2", value : '10' },
    ],
  },
];

// const StyledTreeItem = (props: StyledTreeItemProps) => {
//   const { nodeId, labelIcon: LabelIcon, labelText, ...other } = props;
//   console.log("ddsufuidsf", props);
//   const handleChange= (e:any, id:any) => {};
//   // return (
//   //   <TreeItem 
//   //     // sx={{background : ['1', '2','6','7'].includes(nodeId) ? '#fff9cc' : '#fff'}}
//   //     nodeId={nodeId}
//   //     label={
//   //       <Box
//   //         sx={{   
//   //           display: "flex",
//   //           alignItems: "center",
//   //           p: 0.5,
//   //           pr: 0,
//   //         }}
//   //       >
//   //         <Checkbox size="small" checked={['1', '2','6','7'].includes(nodeId)} onChange={(e:any) => handleChange(e, nodeId)}/>
//   //         <Box 
//   //         component={LabelIcon}
           
//   //          color="inherit" sx={{ mr: 1 }} />
//   //         <Typography
//   //           variant="body2"
//   //           sx={{ fontWeight: "inherit", flexGrow: 1 }}
//   //         >
//   //           {labelText}
//   //         </Typography>
//   //       </Box>
//   //     }
//   //     {...other}
//   //   />
//   // );
// };

const MultiSelectTreeView = () => {
  const [selected, setSelected] = React.useState([]);

  React.useEffect(() => {
    hideLoadMask();
  }, []);
  const getTreeItemsFromData = (treeItems: any) => {
    return (treeItems || []).map((treeItemData: any, index?: any) => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeItemsFromData(treeItemData.children);
      }
      // return (
      //   <StyledTreeItem
      //     nodeId={treeItemData?.nodeId}
      //     labelText={treeItemData?.nodeName}
      //     labelIcon={index % 2 == 0 ? MailIcon : DeleteIcon}
      //     children={children}
      //   ></StyledTreeItem>
      // );
    });
  };
  // return (
  //   <TreeView
  //     aria-label="gmail"
  //     defaultExpanded={['1', '2','6','7']}
  //     defaultCollapseIcon={<ArrowDropDownIcon />}
  //     defaultExpandIcon={<ArrowRightIcon />}
  //     defaultEndIcon={<div style={{ width: 24 }} />}
  //     multiSelect
  //     selected={selected}
  //     sx={{ height: 264, flexGrow: 1, maxWidth: 210, overflowY: "auto" }}
  //   >
  //     {getTreeItemsFromData(treeData)}
  //   </TreeView>
  // );
};

export default MultiSelectTreeView;


// const treeData = [
//   {
//     "id": "1",
//     "name": "Parent 1",
//     "nodeId" : "1",
//     "label" : "Parent 1",
//     "value" : "1",
//     "children": [
//       {
//         "id": "2",
//         "name": "Child 1",
//         "parent": "1",
//         "nodeId" : "2",
//         "label" : "Child 1",
//         "value" : "2",
//         "children": [
//           {
//             "id": "5",
//             "name": "Grandchild 1",
//             "parent": "2",
//             "nodeId" : "5",
//             "label" : "Grandchild 1",
//             "value" : "5",
//             "children": [
//               {
//                 "id": "9",
//                 "name": "Great-grandchild 1",
//                 "parent": "5",
//                 "nodeId" : "9",
//                 "label" : "Great-grandchild 1",
//                 "value" : "9"
//               },
//               {
//                 "id": "10",
//                 "name": "Great-grandchild 2",
//                 "parent": "5",
//                 "nodeId" : "10",
//                 "label" : "Great-grandchild 2",
//                 "value" : "10"
//               }
//             ]
//           },
//           {
//             "id": "6",
//             "name": "Grandchild 2",
//             "parent": "2",
//             "nodeId" : "6",
//             "label" : "Grandchild 2",
//             "value" : "6",
//             "children": [
//               {
//                 "id": "11",
//                 "name": "Great-grandchild 3",
//                 "parent": "6",
//                 "nodeId" : "11",
//                 "label" : "Great-grandchild 3",
//                 "value" : "11"
//               },
//               {
//                 "id": "12",
//                 "name": "Great-grandchild 4",
//                 "parent": "6",
//                 "nodeId" : "12",
//                 "label" : "Great-grandchild 4",
//                 "value" : "12"
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "id": "3",
//         "name": "Child 2",
//         "parent": "1",
//         "nodeId" : "3",
//         "label" : "Child 3",
//         "value" : "3",
//         "children": [
//           {
//             "id": "7",
//             "name": "Grandchild 3",
//             "parent": "3",
//             "nodeId" : "7",
//             "label" : "Grandchild 3",
//             "value" : "7",
//           }
//         ]
//       }
//     ]
//   },
//   {
//     "id": "4",
//     "name": "Parent 2",
//     "nodeId" : "4",
//     "label" : "Parent 2",
//     "value" : "4",
//     "children": [
//       {
//         "id": "8",
//         "name": "Child 3",
//         "parent": "4",
//         "nodeId" : "8",
//         "label" : "Child 3",
//         "value" : "8",
//         "children": [
//           {
//             "id": "13",
//             "name": "Grandchild 4",
//             "parent": "8",
//             "nodeId" : "13",
//             "label" : "Grandchild 4",
//             "value" : "13",
//             "children": [
//               {
//                 "id": "14",
//                 "name": "Great-grandchild 5",
//                 "parent": "13",
//                 "nodeId" : "14",
//                 "label" : "Great-grandchild 5",
//                 "value" : "14",
//               },
//               {
//                 "id": "15",
//                 "name": "Great-grandchild 6",
//                 "parent": "13",
//                 "nodeId" : "15",
//                 "label" : "Great-grandchild 6",
//                 "value" : "15",
//               }
//             ]
//           },
//           {
//             "id": "16",
//             "name": "Grandchild 5",
//             "parent": "8",
//             "nodeId" : "16",
//             "label" : "Grandchild 5",
//             "value" : "16",
//             "children": [
//               {
//                 "id": "17",
//                 "name": "Great-grandchild 7",
//                 "parent": "16",
//                 "nodeId" : "17",
//                 "label" : "Great-grandchild 7",
//                 "value" : "17",
//               },
//               {
//                 "id": "18",
//                 "name": "Great-grandchild 8",
//                 "parent": "16",
//                 "nodeId" : "18",
//                 "label" : "Great-grandchild 8",
//                 "value" : "18",
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ];