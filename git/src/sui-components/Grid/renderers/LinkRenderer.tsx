export default (props: any) => {
  if (props.value) {
    return (
      <a style={{
        color: "rgb(5, 144, 205)",  //TODO: use the SCSS variable
        cursor: "pointer"
      }}
      >
        {`${props.value}`}
      </a>
    )
  } else {
    return ""
  }

}