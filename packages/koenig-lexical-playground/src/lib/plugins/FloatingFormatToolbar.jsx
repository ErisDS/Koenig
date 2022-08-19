import React, {useEffect} from 'react';
import {createPortal} from 'react-dom';
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    $isTextNode,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND
} from 'lexical';
import {
    $wrapLeafNodesInElements
} from '@lexical/selection';
import {
    $createHeadingNode,
    $isHeadingNode
} from '@lexical/rich-text';
import {
    $isListNode,
    ListNode
} from '@lexical/list';
import {
    $getNearestNodeOfType,
    mergeRegister
} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {getSelectedNode} from '../utils/getSelectedNode';
import {setFloatingElemPosition} from '../utils/setFloatingElemPosition';
import {getDOMRangeRect} from '../utils/getDOMRangeRect';
import {getScrollParent} from '../utils/getScrollParent';

import {ReactComponent as BoldIcon} from '../assets/icons/kg-bold.svg';
import {ReactComponent as ItalicIcon} from '../assets/icons/kg-italic.svg';
import {ReactComponent as HeadingOneIcon} from '../assets/icons/kg-heading-1.svg';
import {ReactComponent as HeadingTwoIcon} from '../assets/icons/kg-heading-2.svg';

const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote'
};

function MenuItem({label, isActive, onClick, Icon}) {
    return (
        <li className="m-0 flex p-0 first:m-0">
            <button
                type="button"
                className="flex h-9 w-9 items-center justify-center"
                onClick={onClick}
                aria-label={label}
            >
                <Icon className={isActive ? 'fill-green' : 'fill-white'} />
            </button>
        </li>
    );
}

function FloatingFormatToolbar({editor, anchorElem, blockType, isBold, isItalic, isH2, isH3}) {
    const toolbarRef = React.useRef(null);

    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapLeafNodesInElements(selection, () => $createParagraphNode());
                }
            });
        }
    };

    const formatHeading = (headingSize) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    $wrapLeafNodesInElements(selection, () => $createHeadingNode(headingSize));
                }
            });
        }
    };

    const updateFloatingToolbar = React.useCallback(() => {
        const toolbarElement = toolbarRef.current;

        if (!toolbarElement) {
            return;
        }

        const selection = $getSelection();
        const nativeSelection = window.getSelection();
        const rootElement = editor.getRootElement();

        if (
            selection !== null &&
            nativeSelection !== null &&
            !nativeSelection.isCollapsed &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode)
        ) {
            const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
            setFloatingElemPosition(rangeRect, toolbarElement, anchorElem);
        }
    }, [editor, anchorElem]);

    React.useEffect(() => {
        const scrollElement = getScrollParent(anchorElem);

        const update = () => {
            editor.getEditorState().read(() => {
                updateFloatingToolbar();
            });
        };

        window.addEventListener('resize', update);
        if (scrollElement) {
            scrollElement.addEventListener('scroll', update);
        }

        return () => {
            window.removeEventListener('resize', update);
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', update);
            }
        };
    }, [editor, updateFloatingToolbar, anchorElem]);

    React.useEffect(() => {
        editor.getEditorState().read(() => {
            updateFloatingToolbar();
        });

        return mergeRegister(
            editor.registerUpdateListener(({editorState}) => {
                editorState.read(() => {
                    updateFloatingToolbar();
                });
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateFloatingToolbar();
                    return false;
                },
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, updateFloatingToolbar]);

    return (
        <div className="absolute" ref={toolbarRef}>
            <ul className="text-md m-0 flex items-center justify-evenly rounded bg-black px-1 py-0 font-sans font-normal text-white">
                <MenuItem label="Format text as bold" isActive={isBold} Icon={BoldIcon} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} />
                <MenuItem label="Format text as italics" isActive={isItalic} Icon={ItalicIcon} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} />
                <MenuItem label="Change to heading 1" isActive={blockType === 'h2'} Icon={HeadingOneIcon} onClick={() => (blockType === 'h2' ? formatParagraph() : formatHeading('h2'))} />
                <MenuItem label="Change to heading 2" isActive={blockType === 'h3'} Icon={HeadingTwoIcon} onClick={() => (blockType === 'h3' ? formatParagraph() : formatHeading('h3'))} />
            </ul>
        </div>
    );
}

function useFloatingFormatToolbar(editor, anchorElem) {
    const [isText, setIsText] = React.useState(false);
    const [isBold, setIsBold] = React.useState(false);
    const [isItalic, setIsItalic] = React.useState(false);
    const [blockType, setBlockType] = React.useState('paragraph');

    const updatePopup = React.useCallback(() => {
        editor.getEditorState().read(() => {
            // Should not to pop up the floating toolbar when using IME input
            if (editor.isComposing()) {
                return;
            }
            const selection = $getSelection();
            const nativeSelection = window.getSelection();
            const rootElement = editor.getRootElement();

            if (
                nativeSelection !== null &&
                (
                    !$isRangeSelection(selection) ||
                    rootElement === null ||
                    !rootElement.contains(nativeSelection.anchorNode)
                )
            ) {
                setIsText(false);
                return;
            }

            if (!$isRangeSelection(selection)) {
                return;
            }

            const anchorNode = getSelectedNode(selection);
            const element = anchorNode.getKey() === 'root'
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);

            // update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));

            if (elementDOM !== null) {
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList
                        ? parentList.getListType()
                        : element.getListType();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();

                    if (type in blockTypeToBlockName) {
                        setBlockType(type);
                    }
                }
            }

            if (selection.getTextContent() !== '') {
                setIsText($isTextNode(anchorNode));
            } else {
                setIsText(false);
            }
        });
    }, [editor]);

    useEffect(() => {
        document.addEventListener('selectionchange', updatePopup);
        return () => {
            document.removeEventListener('selectionchange', updatePopup);
        };
    }, [updatePopup]);

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            updatePopup();
        });
    }, [editor, updatePopup]);

    if (!isText) {
        return;
    }

    return createPortal(
        <FloatingFormatToolbar
            editor={editor}
            anchorElem={anchorElem}
            blockType={blockType}
            isBold={isBold}
            isItalic={isItalic}
        />,
        anchorElem
    );
}

export default function FloatingFormatToolbarPlugin({anchorElem = document.body}) {
    const [editor] = useLexicalComposerContext();
    return useFloatingFormatToolbar(editor, anchorElem);
}
