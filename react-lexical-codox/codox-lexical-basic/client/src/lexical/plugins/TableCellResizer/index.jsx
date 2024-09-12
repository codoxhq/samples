/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './index.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useLexicalEditable from '@lexical/react/useLexicalEditable';
import {
  $getTableColumnIndexFromTableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $isTableCellNode,
  $isTableRowNode,
  $isTableSelection,
  getDOMCellFromTarget,
  TableCellNode,
} from '@lexical/table';
import { $getNearestNodeFromDOMNode, $getSelection, COMMAND_PRIORITY_HIGH, SELECTION_CHANGE_COMMAND } from 'lexical';
import * as React from 'react';
import { MouseEventHandler, ReactPortal, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const MIN_ROW_HEIGHT = 33;
const MIN_COLUMN_WIDTH = 50;

function TableCellResizer({ editor }) {
  const targetRef = useRef(null);
  const resizerRef = useRef(null);
  const tableRectRef = useRef(null);

  const mouseStartPosRef = useRef(null);
  const [mouseCurrentPos, updateMouseCurrentPos] = useState(null);

  const [activeCell, updateActiveCell] = useState(null);
  const [isSelectingGrid, updateIsSelectingGrid] = useState(false);
  const [draggingDirection, updateDraggingDirection] = useState(null);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (payload) => {
        const selection = $getSelection();
        const isTableSelection = $isTableSelection(selection);

        if (isSelectingGrid !== isTableSelection) {
          updateIsSelectingGrid(isTableSelection);
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  });

  const resetState = useCallback(() => {
    updateActiveCell(null);
    targetRef.current = null;
    updateDraggingDirection(null);
    mouseStartPosRef.current = null;
    tableRectRef.current = null;
  }, []);

  useEffect(() => {
    const onMouseMove = (event) => {
      setTimeout(() => {
        const target = event.target;

        if (draggingDirection) {
          updateMouseCurrentPos({
            x: event.clientX,
            y: event.clientY,
          });
          return;
        }

        if (resizerRef.current && resizerRef.current.contains(target)) {
          return;
        }

        if (targetRef.current !== target) {
          targetRef.current = target;
          const cell = getDOMCellFromTarget(target);

          if (cell && activeCell !== cell) {
            editor.update(() => {
              const tableCellNode = $getNearestNodeFromDOMNode(cell.elem);
              if (!tableCellNode) {
                throw new Error('TableCellResizer: Table cell node not found.');
              }

              const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
              const tableElement = editor.getElementByKey(tableNode.getKey());

              if (!tableElement) {
                throw new Error('TableCellResizer: Table element not found.');
              }

              targetRef.current = target;
              tableRectRef.current = tableElement.getBoundingClientRect();
              updateActiveCell(cell);
            });
          } else if (cell == null) {
            resetState();
          }
        }
      }, 0);
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [activeCell, draggingDirection, editor, resetState]);

  const isHeightChanging = (direction) => {
    if (direction === 'bottom') return true;
    return false;
  };

  const updateRowHeight = useCallback(
    (newHeight) => {
      if (!activeCell) {
        throw new Error('TableCellResizer: Expected active cell.');
      }

      editor.update(() => {
        const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
        if (!$isTableCellNode(tableCellNode)) {
          throw new Error('TableCellResizer: Table cell node not found.');
        }

        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

        const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);

        const tableRows = tableNode.getChildren();

        if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
          throw new Error('Expected table cell to be inside of table row.');
        }

        const tableRow = tableRows[tableRowIndex];

        if (!$isTableRowNode(tableRow)) {
          throw new Error('Expected table row');
        }

        tableRow.setHeight(newHeight);
      });
    },
    [activeCell, editor]
  );

  const updateColumnWidth = useCallback(
    (newWidth) => {
      if (!activeCell) {
        throw new Error('TableCellResizer: Expected active cell.');
      }
      editor.update(() => {
        const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
        if (!$isTableCellNode(tableCellNode)) {
          throw new Error('TableCellResizer: Table cell node not found.');
        }

        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

        const tableColumnIndex = $getTableColumnIndexFromTableCellNode(tableCellNode);

        const tableRows = tableNode.getChildren();

        for (let r = 0; r < tableRows.length; r++) {
          const tableRow = tableRows[r];

          if (!$isTableRowNode(tableRow)) {
            throw new Error('Expected table row');
          }

          const rowCells = tableRow.getChildren();
          const rowCellsSpan = rowCells.map((cell) => cell.getColSpan());

          const aggregatedRowSpans = rowCellsSpan.reduce((rowSpans, cellSpan) => {
            const previousCell = rowSpans[rowSpans.length - 1] ?? 0;
            rowSpans.push(previousCell + cellSpan);
            return rowSpans;
          }, []);
          const rowColumnIndexWithSpan = aggregatedRowSpans.findIndex((cellSpan) => cellSpan > tableColumnIndex);

          if (rowColumnIndexWithSpan >= rowCells.length || rowColumnIndexWithSpan < 0) {
            throw new Error('Expected table cell to be inside of table row.');
          }

          const tableCell = rowCells[rowColumnIndexWithSpan];

          if (!$isTableCellNode(tableCell)) {
            throw new Error('Expected table cell');
          }

          tableCell.setWidth(newWidth);
        }
      });
    },
    [activeCell, editor]
  );

  const mouseUpHandler = useCallback(
    (direction) => {
      const handler = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!activeCell) {
          throw new Error('TableCellResizer: Expected active cell.');
        }

        if (mouseStartPosRef.current) {
          const { x, y } = mouseStartPosRef.current;

          if (activeCell === null) {
            return;
          }

          if (isHeightChanging(direction)) {
            const height = activeCell.elem.getBoundingClientRect().height;
            const heightChange = Math.abs(event.clientY - y);

            const isShrinking = direction === 'bottom' && y > event.clientY;

            updateRowHeight(Math.max(isShrinking ? height - heightChange : heightChange + height, MIN_ROW_HEIGHT));
          } else {
            const computedStyle = getComputedStyle(activeCell.elem);
            let width = activeCell.elem.clientWidth; // width with padding
            width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
            const widthChange = Math.abs(event.clientX - x);

            const isShrinking = direction === 'right' && x > event.clientX;

            updateColumnWidth(Math.max(isShrinking ? width - widthChange : widthChange + width, MIN_COLUMN_WIDTH));
          }

          resetState();
          document.removeEventListener('mouseup', handler);
        }
      };
      return handler;
    },
    [activeCell, resetState, updateColumnWidth, updateRowHeight]
  );

  const toggleResize = useCallback(
    (direction) => (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!activeCell) {
        throw new Error('TableCellResizer: Expected active cell.');
      }

      mouseStartPosRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      updateMouseCurrentPos(mouseStartPosRef.current);
      updateDraggingDirection(direction);

      document.addEventListener('mouseup', mouseUpHandler(direction));
    },
    [activeCell, mouseUpHandler]
  );

  const getResizers = useCallback(() => {
    if (activeCell) {
      const { height, width, top, left } = activeCell.elem.getBoundingClientRect();

      const styles = {
        bottom: {
          backgroundColor: 'none',
          cursor: 'row-resize',
          height: '10px',
          left: `${window.pageXOffset + left}px`,
          top: `${window.pageYOffset + top + height}px`,
          width: `${width}px`,
        },
        right: {
          backgroundColor: 'none',
          cursor: 'col-resize',
          height: `${height}px`,
          left: `${window.pageXOffset + left + width}px`,
          top: `${window.pageYOffset + top}px`,
          width: '10px',
        },
      };

      const tableRect = tableRectRef.current;

      if (draggingDirection && mouseCurrentPos && tableRect) {
        if (isHeightChanging(draggingDirection)) {
          styles[draggingDirection].left = `${window.pageXOffset + tableRect.left}px`;
          styles[draggingDirection].top = `${window.pageYOffset + mouseCurrentPos.y}px`;
          styles[draggingDirection].height = '3px';
          styles[draggingDirection].width = `${tableRect.width}px`;
        } else {
          styles[draggingDirection].top = `${window.pageYOffset + tableRect.top}px`;
          styles[draggingDirection].left = `${window.pageXOffset + mouseCurrentPos.x}px`;
          styles[draggingDirection].width = '3px';
          styles[draggingDirection].height = `${tableRect.height}px`;
        }

        styles[draggingDirection].backgroundColor = '#adf';
      }

      return styles;
    }

    return {
      bottom: null,
      left: null,
      right: null,
      top: null,
    };
  }, [activeCell, draggingDirection, mouseCurrentPos]);

  const resizerStyles = getResizers();

  return (
    <div ref={resizerRef}>
      {activeCell != null && !isSelectingGrid && (
        <>
          <div
            className="TableCellResizer__resizer TableCellResizer__ui"
            style={resizerStyles.right || undefined}
            onMouseDown={toggleResize('right')}
          />
          <div
            className="TableCellResizer__resizer TableCellResizer__ui"
            style={resizerStyles.bottom || undefined}
            onMouseDown={toggleResize('bottom')}
          />
        </>
      )}
    </div>
  );
}

export default function TableCellResizerPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  return useMemo(
    () => (isEditable ? createPortal(<TableCellResizer editor={editor} />, document.body) : null),
    [editor, isEditable]
  );
}
