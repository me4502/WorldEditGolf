import { FunctionComponent, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Button from "./Button";
import { Label } from "./Label";

interface FileSelectorProps {
  name: string;
  accept?: string;
  onChange?: (file?: File) => void;
  filter?: (file: File) => boolean;
}

const Input = styled.input`
  visibility: hidden;
  position: absolute;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 6.5px;
  margin-bottom: 6.5px;
`;

const ActionContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const FileName = styled.span`
  font-size: 1.2rem;
  margin-left: 1rem;
`;

export const FileSelector: FunctionComponent<FileSelectorProps> = ({
  name,
  filter,
  accept,
  onChange,
  ...rest
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const inputRef = useRef<HTMLInputElement>();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files).filter(filter || (() => true));
    setFiles(f);
    if (onChange) {
      onChange(f[0]);
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(files[0]);
    }
  }, [files]);

  const openFilePicker = () => {
    inputRef.current!.click();
  };

  return (
    <Container {...rest}>
      <Label>{name}</Label>
      <ActionContainer>
        <Button onClick={openFilePicker}>Select File</Button>
        <FileName>{files[0] && files[0].name}</FileName>
      </ActionContainer>
      <Input
        ref={inputRef}
        onChange={onInputChange}
        {...{ accept }}
        type="file"
      />
    </Container>
  );
};
