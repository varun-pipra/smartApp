import { Button } from "@ui5/webcomponents-react"

export default (props: any) => {
  if (props.icon) {
    return (
      <Button 
        icon={`${props.icon}`}>
      </Button>
    )
  } else {
    return ""
  }

}