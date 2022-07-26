import * as React from 'react';
import {Editor, Container, Toolbar} from 'react-mobiledoc-editor';
import './index.css';

function KoenigEditor() {
    return (
        <>
            <h1>The Editor!</h1>
            <Container>
                <Toolbar />
                <Editor/>
            </Container>
        </>
    );
}

export default KoenigEditor;
