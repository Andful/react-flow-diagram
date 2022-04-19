import styled from "@emotion/styled"
import React from "react"

const Delete =  styled.button`
    width: 18px;
    height: 18px;
    background-color: lightgray;
    display: flex;
    justify-content: center;
    aligh-items: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    overflow: hidden;
    margin: 2px;
    cursor: pointer;
`
interface DeleteButtonProps {
    style?: Partial<React.CSSProperties>
    onClick: () => void,
}

const DeleteButton = ({ style, onClick }: DeleteButtonProps) => <Delete style={style} onClick={onClick}>
                        <svg style={{ flex: `1 1 auto` }} viewBox="0 0 64 64">
                            <path transform='scale(4)' stroke='black' strokeWidth={2} d="M 4 4 L 12 12 M 4 12 L 12 4" />
                        </svg>
                    </Delete>

export default DeleteButton