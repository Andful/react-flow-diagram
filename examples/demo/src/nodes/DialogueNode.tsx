import React from 'react';
import { NodeId, NodeComponentType } from 'react-flow-diagram';
import { AppContext } from '../App';
import { HandleProps } from '../Handle'
import Label from '../Label';
import CharacterEditor from '../CharacterEditor'
import DialogueEditor from '../DialogueEditor'

export interface DialogueNodeProps {
    id: NodeId,
    type: "dialogue-node",
    character: string | null,
    dialogue: string,
}

const DialogueNode: NodeComponentType<DialogueNodeProps, HandleProps> = ({ id, character, dialogue, Handler }) => {
    const { setNodeProps } = React.useContext(AppContext);
    return <>
        <Handler id={`${id}-left`} direction={"left"}/>
            <Label label="character">
                <CharacterEditor character={character}
                onCharacterChange={character => setNodeProps({id, character})} />
            </Label>
            <Label label="dialogue">
                <DialogueEditor dialogue={dialogue} onDialogueChange={dialogue => setNodeProps({id, dialogue})}/>
            </Label>
        <Handler id={`${id}-right`} direction={"right"}/>
    </>
}

export default DialogueNode;