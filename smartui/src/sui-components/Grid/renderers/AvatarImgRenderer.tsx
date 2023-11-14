import { Avatar } from "@ui5/webcomponents-react"

export default (props: any) => {
  if (props.value) {
    return (
      <Avatar size="XS" className="avtar-img">
        <img src={`${props.value}`} />
      </Avatar>
    )
  } else {
    return ""
  }

}