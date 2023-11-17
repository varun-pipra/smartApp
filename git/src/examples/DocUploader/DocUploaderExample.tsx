import DocUploader from "sui-components/DocUploader/DocUploader";

const DocUploaderExample = (props: any) => {
  const readOnly = true;
  const itemData = [
    {
      thumbnail: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      fileName: "Breakfast",
      author: "@bkristastucchio",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      fileName: "Burger",
      author: "@rollelflex_graphy726",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      fileName: "Camera",
      author: "@helloimnik",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      fileName: "Coffee",
      author: "@nolanissac",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      fileName: "Hats",
      author: "@hjrc33",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
      fileName: "Honey",
      author: "@arwinneil",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
      fileName: "Basketball",
      author: "@tjdragotta",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      fileName: "Fern",
      author: "@katie_wasserman",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      fileName: "Mushrooms",
      author: "@silverdalex",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
      fileName: "Tomato basil",
      author: "@shelleypauls",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      fileName: "Sea star",
      author: "@peterlaster",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      fileName: "Bike",
      author: "@southside_customs",
    },
  ];
  const localFileUpload = (data: any) => {
    console.log("localFileUpload", data);
    const formData = new FormData();
    formData.append("image", data);
    console.log("formData is", formData);
  };
  const projectFileUpload = () => {
    console.log("projectFileUpload");
  };
  const onImageDelete = (data: any) => {
    console.log("data", data);
  };
  return (
    <>
      <DocUploader
        width={"1000px"}
        height={"300px"}
        docLabel={"Documents"}
        imgData={[]}
        readOnly={false}
        folderType='File'
        localFileClick={(data: any) => {
          localFileUpload(data);
        }}
        onProjectFile={() => {
          projectFileUpload();
        }}
        onImageDelete={onImageDelete}
      ></DocUploader>
    </>
  );
};

export default DocUploaderExample;
