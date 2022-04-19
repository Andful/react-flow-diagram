import React from 'react';
import { NodeId, NodeComponentType } from 'react-flow-diagram';
import { AppContext } from '../App';
import { HandleProps } from '../Handle'
import Label from '../Label';
import CharacterEditor from '../CharacterEditor'
import DialogueEditor from '../DialogueEditor'
import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid'

export interface DialogueOptionsNodeProps {
    id: NodeId,
    type: "dialogue-options-node",
    character: string | null,
    options: {
        label: string,
        value: string
    }[],
}

const DialogOptionWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: center;
    border-bottom: 3px lightgray solid;
`

const DialogEditorWrapper = styled.div`
    flex: 1 1 auto;
`

const HandlerWrapper = styled.div`
    position: absolute;
    flex: 0 0 0;
    right: 0;
`

const Delete = styled.button`
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Add = styled.button`
    width: 100%;
`

const DialogueNode: NodeComponentType<DialogueOptionsNodeProps, HandleProps> = ({ id, character, options, Handler }) => {
    const { setNodeProps } = React.useContext(AppContext);
    return <>
        <Handler id={`${id}-left`} direction={"left"} />
        <Label label="character">
            <CharacterEditor character={character}
                onCharacterChange={character => setNodeProps({ id, character })} />
        </Label>
        <Label label="dialogue">
            {options
                .map(({ label, value }, i) =>
                    <DialogOptionWrapper>
                        <DialogEditorWrapper>
                            <DialogueEditor
                                key={label}
                                dialogue={value}
                                onDialogueChange={
                                    value => setNodeProps({
                                        id,
                                        options: [
                                            ...options.slice(0, i),
                                            { label, value },
                                            ...options.slice(i + 1)
                                        ]
                                    })} />
                        </DialogEditorWrapper>
                        <Delete onClick={() => setNodeProps({
                            id,
                            options: [
                                ...options.slice(0, i),
                                ...options.slice(i + 1)
                            ]
                        })}><svg style={{flex: "1 1 auto"}} viewBox="0 0 64 64"><path transform="scale(4)" stroke="black" stroke-width="2" d="M 4 4 L 12 12 M 4 12 L 12 4"></path></svg></Delete>
                        <HandlerWrapper>
                            <Handler id={`${id}-${label}`} direction={"right"} />
                        </HandlerWrapper>
                    </DialogOptionWrapper>
                )}
            <Add onClick={() => setNodeProps({ id, options: [...options, { label: uuidv4(), value: "" }] })}>+</Add>
        </Label>
    </>
}

export default DialogueNode;