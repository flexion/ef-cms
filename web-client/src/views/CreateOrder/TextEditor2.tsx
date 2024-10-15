import 'quill/dist/quill.snow.css';
import { Delta } from 'quill/core';
import Quill from 'quill';
import React, { useEffect, useRef } from 'react';

// Editor is an uncontrolled React component
export const TextEditor2 = ({
  defaultValue,
  onEditorDeltaChange,
  onHtmlChange,
}: {
  defaultValue: Delta;
  onEditorDeltaChange: (delta: Delta) => void;
  onHtmlChange: (html: string) => {};
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        modules: {
          toolbar: [
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline'],
            [
              { list: 'bullet' },
              { list: 'ordered' },
              { indent: '-1' },
              { indent: '+1' },
            ],
          ],
        },
        theme: 'snow',
      });

      if (defaultValue) {
        quill.setContents(defaultValue);
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
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [containerRef]);

  return <div ref={containerRef}></div>;
};

TextEditor2.displayName = 'Editor2';
