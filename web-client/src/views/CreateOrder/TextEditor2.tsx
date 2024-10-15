import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

// Editor is an uncontrolled React component
export const TextEditor2 = forwardRef(
  (
    { defaultValue, onEditorDeltaChange, onHtmlChange, onTextChange, readOnly },
    ref,
  ) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, { theme: 'snow' });

      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, () =>
        onEditorDeltaChange(quill.getContents()),
      );

      quill.on(Quill.events.TEXT_CHANGE, () =>
        onHtmlChange(quill.getSemanticHTML()),
      );

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        // onTextChangeRef.current?.(...args);
        // const contents = quill.getContents();
        // const semanticHtML = quill.getSemanticHTML();
        // console.log('getContents', contents);
        // const converter = new QuillDeltaToHtmlConverter(contents.ops);
        // const html = converter.convert();
        // if (html !== semanticHtML) {
        //   console.log('old busted html: ', html);
        //   console.log('semantic html: ', semanticHtML);
        // }
      });

      return () => {
        ref.current = null;
        container.innerHTML = '';
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  },
);

TextEditor2.displayName = 'Editor2';
