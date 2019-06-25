import { PropTypes } from 'prop-types';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React from 'react';

class PDFSignerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.signatureRef = React.createRef();
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.moveSig = this.moveSig.bind(this);
  }
  componentDidMount() {
    const canvas = this.canvasRef.current;
    const signature = this.signatureRef.current;
    const context = canvas.getContext('2d');

    this.props.pdfObj.getPage(this.props.currentPageNumber).then(page => {
      const scale = 1;
      const viewport = page.getViewport(scale);
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
      this.start(canvas, signature);
    });
  }

  moveSig(sig, x, y) {
    sig.style.top = y + 'px';
    sig.style.left = x + 'px';
  }

  stop(canvasEl) {
    canvasEl.onmousemove = null;
  }

  start(canvasEl, sigEl) {
    canvasEl.onmousemove = e => {
      const { offsetLeft, offsetTop } = canvasEl;

      const x = e.pageX - offsetLeft;
      const y = e.pageY - offsetTop;

      this.moveSig(sigEl, x + offsetLeft, y + offsetTop);
    };

    canvasEl.onmousedown = () => {
      this.stop(canvasEl);
    };

    sigEl.onmousedown = () => {
      this.stop(canvasEl);
    };
  }

  render() {
    return (
      <div>
        <span
          id="signature"
          ref={this.signatureRef}
          style={{ position: 'absolute' }}
        >
          (Signed) Joseph Dredd
        </span>
        <canvas id="sign-pdf-canvas" ref={this.canvasRef}></canvas>
      </div>
    );
  }
}

PDFSignerComponent.propTypes = {
  currentPageNumber: PropTypes.number,
  pdfForSigning: PropTypes.object,
  pdfObj: PropTypes.object,
  setCanvas: PropTypes.func,
};

export const PDFSigner = connect(
  {
    currentPageNumber: state.pdfForSigning.pageNumber,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    setCanvas: sequences.setCanvasForPDFSigningSequence,
  },
  PDFSignerComponent,
);
