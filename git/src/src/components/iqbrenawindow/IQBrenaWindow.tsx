import { useEffect, memo, ReactNode } from "react";
import "./IQBrenaWindow.scss";
import BaseWindow from "components/iqbasewindow/IQBaseWindow";
import { IQBaseWindowProps } from "components/iqbasewindow/IQBaseWindowTypes";

type IQBrenaWindowProps = IQBaseWindowProps & {
  leftPanel?: any;
  rightPanel?: any;
  mainWindowClsName?: any;
  resize?: boolean;
  brenaLogo?: any;
  isBrenaOpen?:boolean;
  titleMessage?: ReactNode;
};

const IQBrenaWindow = ({
  leftPanel,
  rightPanel,
  resize = false,
  brenaLogo,
  isBrenaOpen = false,
  titleMessage,
  ...props
}: IQBrenaWindowProps) => {
  useEffect(() => {
    const loader = document.getElementById("smartapp-react-loader");
    if (loader) {
      loader.style.display = "none";
    }
  });

  const defaultProps = {
    title: (
      <div className="iq-brena-title">
        <img src={brenaLogo} alt="Brena Logo" />
      </div>
    ),
    tools: {
      closable: true,
      resizable: true,
    },
    PaperProps: {
      sx: {
        width: "100%",
        height: "100%",
      },
    },
  };

  return (
    <BaseWindow
      className={"iq-brena-window " + props.mainWindowClsName}
      {...defaultProps}
      {...props}
      centerPiece={titleMessage}
      isBrenaOpen={isBrenaOpen}
    >
      <div className="iq-brena-cont">
        <div
          style={{ width: resize ? "26%" : "40%" }}
          className="iq-brena-left-panel"
        >
          {leftPanel}
        </div>
        <div
          style={{ width: resize ? "74%" : "60%" }}
          className="iq-brena-right-panel"
        >
          {rightPanel}
        </div>
      </div>
    </BaseWindow>
  );
};

export default memo(IQBrenaWindow);
