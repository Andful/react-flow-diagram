import React from 'react';
import { createEditor, Descendant, BaseElement, BaseText } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history'
import styled from '@emotion/styled'

export interface DialogProps {
    dialogue: string,
    onDialogueChange: (dialog: string) => void
}

const Wrapper = styled.div`
    padding: 5px;
`

const Editor = styled.div`
    cursor: text;
`

function descendantsToString(descendants: Descendant[]): string {
    return ((descendants[0] as BaseElement).children[0] as BaseText).text
}

function stringToDescendants(text: string): Descendant[] {
    return [
        {
            children: [{
                text
            }],
        },
    ]
}

const DialogEditor = ({ dialogue, onDialogueChange }: DialogProps) => {
    const editor = React.useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), [])
    return <Wrapper>
        <Editor>
            <Slate editor={editor} value={stringToDescendants(dialogue)} onChange={descendants => {
                onDialogueChange(descendantsToString(descendants))
            }}>
                <Editable placeholder="Enter some plain text..." />
            </Slate>
        </Editor>
    </Wrapper>
}
export default DialogEditor;