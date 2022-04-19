import styled from '@emotion/styled'
import React from 'react'



const Wrapper = styled.div`
    margin: 15px 5px;
`

const Label = styled.label`
    background-color: lightgray;
    padding: 0px 25px;
`

const Content = styled.div`
    border: 3px solid lightgray;
`

const DefaultLabel = ({ label, children }: { label: string, children: React.ReactNode }) =>
    <Wrapper>
        <Label>{label}</Label>
        <Content>
            {children}
        </Content>
    </Wrapper>

export default DefaultLabel;