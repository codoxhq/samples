/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import SimpleLoading from './ui/SimpleLoading';
import { PlaygroundHeader } from './ui/PlaygroundHeader';
import DocsNav from './DocsNav';

import { SharedHistoryContext } from './context/SharedHistoryContext';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import { TableContext } from './plugins/TablePlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { CAN_USE_DOM } from './shared/canUseDOM';

import { useSharedHistoryContext } from './context/SharedHistoryContext';
import ActionsPlugin from './plugins/ActionsPlugin';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import ExcalidrawPlugin from './plugins/ExcalidrawPlugin';
import FigmaPlugin from './plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import MentionsPlugin from './plugins/MentionsPlugin';
import PageBreakPlugin from './plugins/PageBreakPlugin';
import PollPlugin from './plugins/PollPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TreeViewPlugin from './plugins/TreeViewPlugin';
import TwitterPlugin from './plugins/TwitterPlugin';
import YouTubePlugin from './plugins/YouTubePlugin';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';

import { fetchAllDocIds, fetchDocInitStateByDocId, fetchStateWithTimestamp, updateServerState } from './http';

import { CodoxCollabPlugin, registerNodesWithCodox, CodoxCommentPlugin, validateStateStructure } from './codoxCollab';

import useModal from './hooks/useModal';

import Button from './ui/Button';

const LEXICAL_NODES_TO_REGISTER = registerNodesWithCodox([...PlaygroundNodes]);

let demoUserName = `user_${Math.floor(Math.random() * 1000)}`; // as example, just a random user name

/**
 * Main App Component
 * For demonstation contains Lexical Provider and all plugins here.
 * External plugins are borrowed from offical lexical playground
 */
export default function App() {
  const { historyState } = useSharedHistoryContext();

  const [currentDocId, setCurrentDocId] = useState(null);

  const [docIdsList, setDocIdsList] = useState([]);
  const [isLoading, toggleIsLoading] = useState(true);
  // flag for codox start
  const [codoxStarted, setCodoxStarted] = useState(false);
  const [codoxStartInProgress, setCodoxStartInProgress] = useState(false);
  const [modal, showModal] = useModal();
  const [initLexicalState, setInitLexicalState] = useState(null);

  const changeCurrentDocId = (newDocId) => {
    if (newDocId === currentDocId) {
      console.warn('[changeCurrentDocId]: ids are same - skip');
      return;
    }
    setInitLexicalState(null);
    setCurrentDocId(newDocId);
    if (codoxStarted) {
      stopCodoxSync();
      setCodoxStarted(false);
    }
  };

  // Fetch doc ids list on mount
  useEffect(() => {
    (async () => {
      const docIdsArray = await fetchAllDocIds();
      if (docIdsArray.length) {
        setDocIdsList(docIdsArray); // set docids list
        setCurrentDocId(docIdsArray[0]); // set first docId as current one
      }
    })();
    //
    return () => {
      stopCodoxSync();
    };
  }, []);

  const codoxProviderRef = useRef();
  //

  const fetchDocOnNetworkReconnect = async () => {
    const state = await fetchDocInitStateByDocId(currentDocId);
    return { state, timestamp: Date.now() };
  };

  // triggered by Codox
  let onBlacklistedInsert = () => {
    console.log('[Lexical Demo][onBlacklistedInsert] blacklisted combination found');
    // NOTE: this is example of how to show in ui message when blacklisted combination found
    showModal('Insert is forbidden', (onClose) => {});
  };

  const codoxConfig = {
    docId: currentDocId,
    apiKey: process.env.REACT_APP_CODOX_API_KEY, // api key provided by codox
    username: demoUserName, // client user name - use real username here instead of demo name
    hooks: {
      fetchDocOnNetworkReconnect,
      contentChanged: (data) => {
        console.log('[Lexical Demo][contentChanged hook] hook invoked by Codox: ', data);
        contentChangedHookHandler(data);
      },
      usersUpdate: (data) => {
        console.log('[Lexical Demo][usersUpdate hook] hook invoked by Codox: ', data);
      },
    },
  };

  const startCodoxSync = () => {
    if (codoxProviderRef.current) {
      setCodoxStartInProgress(true);
      console.log('[Lexical Demo] initial state before codox.start ', initLexicalState);

      codoxProviderRef.current.initComments(initLexicalState.commentThreads);

      const events = ['content_changed', 'error', 'users_update'];
      events.forEach((event) => {
        console.log('[Lexical Demo][[Subscribe to Codox Event]: ', event);
        codoxProviderRef.current.on(event, (data) => {
          console.log('[Lexical Demo][Codox Event Emitted]: ', { event, data });
        });
      });

      codoxProviderRef.current
        .start(codoxConfig)
        .then(() => {
          console.log('[Lexical Demo][codox.start] success');

          setCodoxStarted(true);
        })
        .catch((err) => console.log('[Lexical Demo][codox.start] error', err))
        .finally(() => {
          setCodoxStartInProgress(false);
        });
    }
  };
  const stopCodoxSync = () => {
    if (codoxProviderRef.current) {
      codoxProviderRef.current.stop();
    }
    setCodoxStarted(false);
  };

  useEffect(() => {
    (async () => {
      /**
       * Stop already running codox sync, when docId is changed
       */
      if (codoxStarted) {
        stopCodoxSync();
      }
      if (!currentDocId) return;
      //

      toggleIsLoading(true); // toggle loading flag

      let initState = await fetchDocInitStateByDocId(currentDocId);

      console.log({ initState });

      if (initState) {
        try {
          validateStateStructure(initState, LEXICAL_NODES_TO_REGISTER); // if invalid - will throw

          setInitLexicalState(initState);
        } catch (err) {
          console.error('[APP] error: ', err);
        }
      }

      toggleIsLoading(false);
      //
    })();
  }, [currentDocId]);

  useEffect(() => {
    if (initLexicalState && currentDocId && !codoxStarted && !codoxStartInProgress) {
      startCodoxSync();
    }
  }, [initLexicalState, currentDocId, codoxStarted, codoxStartInProgress]);

  /**
   * Initial config for Lexical Composer - init it only once
   */
  const initLexicalConfig = useMemo(() => {
    if (!initLexicalState) return;
    return {
      editorState: JSON.stringify({ root: initLexicalState.root }), // use null as init state, when init state is fetched, it will be applied by codox
      namespace: `Playground`, // can use own namespace name, "Playground" is for example here
      nodes: LEXICAL_NODES_TO_REGISTER, // should wrap nodes into codox register fn
      onError: (error) => {
        // custom error handler, can do smth custom here
        console.error('[Lexical Demo][Editor Error Captured]: ', error);
        // throw error;
      },
      theme: PlaygroundEditorTheme, // css theme, as example, official playground theme is used
    };
  }, [initLexicalState]);

  // const onEditorStateChange = ({ docId, state, isRemoteChange = false } = {}) => {
  //   console.log('[Lexical Demo][onEditorStateChange]: ', { docId, state, isRemoteChange });
  //   /**
  //    * Should save to database ONLY on local changes, e.g. when isRemoteChange is false
  //    */
  //   if (isRemoteChange) return;
  //   /**
  //    * IMPORTANT: THIS API CALL IS FOR DEV MODE ONLY, for testing purposes ONLY
  //    */
  //   (async () => await updateServerState(docId, state))();
  // };

  const contentChangedHookHandler = ({ source, content }) => {
    console.log('[Lexical Demo][contentChangedHookHandler]: ', { source, content });
    /**
     * source can be one of "local", "remote"
     * content is full lexical json state: root with comments
     * Trigger save to db only for "local" changes
     */
    if (source === 'local') {
      (async () => await updateServerState(currentDocId, content))();
    }
  };

  // disabled - richtext enabled by default
  // const placeholder = <Placeholder>{isRichText ? 'Enter some rich text...' : 'Enter some plain text...'}</Placeholder>;
  const placeholder = <Placeholder>{'Enter some plain text...'}</Placeholder>;

  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState(false);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport = CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  const hideRemoteCursors = () => {
    codoxProviderRef.current.cursor.hide();
  };
  const showRemoteCursors = () => {
    codoxProviderRef.current.cursor.show();
  };

  return (
    <>
      <PlaygroundHeader />
      <DocsNav currentDocId={currentDocId} docIds={docIdsList} changeCurrentDocId={changeCurrentDocId} />
      {isLoading && <SimpleLoading />}
      {initLexicalState && (
        <LexicalComposer initialConfig={initLexicalConfig} key={currentDocId}>
          <SharedHistoryContext>
            <TableContext>
              <div className="editor-shell">
                <Button onClick={hideRemoteCursors} className={'toolbar-item.spaced'} small={true}>
                  Hide remote cursors
                </Button>
                <Button onClick={showRemoteCursors} className={'toolbar-item.spaced'} small={true}>
                  Show remote cursors
                </Button>
                <>
                  <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />

                  <div className={`editor-container tree-view`}>
                    <DragDropPaste />
                    <AutoFocusPlugin />
                    <ClearEditorPlugin />
                    <ComponentPickerPlugin />
                    <EmojiPickerPlugin />
                    <AutoEmbedPlugin />

                    <MentionsPlugin />
                    <EmojisPlugin />
                    <HashtagPlugin />
                    <KeywordsPlugin />
                    <AutoLinkPlugin />

                    <HistoryPlugin externalHistoryState={historyState} />

                    <RichTextPlugin
                      contentEditable={
                        <div className="editor-scroller">
                          <div className="editor" ref={onRef}>
                            <ContentEditable />
                          </div>
                        </div>
                      }
                      placeholder={placeholder}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <MarkdownShortcutPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <CheckListPlugin />
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                    <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
                    <TableCellResizer />
                    <ImagesPlugin />
                    <InlineImagePlugin />
                    <LinkPlugin />
                    <PollPlugin />
                    <TwitterPlugin />
                    <YouTubePlugin />
                    <FigmaPlugin />
                    <ClickableLinkPlugin />
                    <HorizontalRulePlugin />
                    <EquationsPlugin />
                    <ExcalidrawPlugin />
                    <TabFocusPlugin />
                    <TabIndentationPlugin />
                    <CollapsiblePlugin />
                    <PageBreakPlugin />
                    <LayoutPlugin />
                    {floatingAnchorElem && !isSmallWidthViewport && (
                      <>
                        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                        <FloatingLinkEditorPlugin
                          anchorElem={floatingAnchorElem}
                          isLinkEditMode={isLinkEditMode}
                          setIsLinkEditMode={setIsLinkEditMode}
                        />
                        <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />
                        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
                      </>
                    )}

                    <ActionsPlugin isRichText={true} />
                  </div>
                  <TreeViewPlugin />
                </>

                <CodoxCollabPlugin
                  // CodoxCollabPlugin can be inited here or inside EditorPlugins with other plugins
                  // Important to put it inside LexicalComposer component as other plugins

                  ref={codoxProviderRef}
                  onBlacklistedInsert={onBlacklistedInsert} // callback to trigger when attempt to insert/paste blacklisted content combination
                />

                <CodoxCommentPlugin />
                {/*<CodoxExternalTestPlugin />*/}

                {modal}
              </div>
            </TableContext>
          </SharedHistoryContext>
        </LexicalComposer>
      )}
    </>
  );
}
