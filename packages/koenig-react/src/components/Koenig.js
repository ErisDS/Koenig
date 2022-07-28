import * as React from 'react';
import {Editor, Container, Toolbar} from 'react-mobiledoc-editor';
import DEFAULT_ATOMS from '../atoms';
import DEFAULT_KEY_COMMANDS from '../key-commands';
import DEFAULT_TEXT_EXPANSIONS from '../text-expansions';
import 'styled-components/macro';
import tw from 'twin.macro';

const Koenig = ({
    mobiledoc,
    atoms = DEFAULT_ATOMS,
    keyCommands = DEFAULT_KEY_COMMANDS,
    textExpansions = DEFAULT_TEXT_EXPANSIONS,
    didCreateEditor,
    onChange
}) => {
    function _didCreateEditor(editor) {
        if (keyCommands?.length) {
            keyCommands.forEach((command) => {
                editor.registerKeyCommand({
                    str: command.str,
                    run() {
                        return command.run(editor);
                    }
                });
            });
        }

        if (textExpansions?.length) {
            textExpansions.forEach((textExpansion) => {
                textExpansion.unregister?.forEach(key => editor.unregisterTextInputHandler(key));
                textExpansion.register?.forEach(expansion => editor.onTextInput(expansion));
            });
        }

        didCreateEditor?.(editor);
    }
    
    return (
        <Container
            css={ContainerStyle}
            mobiledoc={mobiledoc}
            atoms={atoms}
            onChange={onChange}
            didCreateEditor={_didCreateEditor}
        >
            <Toolbar css={ToolbarStyle} />
            <Editor css={EditorContent}/>
        </Container>
    );
};

export default Koenig;

const ContainerStyle = tw`my-2 px-2 md:mx-auto md:my-16 max-w-xl w-full`;
const ToolbarStyle = tw`flex`;
const EditorContent = tw`prose`;