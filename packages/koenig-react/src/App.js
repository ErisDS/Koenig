import * as React from 'react';
import {Editor, Container, Toolbar} from 'react-mobiledoc-editor';
import {useParams} from 'react-router-dom';

function App() {
    //http://localhost:2368/ghost/api/admin/posts/62d81fcc5133452a4e172308/
    const pr = useParams();
    const [post, setPost] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:2368/ghost/api/admin/posts/${pr.id}/`);
            const data = await response.json();
            setPost(data.posts[0]);
        };
        fetchData();
    }, [pr]);

    React.useEffect(() => {
        if (post){
            document.title = post?.title;
        }
    }, [post]);
    return (
        <>
            <h1 className="text-3xl text-center">The Editor</h1>
            <Container>
                <Toolbar className="flex" />
                <Editor>{post?.plaintext}</Editor>
            </Container>
        </>
    );
}

export default App;
