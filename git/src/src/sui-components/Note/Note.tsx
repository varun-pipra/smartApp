import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Note.scss';

interface SUINoteProps {
    onNotesChange?: any;
    notes?: any;
    disabled?: any;
}

const SUINote = (props: SUINoteProps) => {
    const [value, setValue] = useState('');
    React.useEffect(() => {setValue(props.notes);}, [props.notes]);

    return <ReactQuill theme="snow" readOnly={props?.disabled} value={value} onChange={(value) => {
        setValue(value);
    }} onBlur={() => props?.onNotesChange(value)}
    />;
};

export default SUINote;

// import {useEffect, useState} from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import './Note.scss';

// interface SUINoteProps {
//  onNotesChange?: any;
//  notes?: any;
//  disabled?: any;
// }

// const SUINote = (props: SUINoteProps) => {
//  const [value, setValue] = useState('');
//  const [changed, setChanged] = useState<any>();

//  useEffect(() => {
//      setValue(props.notes);
//  }, [props.notes]);

//  useEffect(() => {
//      const timeOutId = setTimeout(() => props?.onNotesChange(value), 500);
//      return () => clearTimeout(timeOutId);
//  }, [changed]);

//  return <ReactQuill theme="snow" readOnly={props?.disabled} value={value} onChange={(value) => {
//      setValue(value);
//      // if(props.notes !== value)
//      setChanged(new Date());
//  }}
//  // onBlur={() => props?.onNotesChange(value)}
//  />;
// };

// export default SUINote;