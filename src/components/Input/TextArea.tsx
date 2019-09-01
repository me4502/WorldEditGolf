import { FunctionComponent } from "react";
import styled from "styled-components";
import { Label } from "./Label";

export interface TextAreaProps {
  name: string;
  onChange?: (value: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 6.5px 0;
  textarea {
    font-family: inherit;
    font-size: 1rem;
    min-height: 100px;
    border-radius: 4px;
    border: solid 2px rgba(28, 28, 28, 0.3);
    padding: 8px;
    margin: 6.5px 0;
    outline: none;
  }
`;

export const TextArea: FunctionComponent<TextAreaProps> = ({
  name,
  onChange,
  ...rest
}) => {
  const changed = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange((e.target.value || "").trim());
    }
  };

  return (
    <Container {...rest}>
      <Label>{name}</Label>
      <textarea onChange={changed} />
    </Container>
  );
};

export default TextArea;
