import PropTypes from 'prop-types';
import React from 'react';

class DownloadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.url = this.props.url;
    this.blob = this.props.blob;
    this.fileName = this.props.fileName || 'file.zip';
    this.mimeType = this.props.mimeType;
    this.ref = React.createRef();

    if (this.url && this.blob) {
      throw new Error(
        'Download component should be provided either Blob or URL, but not both',
      );
    }

    if (this.blob) {
      // caller is depending on this component to both create _and_ revoke the URL
      this.file = new File(
        [this.blob],
        this.fileName,
        this.mimeType && { type: this.mimeType },
      );
      this.url = window.URL.createObjectURL(this.file);
    }
  }

  componentWillUnmount() {
    // revoke always completes silently whether or not valid URL
    window.URL.revokeObjectURL(this.url);
    this.props.onUnmount && this.props.onUnmount();
  }
  componentDidMount() {
    this.ref.current.click();
  }

  render() {
    return (
      <a
        className="usa-sr-only"
        download={this.fileName}
        href={this.url}
        ref={this.ref}
      >
        download
      </a>
    );
  }
}

DownloadComponent.propTypes = {
  blob: PropTypes.object,
  fileName: PropTypes.string,
  mimeType: PropTypes.string,
  onUnmount: PropTypes.func,
  url: PropTypes.string,
};

export const Download = DownloadComponent;
