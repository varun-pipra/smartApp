import { Avatar } from "@ui5/webcomponents-react"

export default (props: any) => {
  if (props.value) {
    return (
      <Avatar initials={`${props.value}`} size="XS">
      </Avatar>
    )
  } else {
    return ""
  }
}