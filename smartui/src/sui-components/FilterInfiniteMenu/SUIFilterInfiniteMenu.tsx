import React, { useEffect, useState, useRef } from "react";
import "./SUIFilterInfiniteMenu.scss";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { MenuItem, Button, ListSubheader } from "@mui/material";
import ReactDom from "react-dom";


const SUIFilterInfiniteMenu = (props: any) => {
  const [toggleDropDown, setToggleDropDown] = useState<any>(false);
  const [menuItemsData, setMenuItemsData] = useState<any>(props.menusData || []);
  const [identifier, setIdentifier] = useState<any>(props.identifier || 'hierarchy');
  const menuRef = useRef<any>(null);
//   console.log("filter menu", props.menusData);
  let selectedIdentifiers: any = [];

  /**
   * Adding a parent record to each children in recursive way
   * @param data Array of menu records
   * @author Srinivas Nadendla
   */
  const addParentToChildRecords = (data: any) => {
    (data || []).forEach((rec: any) => {
      if (rec.children?.length > 0) {
        rec.children.forEach((child: any) => (child["parentRecord"] = rec));
        addParentToChildRecords(rec.children);
      }
    });
  };

/**
 * Formatting the menusData to required format and setting the updated data to state.
*/
    useEffect(() => {
      if (props?.menusData?.length > 0) {
        let formattedData = [...(props.menusData || [])];
        addParentToChildRecords(formattedData);
        setMenuItemsData(formattedData);
      }
    }, [props.menusData]);

  /**
   * Triggers on mouse enter for li item . Marking the other records in active which are not focused
   * @param data 
   * @author Srinivas
   */
  const markInActive = (data: any) => {
    (data || []).forEach((item: any) => {
      item.isActive = false;
      if (item?.children?.length > 0) markInActive(item.children);
    });
  };

  /**
   * Triggers on check bpx change. Marking all the child nodes to true when parent is checked
   * @param currentChildren array of children records if exists
   * @param value current checked value true/false
   * @param recordId for future use
   * @author Srinivas Nadendla
   */
  const markIsChecked = (
    currentChildren: any,
    value: boolean,
    recordId: any
  ) => {
    (currentChildren || []).forEach((item: any) => {
      item.isChecked = value;
      if (item?.children?.length > 0)
        markIsChecked(item.children, value, recordId);
    });
  };

  /**
   * Finds and updates the all parent record's checked state based on Id & selection in recursive way
   * @param data Array of data
   * @param recordId Selected record id
   * @param checkState boolean - true - if all items in that level are selected.
   * @returns void
   * @author Srinivas Nadendla
   */
  const updateRecordCheckState = (
    data: any,
    recordId: any,
    checkState: boolean,
    isAtLeastOneChecked: boolean
  ) => {
    for (let item of data) {
      if (item.id === recordId) {
        item.isChecked = checkState;
        item.isAtLeastOneChecked = isAtLeastOneChecked;
        markParent(item.parentRecord, checkState, item.parentRecord.id);
        return;
      }
      if (item?.children?.length > 0) {
        updateRecordCheckState(item?.children, recordId, checkState, isAtLeastOneChecked);
      }
    }
  };

  const findAndUpdateRecord = (recordId: any, checkState: boolean, isAtLeastOneChecked: boolean) => {
    let wholeData: any = [...menuItemsData];
    updateRecordCheckState(wholeData, recordId, checkState, isAtLeastOneChecked);
    setMenuItemsData(wholeData);
  };

/**
 * Triggers On selection change - using it to mark paeent checkboxes true/false based on child selection.
 * @author Srinivas Nadendla
 */

  const markParent = (parentRecord: any, value: boolean, recordId: any) => {
    if (parentRecord.children?.length > 0) {
      let isAllChecked = true;
      let isAtLeastOneChecked = false;
      let noneChecked = false;
      (parentRecord.children || []).forEach((item: any) => {
        if (!item.isChecked) {
          isAllChecked = false;
        } 
      });
      noneChecked = (parentRecord.children || []).every((item:any)=>item.isChecked === false);
      isAtLeastOneChecked = isAllChecked ? false : (noneChecked ? false : (parentRecord.children || []).some((item:any)=>item.isChecked === true));
      findAndUpdateRecord(recordId, isAllChecked, isAtLeastOneChecked);
      if (parentRecord?.parentRecord?.id)
        markParent(
          parentRecord.parenRecord,
          value,
          parentRecord.parenRecord.id
        );
    }
  };

  /**
   *  Resets all checkboxes to uncheked state.
   * @param data  array of parent/children data
   * @author Srinivas Nadendla
   */
  const clearSelections = (data: any)=>{
    (data || []).forEach((item: any) => {
        item.isChecked = false;
        if (item?.children?.length > 0)
        clearSelections(item.children);
      });
  };

  /**
   * Triggerrs on clear button click
   * @author Srinivas Nadendla
   */
  const onClearBtnClick = ()=> {
    const records = [... menuItemsData];
    clearSelections(records);
    setMenuItemsData(records);
  };


  const getCheckBoxField = (rec: any)=> {
    const [selectedMenuRec, setSelectedMenuRec] = useState<any>({});
    
        return (
          <>
          <input
            type="checkbox"
            checked={!!rec.isChecked || false}
            onChange={(e) => {
              e.stopPropagation();
              rec.isChecked = e.target.checked;
              markIsChecked(rec.children, e.target.checked, rec.id);
              setSelectedMenuRec(rec);
              if (rec.parentRecord)
                markParent(rec.parentRecord, e.target.checked, rec.parentRecord.id);
            }}
          />
          
          </>
        );
  };

  const updateMenuPosition =(e: any)=> {
    setTimeout(() => {
      const bodyWidth = document.getElementsByTagName("body")[0].clientWidth;
      const targetOffsetWidth =
        e.target.getBoundingClientRect().left +
        e.target.getBoundingClientRect().width;
      const childMenuWidth = e.target.children?.[1]?.clientWidth;
      if (bodyWidth - targetOffsetWidth < childMenuWidth + 100) {
        e.target.children[1].style.left =
          "-" + e.target.children[1].clientWidth + "px";
      }
    }, 300);
  };

  /**
   * Based on passed data generates the infinite menus in recursive way
   * @param data 
   * @param isFirstTime boolean value - used to add clear & filter by text
   * @returns Menu template
   * @author Srinivas Nadedla
   */
  const getMenus = (data: any, isFirstTime: Boolean) => {
    const [activeMenuRec, setActiveMenuRec] = useState<any>({});
    const [selectedMenuRec, setSelectedMenuRec] = useState<any>({});

    return (
     <ul className="sui-filter-dropdown-menu" >
     {isFirstTime && (
       <>
         <ListSubheader
           sx={{
             fontWeight: "600 !important",
               lineHeight: '1.8 !important',
               paddingLeft: "6px",
               backgroundColor:'white !important',
               fontFamily: 'RobotoRegular !!important',
               fontSize: '0.875rem !important'
         }}
         >
           Filter By
         </ListSubheader>
         <MenuItem
           sx={{ marginTop: 1, marginBottom: 1, paddingLeft: "6px" }} onClick={()=> onClearBtnClick()}
         >
           <em>Clear</em>
         </MenuItem>
       </>
     )}

     {(data || []).map((rec: any) => {
       return (
         <React.Fragment key={rec.value}>
           {rec.children?.length > 0 && (
             <li
               className={
                 "sui-filter-dropdown-submenu " +
                 (activeMenuRec && rec.isActive ? "is-open " : "") + (rec.isAtLeastOneChecked ? 'partial-checked ': '')
               }
               onMouseEnter={(e) => {
                updateMenuPosition(e);
                 //Mark isActive to false for current and all it's children.
                 markInActive(data);
                 rec.isActive = true;
                 setActiveMenuRec(rec);
               }}
               onMouseLeave= {()=>{
                 rec.isActive = false
                 markInActive(data);
                 setActiveMenuRec({});
               }}
             >
               <div className="sui-filter-dropdown-menu_list-container">
                 <div className="sui-filter-dropdown-menu_list-check-text-wrapper">
                   {getCheckBoxField(rec)}
                   {rec.isAtLeastOneChecked && <span className="sui-filter-dropdown-menu_indeterminate-state"></span>}
                   <div className="sui-filter-dropdown-menu_list-text">
                     {rec.value}
                   </div>
                 </div>
                 <div className="caret">
                   <ArrowForwardIosIcon />
                 </div>
               </div>
               {getMenus(rec.children, false)}
             </li>
           )}
           {(!rec?.children || rec?.children?.length === 0) && (
             <li
               className={
                 rec.children?.length > 0
                   ? "sui-filter-dropdown-submenu"
                   : ""
               }
               onMouseEnter={() => {
                 //Mark isActive to false for current and all it's children.
                 markInActive(data);
                 rec.isActive = true;
                 setActiveMenuRec(rec);
               }}

               onMouseLeave= {()=>{
                 rec.isActive = false
                 markInActive(data);
                 setActiveMenuRec({});
               }}

           
             >
               <div className="sui-filter-dropdown-menu_list-container">
                 <div className="sui-filter-dropdown-menu_list-check-text-wrapper">
                  {getCheckBoxField(rec)}
                   <div className="sui-filter-dropdown-menu_list-text">
                     {rec.value}
                   </div>
                 </div>
               </div>
             </li>
           )}
         </React.Fragment>
       );
     })}
     </ul>
    );
  };

  /**
   * Plucks out the identifier from the menuItemsData based on isChecked.
   * @param data Array of objects
   * @author Srinivas Nadendla
   */
  const getSelectedIdentifiersList = (data: any)=> {
    (data || []).forEach((rec: any)=> {
      if (rec.isChecked) {
        if (rec[identifier]) {
          selectedIdentifiers.push(rec[identifier]);
        }
      } else {
        if (rec?.children?.length > 0) {
          getSelectedIdentifiersList(rec.children);
        }
      }
    })
  };

  useEffect(()=>{
    setToggleDropDown(props.toggleDropDown);
  },[props.toggleDropDown])

  useEffect(()=>{
    if (!toggleDropDown) {
      selectedIdentifiers = [];
      getSelectedIdentifiersList(menuItemsData);
      props.onSelectionChange(selectedIdentifiers);
    }
  },[toggleDropDown]);

  // const handleOutsideClick = (e: any)=> {
  //     if (!menuRef.current.contains(e.target)) setToggleDropDown(false);
  // };
  
  // useEffect(()=>{
  //   document.addEventListener("click",handleOutsideClick);

  //   return ()=> document.removeEventListener("click", handleOutsideClick);
  // },[]);

  const MenuTmpl = ()=>{
    return <div style={{top: props.filterIconPos?.clientY + 'px', left: props.filterIconPos?.clientX +  'px'}} ref={menuRef} className={"sui-filter-dropdown " + (toggleDropDown ? "open" : "")}>
   {menuItemsData && getMenus(menuItemsData, true)}
  </div>
  };

  const el = useRef(document.createElement('div'));
    useEffect(() => {
      
        const portal:any = document.body;
        portal.appendChild(el.current);

        return () => {
            portal.removeChild(el.current);
        };

    }, [props.children]);

  const Backdrop = (props: any) => {
    return <div className="filter-menu-backdrop" onClick={()=>setToggleDropDown(false)}></div>;
  };

  const Modal = (props: any) => {
    return (
      <>
        {ReactDom.createPortal(
          <Backdrop />,
          el.current
        )}
        {ReactDom.createPortal(
         <MenuTmpl /> ,
          el.current
        )}
        
      </>
    );
  };

  return (
    <>
    
    {toggleDropDown && <Modal />}
    </>
    
    //<div className="sa-sui-filter-menu" ref={menuRef}>
      // <div ref={menuRef} className={"sui-filter-dropdown " + (toggleDropDown ? "open" : "")}>
      //   {menuItemsData && getMenus(menuItemsData, true)}
      // </div>
    //</div>
  );
};

export default SUIFilterInfiniteMenu;
