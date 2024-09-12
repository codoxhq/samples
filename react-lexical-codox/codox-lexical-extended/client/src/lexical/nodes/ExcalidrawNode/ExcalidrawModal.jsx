/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './ExcalidrawModal.css';

import { Excalidraw } from '@excalidraw/excalidraw';

import * as React from 'react';
import { ReactPortal, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import Button from '../../ui/Button';
import Modal from '../../ui/Modal';

export const useCallbackRefState = () => {
  const [refValue, setRefValue] = React.useState(null);
  const refCallback = React.useCallback((value) => setRefValue(value), []);
  return [refValue, refCallback];
};

/**
 * @explorer-desc
 * A component which renders a modal with Excalidraw (a painting app)
 * which can be used to export an editable image
 */
export default function ExcalidrawModal({
  closeOnClickOutside = false,
  onSave,
  initialElements,
  initialAppState,
  initialFiles,
  isShown = false,
  onDelete,
  onClose,
}) {
  const excaliDrawModelRef = useRef(null);
  const [excalidrawAPI, excalidrawAPIRefCallback] = useCallbackRefState();
  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [elements, setElements] = useState(initialElements);
  const [files, setFiles] = useState(initialFiles);

  useEffect(() => {
    if (excaliDrawModelRef.current !== null) {
      excaliDrawModelRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement = null;

    const clickOutsideHandler = (event) => {
      const target = event.target;
      if (excaliDrawModelRef.current !== null && !excaliDrawModelRef.current.contains(target) && closeOnClickOutside) {
        onDelete();
      }
    };

    if (excaliDrawModelRef.current !== null) {
      modalOverlayElement = excaliDrawModelRef.current?.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement?.addEventListener('click', clickOutsideHandler);
      }
    }

    return () => {
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener('click', clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onDelete]);

  useLayoutEffect(() => {
    const currentModalRef = excaliDrawModelRef.current;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onDelete();
      }
    };

    if (currentModalRef !== null) {
      currentModalRef.addEventListener('keydown', onKeyDown);
    }

    return () => {
      if (currentModalRef !== null) {
        currentModalRef.removeEventListener('keydown', onKeyDown);
      }
    };
  }, [elements, files, onDelete]);

  const save = () => {
    if (elements.filter((el) => !el.isDeleted).length > 0) {
      const appState = excalidrawAPI?.getAppState();
      // We only need a subset of the state
      const partialState = {
        exportBackground: appState.exportBackground,
        exportScale: appState.exportScale,
        exportWithDarkMode: appState.theme === 'dark',
        isBindingEnabled: appState.isBindingEnabled,
        isLoading: appState.isLoading,
        name: appState.name,
        theme: appState.theme,
        viewBackgroundColor: appState.viewBackgroundColor,
        viewModeEnabled: appState.viewModeEnabled,
        zenModeEnabled: appState.zenModeEnabled,
        zoom: appState.zoom,
      };
      onSave(elements, partialState, files);
    } else {
      // delete node if the scene is clear
      onDelete();
    }
  };

  const discard = () => {
    if (elements.filter((el) => !el.isDeleted).length === 0) {
      // delete node if the scene is clear
      onDelete();
    } else {
      //Otherwise, show confirmation dialog before closing
      setDiscardModalOpen(true);
    }
  };

  function ShowDiscardDialog() {
    return (
      <Modal
        title="Discard"
        onClose={() => {
          setDiscardModalOpen(false);
        }}
        closeOnClickOutside={false}
      >
        Are you sure you want to discard the changes?
        <div className="ExcalidrawModal__discardModal">
          <Button
            onClick={() => {
              setDiscardModalOpen(false);
              onClose();
            }}
          >
            Discard
          </Button>{' '}
          <Button
            onClick={() => {
              setDiscardModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }

  if (isShown === false) {
    return null;
  }

  const onChange = (els, _, fls) => {
    setElements(els);
    setFiles(fls);
  };

  return createPortal(
    <div className="ExcalidrawModal__overlay" role="dialog">
      <div className="ExcalidrawModal__modal" ref={excaliDrawModelRef} tabIndex={-1}>
        <div className="ExcalidrawModal__row">
          {discardModalOpen && <ShowDiscardDialog />}
          <Excalidraw
            onChange={onChange}
            excalidrawAPI={excalidrawAPIRefCallback}
            initialData={{
              appState: initialAppState || { isLoading: false },
              elements: initialElements,
              files: initialFiles,
            }}
          />
          <div className="ExcalidrawModal__actions">
            <button className="action-button" onClick={discard}>
              Discard
            </button>
            <button className="action-button" onClick={save}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
