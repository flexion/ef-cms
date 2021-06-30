/* eslint-disable react/prop-types */
import 'react-quill/dist/quill.snow.css';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import viewToPlainText from '@ckeditor/ckeditor5-clipboard/src/utils/viewtoplaintext';
import { Editor } from '@tinymce/tinymce-react';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import FroalaEditor from 'react-froala-wysiwyg';

// Require Editor CSS files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

import React, { Suspense, useEffect, useRef } from 'react';

import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import reactQuill from 'react-quill';

const inlineStylesFontSizes = {};
const fontSizes = ['10px', '12px', '14px', '16px', '18px', '20px'];

const ReactQuill = React.lazy(async () => {
  const Size = reactQuill.Quill.import('attributors/style/size');
  Size.whitelist = fontSizes;
  reactQuill.Quill.register(Size, true);

  fontSizes.forEach(item => {
    inlineStylesFontSizes[item] = `font-size: ${item};`;
  });

  return { default: reactQuill };
});

export const TextEditor = ({
  defaultValue,
  editorDelta,
  updateFormValueSequence,
  updateScreenMetadataSequence,
}) => {
  const quillEscapeRef = useRef(null);

  const onKeyboard = event => {
    const pressedESC = event.keyCode === 27;
    const inEditor = event.target.classList.contains('ql-editor');
    if (pressedESC && inEditor) {
      quillEscapeRef.current.focus();
    }
  };

  const addKeyboardListeners = () => {
    window.document.addEventListener('keydown', onKeyboard, false);
  };
  const removeKeyboardListeners = () => {
    window.document.removeEventListener('keydown', onKeyboard, false);
  };

  useEffect(() => {
    addKeyboardListeners();
    return () => removeKeyboardListeners();
  }, []);

  return (
    <>
      <Editor
        apiKey="Get your free API key at tiny.cloud and paste it here"
        plugins="wordcount"
      />
      <Suspense fallback={<div>Loading...</div>}>
        {/* <ReactQuill
          defaultValue={editorDelta || defaultValue}
          tabIndex={0}
          onChange={(content, delta, source, editor) => {
            const fullDelta = editor.getContents();
            console.log('editorDelta fullDelta', fullDelta);
            const documentContents = editor.getText();
            console.log('documentContents', documentContents);

            const converter = new QuillDeltaToHtmlConverter(fullDelta.ops, {
              inlineStyles: {
                size: inlineStylesFontSizes,
              },
            });
            const html = converter.convert();
            console.log('html for richText!!', html);
            updateFormValueSequence({
              key: 'richText',
              value: html,
            });
            updateFormValueSequence({
              key: 'editorDelta',
              value: fullDelta,
            });
            updateFormValueSequence({
              key: 'documentContents',
              value: documentContents,
            });
            updateScreenMetadataSequence({
              key: 'pristine',
              value: false,
            });
          }}
        /> */}
        <button
          aria-hidden
          className="usa-sr-only"
          id="escape-focus-for-keyboard"
          ref={quillEscapeRef}
          tabIndex="-1"
        />
      </Suspense>
    </>
  );
};
