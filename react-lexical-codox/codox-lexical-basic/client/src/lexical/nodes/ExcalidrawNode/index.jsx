/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

const ExcalidrawComponent = React.lazy(() => import('./ExcalidrawComponent'));

function convertExcalidrawElement(domNode) {
  const excalidrawData = domNode.getAttribute('data-lexical-excalidraw-json');
  if (excalidrawData) {
    const node = $createExcalidrawNode();
    node.__data = excalidrawData;
    return {
      node,
    };
  }
  return null;
}

export class ExcalidrawNode extends DecoratorNode {
  __data;
  __width;
  __height;

  static getType() {
    return 'excalidraw';
  }

  static clone(node) {
    return new ExcalidrawNode(node.__data, node.__key);
  }

  static importJSON(serializedNode) {
    return new ExcalidrawNode(serializedNode.data);
  }

  exportJSON() {
    return {
      data: this.__data,
      height: this.__height,
      type: 'excalidraw',
      version: 1,
      width: this.__width,
    };
  }

  constructor(data = '[]', key) {
    super(key);
    this.__data = data;
    this.__width = 'inherit';
    this.__height = 'inherit';
  }

  // View
  createDOM(config) {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;

    span.style.width = this.__width === 'inherit' ? 'inherit' : `${this.__width}px`;
    span.style.height = this.__height === 'inherit' ? 'inherit' : `${this.__height}px`;

    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM() {
    return false;
  }

  static importDOM() {
    return {
      span: (domNode) => {
        if (!domNode.hasAttribute('data-lexical-excalidraw-json')) {
          return null;
        }
        return {
          conversion: convertExcalidrawElement,
          priority: 1,
        };
      },
    };
  }

  exportDOM(editor) {
    const element = document.createElement('span');

    element.style.display = 'inline-block';

    const content = editor.getElementByKey(this.getKey());
    if (content !== null) {
      const svg = content.querySelector('svg');
      if (svg !== null) {
        element.innerHTML = svg.outerHTML;
      }
    }

    element.style.width = this.__width === 'inherit' ? 'inherit' : `${this.__width}px`;
    element.style.height = this.__height === 'inherit' ? 'inherit' : `${this.__height}px`;

    element.setAttribute('data-lexical-excalidraw-json', this.__data);
    return { element };
  }

  setData(data) {
    const self = this.getWritable();
    self.__data = data;
  }

  setWidth(width) {
    const self = this.getWritable();
    self.__width = width;
  }

  setHeight(height) {
    const self = this.getWritable();
    self.__height = height;
  }

  decorate(editor, config) {
    return (
      <Suspense fallback={null}>
        <ExcalidrawComponent nodeKey={this.getKey()} data={this.__data} height={this.__height} width={this.__width} />
      </Suspense>
    );
  }
}

export function $createExcalidrawNode() {
  return new ExcalidrawNode();
}

export function $isExcalidrawNode(node) {
  return node instanceof ExcalidrawNode;
}
