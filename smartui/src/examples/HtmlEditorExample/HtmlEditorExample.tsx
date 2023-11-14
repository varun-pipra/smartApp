import React from "react";

import HtmlEditor from "sui-components/HtmlEditor/HtmlEditor";

const HtmlEditorExample = () => {
  return (
    <>
      <HtmlEditor handleChange={(html: any) => console.log(html)}></HtmlEditor>
    </>
  );
};

export default HtmlEditorExample;
