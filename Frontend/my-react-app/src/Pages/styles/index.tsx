import styled from "styled-components";
interface ButtonVariant {
    variant:"outlined" | "contained"
}
export const Button = styled.button<ButtonVariant>`
padding: 5px 8px;
display: inline-block;
background: ${(props)=>props.variant};
`
