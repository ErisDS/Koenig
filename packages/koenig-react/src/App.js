import * as React from 'react';
import Koenig from './components/Koenig';
import tw from 'twin.macro';
import './index.css';

const KoenigEditor = ({mobiledoc, atoms, keyCommands, didCreateEditor, onChange}) => {
    return (
        <>
            <Title>The Editor!</Title>
            <Koenig
                mobiledoc={mobiledoc}
                atoms={atoms}
                keyCommands={keyCommands}
                didCreateEditor={didCreateEditor}
                onChange={onChange}
            />
        </>
    );
};

export default KoenigEditor;

const Title = tw.h1`font-bold text-2xl`;
