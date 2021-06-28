/* eslint-disable react/prop-types */
import 'react-quill/dist/quill.snow.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { editCorrespondenceDocumentSequence } from '../../presenter/sequences/editCorrespondenceDocumentSequence';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import React, { Suspense, useEffect, useRef } from 'react';
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
      {/* <script src="https://cdn.ckeditor.com/ckeditor5/28.0.0/decoupled-document/ckeditor.js"></script> */}
      <CKEditor
        data={editorDelta || defaultValue}
        editor={DecoupledEditor}
        onChange={(event, editor) => console.log({ editor, event })}
        // onChange={(content, delta, source, editor) => {
        //   console.log();
        //   const fullDelta = editor.getContents();
        //   const documentContents = editor.getText();
        //   const converter = new QuillDeltaToHtmlConverter(fullDelta.ops, {
        //     inlineStyles: {
        //       size: inlineStylesFontSizes,
        //     },
        //   });
        //   const html = converter.convert();
        //   updateFormValueSequence({
        //     key: 'richText',
        //     value: html,
        //   });
        //   updateFormValueSequence({
        //     key: 'editorDelta',
        //     value: fullDelta,
        //   });
        //   updateFormValueSequence({
        //     key: 'documentContents',
        //     value: documentContents,
        //   });
        //   updateScreenMetadataSequence({
        //     key: 'pristine',
        //     value: false,
        //   });
        // }}
        onError={({ willEditorRestart }) => {
          // If the editor is restarted, the toolbar element will be created once again.
          // The `onReady` callback will be called again and the new toolbar will be added.
          // This is why you need to remove the older toolbar.
          if (willEditorRestart) {
            this.editor.ui.view.toolbar.element.remove();
          }
        }}
        onReady={editor => {
          console.log('Editor is ready to use!', editor);

          // Insert the toolbar before the editable area.
          editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
              editor.ui.view.toolbar.element,
              editor.ui.getEditableElement(),
            );

          this.editor = editor;
        }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        {/* <ReactQuill
          defaultValue={editorDelta || defaultValue}
          formats={[
            'size',
            'bold',
            'italic',
            'underline',
            'bullet',
            'list',
            'indent',
          ]}
          modules={{
            toolbar: [
              [
                {
                  size: fontSizes,
                },
              ],
              ['bold', 'italic', 'underline'],
              [
                { list: 'bullet' },
                { list: 'ordered' },
                { indent: '-1' },
                { indent: '+1' },
              ],
            ],
          }}
          tabIndex={0}
          onChange={(content, delta, source, editor) => {
            const fullDelta = editor.getContents();
            const documentContents = editor.getText();
            const converter = new QuillDeltaToHtmlConverter(fullDelta.ops, {
              inlineStyles: {
                size: inlineStylesFontSizes,
              },
            });
            const html = converter.convert();
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
