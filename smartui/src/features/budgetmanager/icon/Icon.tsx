import IcoMoon, { IconProps, iconList } from "react-icomoon";
import iconSet from "./selection.json";

const Icon = (props: IconProps) => <IcoMoon iconSet={iconSet} {...props} />;

export default Icon;