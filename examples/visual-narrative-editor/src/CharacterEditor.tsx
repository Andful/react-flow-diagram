import React, { useContext, useEffect } from 'react';
import Creatable from 'react-select/creatable';
import { AppContext } from './App';

interface CharacterEditorProps {
    character: string | null,
    onCharacterChange: (e: string | null) => void;
}

const CharacterEditor = ({ character, onCharacterChange }: CharacterEditorProps) => {
    const { charactersReferenceCount, setCharacterReferenceCount} = useContext(AppContext);

    useEffect(() => {
        if (character === null) {
            return;
        }

        let count = charactersReferenceCount.get(character);
        count = count === undefined ? BigInt(0) : count;
        count += BigInt(1);

        const newCharactersReferenceCount = new Map(charactersReferenceCount);
        newCharactersReferenceCount.set(character, count);
        setCharacterReferenceCount(newCharactersReferenceCount);
    }, [])

    return <Creatable
        isClearable
        onChange={(elem) => {
            let newCharactersReferenceCount: Map<string, bigint> | null = null;
            if (character !== null) {
                let count = charactersReferenceCount.get(character);
                if (count === undefined) {
                    throw new Error("unreachable");
                }
                count -= BigInt(1);
                newCharactersReferenceCount = new Map(charactersReferenceCount);
                if (count <= 0) {
                    newCharactersReferenceCount.delete(character);
                } else {
                    newCharactersReferenceCount.set(character, count);
                }
            }
            if (elem !== null) {
                if (newCharactersReferenceCount === null) {
                    newCharactersReferenceCount = new Map(charactersReferenceCount);
                }
                let count = newCharactersReferenceCount.get(elem.value);
                if (count === undefined) {
                    throw new Error("unreachable");
                }
                count += BigInt(1);
                newCharactersReferenceCount.set(elem.value, count);
                onCharacterChange(elem.value);
            } else {
                onCharacterChange(null);
            }

            if (newCharactersReferenceCount !== null) {
                setCharacterReferenceCount(newCharactersReferenceCount);
            }
        }}
        onCreateOption={(newCharacter) => {
            const newCharactersReferenceCount = new Map(charactersReferenceCount);
            newCharactersReferenceCount.set(newCharacter, BigInt(1));
            if (character !== null) {
                let count = newCharactersReferenceCount.get(character);
                if (count === undefined) {
                    throw new Error("unreachable");
                }
                count -= BigInt(1);
                if (count <= 0) {
                    newCharactersReferenceCount.delete(character);
                } else {
                    newCharactersReferenceCount.set(character, count);
                }

            }
            setCharacterReferenceCount(newCharactersReferenceCount);
            onCharacterChange(newCharacter);
        }}
        options={[...charactersReferenceCount.keys()].map((value) => ({ value, label: value }))}
        value={character === null ? null : { value: character, label: character }}
    />
}

export default CharacterEditor;