import { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageResize  from "quill-image-resize-module-react";


Quill.register("modules/imageResize", ImageResize);

const HtmlEditor = (props: any) => {
  const [editorHtml, setEditorHtml] = useState<any>("");

  const modules = {
    toolbar: [
      [{ header: [] }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  /**
   * Calling the parents handleChange whenever there is a change in the editor
   * @param html whole html inside the editor
   * @author Srinivas Nadendla
   */
  const handleChange = (html: any) => {
    setEditorHtml(html);
    props.handleChange(html);
  };

  return (
    <ReactQuill
      onChange={handleChange}
      value={editorHtml}
      modules={modules}
      formats={formats}
      bounds={"#root"}
      placeholder={props.placeholder}
    />
  );
};

export default HtmlEditor;
