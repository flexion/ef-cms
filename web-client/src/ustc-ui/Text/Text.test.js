import React from 'react';
import { Container } from '@cerebral/react';
import App from 'cerebral';
import TestRenderer from 'react-test-renderer';
import { Text } from './Text';

describe('Text Component', () => {
  it('should not show the text if no binded property is available', () => {
    const testModule = {
      sequences: {},
      state: {},
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Text id="some-text" />
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.find(el => el.type == 'span')).toThrow();
  });

  it('should not show the text if binded value is falsy', () => {
    const testModule = {
      state: {},
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Text bind="text" id="some-text" />
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.find(el => el.type == 'span')).toThrow();
  });

  it('should show the text if binded value is available', () => {
    const testModule = {
      state: {
        text: 'Some Content',
      },
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Text bind="text" />
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(testInstance.find(el => el.type == 'span').children[0]).toEqual(
      'Some Content',
    );
  });

  describe('type display', () => {
    it('should show number as text text if binded value is available', () => {
      const testModule = {
        state: {
          text: 123421342,
        },
      };
      const app = App(testModule);
      const testRenderer = TestRenderer.create(
        <Container app={app}>
          <Text bind="text" />
        </Container>,
      );

      const testInstance = testRenderer.root;

      expect(testInstance.find(el => el.type == 'span').children[0]).toEqual(
        '123421342',
      );
    });
  });
});
