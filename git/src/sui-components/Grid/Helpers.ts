import { RowNode } from "ag-grid-enterprise";
import convertDateToDisplayFormat from "utilities/commonFunctions";
import { minmaxDate } from "utilities/commonFunctions";
import AvatarImgRenderer from "./renderers/AvatarImgRenderer";
import AvatarInitialsRenderer from "./renderers/AvatarInitialsRenderer";
import CountRenderer from "./renderers/CountRenderer";
import DateRenderer from "./renderers/DateRenderer";
import DropdownRenderer from "./renderers/DropdownRenderer";
import LinkRenderer from "./renderers/LinkRenderer";

export abstract class Helpers {
  public static supportedTypes = [
    "avatar",
    "negativeNumber",
    "positiveNumber",
    "number",
    "negativeCurrency",
    "positiveCurrency",
    "currency",
    "date",
    "dropdown",
  ];

  static getTypeConfig(obj: any, appCfg: any): any {
    let type: string = obj["type"];
    let cfg: any = {};
    cfg["enableCellChangeFlash"] = appCfg?.enableCellFlash;
    // appCfg?.enableCellFlash ? cfg['enableCellChangeFlash'] = true : cfg['enableCellChangeFlash'] = false;
    switch (type) {
      case "numeric":
        cfg["type"] = "rightAligned";
        break;
      case "currency":
        cfg["type"] = "rightAligned";
        cfg["cellRenderer"] = (params: any) => {
          return params.value
            ? appCfg.currencySymbol +
                " " +
                params?.value?.toLocaleString("en-US")
            : "";
        };
        break;
      case "coloredNumeric":
        cfg["type"] = "rightAligned";
        cfg["cellStyle"] = (params: any) => {
          if (params.value < 0) {
            return { color: "red" };
          }
          if (params.value > 0) {
            return { color: "green" };
          }
        };
        break;

      case "coloredCurrency":
        cfg["type"] = "rightAligned";
        cfg["cellRenderer"] = (params: any) => {
          let op = params.value >= 0 ? "(+)" : "(-)";
          return params.value
            ? `${appCfg.currencySymbol} ${params?.value?.toLocaleString(
                "en-US"
              )} ${op}`
            : "";
        };
        cfg["cellStyle"] = (params: any) => {
          if (params.value < 0) {
            return { color: "red" };
          }
          if (params.value > 0) {
            return { color: "green" };
          }
        };
        break;
      case "avatar":
        cfg["cellRenderer"] = AvatarImgRenderer;
        break;
      case "avatarInitials":
        cfg["cellRenderer"] = AvatarInitialsRenderer;
        break;
      case "rightText":
        cfg["type"] = "rightAligned";
        break;
      case "leftText":
        // cfg['type'] = "leftAligned";
        break;
      case "date":
        cfg["valueGetter"] = (params: any) => {
          return params.value ? convertDateToDisplayFormat(params.value) : "";
        };
        if (obj["editable"]) {
          cfg["cellRenderer"] = DateRenderer;
        }
        break;
      case "link":
        cfg["cellRenderer"] = LinkRenderer;
        break;
      case "dropdown":
        if (obj["editable"]) {
          cfg["cellRenderer"] = DropdownRenderer;
          cfg["cellRendererParams"] = {
            options: obj["options"],
          };
        }
        break;
      // case 'action':
      //     cfg['cellRenderer'] = ActionRenderer,
      //     cfg['cellRendererParams'] = {
      //         icon: obj['icon']
      //     }
      //     break;

      case "showCount":
        cfg["cellRenderer"] = CountRenderer;
        break;

      default:
        cfg = {};
    }

    return cfg;
  }

  public static prepareHeaders(userSpecifiedHeaders: any, appCfg: any): any {
    const finalHeaders = userSpecifiedHeaders?.map((it: any) => {
      let cfg = this.getTypeConfig(it, appCfg);
      it = Object.assign(it, cfg);

      return it;
    });

    return finalHeaders;
  }

  public static generatePinnedBottomData(
    gridApi: any,
    gridColumnApi: any,
    pinnedBottomRowConfig: any
  ) {
    // generate a row-data with null values
    let result: any = {};

    gridColumnApi.getAllGridColumns().forEach((item: any) => {
      result[item.colId] =
        pinnedBottomRowConfig.displayFields[item.colId] || null;
    });

    return this.calculatePinnedBottomData(
      gridApi,
      result,
      pinnedBottomRowConfig
    );
  }

  public static calculatePinnedBottomData(
    gridApi: any,
    target: any,
    pinnedBottomRowConfig: any
  ) {
    //list of columns fo aggregation
    let columnsWithAggregation = pinnedBottomRowConfig.aggregateFields;
    columnsWithAggregation?.forEach((element: any) => {
      let formattedDateValues: any = [];
      gridApi.forEachNodeAfterFilter((rowNode: RowNode) => {
        //if(rowNode.index < 10){
        //console.log(rowNode);
        //}
        if (element?.fieldType === "date") {
          if (rowNode?.data?.[element?.field]) {
            formattedDateValues.push(
              convertDateToDisplayFormat(rowNode?.data?.[element?.field])
            );
          }
        } else {
          if (rowNode?.data?.[element]) {
            target[element] += Number(Number(rowNode.data[element]).toFixed(2));
          }
        }
      });
      if (element?.fieldType === "date" && formattedDateValues.length > 0) {
        target[element?.field] = minmaxDate(formattedDateValues, element?.type);
      }
      if (target?.[element]) {
        // target[element] = `Balance Sum: ${target[element].toFixed(2)}`;
        target[element] = `${target[element].toLocaleString("en-US")}`;
      }
    });
    //console.log(target);
    return target;
  }
}
