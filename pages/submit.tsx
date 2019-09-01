import React, { useEffect } from "react";
import { Layout } from "../src/containers/Layout/Layout";
import Head from "next/head";
import { useState } from "react";
import styled from "styled-components";
import { FileSelector } from "../src/components/Input/FileSelector";
import Button from "../src/components/Input/Button";
import { TextArea } from "../src/components/Input/TextArea";
import Input from "../src/components/Input/Input";
import {useAuthenticatedFetch} from '../src/components/Auth';

const Container = styled.div``;

const MIN_DESCRIPTION = 30;

type SchematicType = "start" | "test";

interface FileToLoad {
  type: SchematicType;
  value: File;
}

type Submitting = 'loading' | 'failed' | 'success' | undefined;

const Submit = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [start, setStart] = useState<string | undefined>();
  const [test, setTest] = useState<string | undefined>();
  const [loading, setLoading] = useState<FileToLoad | undefined>();
  const [submitting, setSubmitting] = useState<Submitting>();

  const filter = (file: File) => file.name.endsWith(".schem");

  const isValid = !loading && !!start && !!test && !!name && !!description;

  const setLoadingFile = (type: SchematicType) => (value?: File) => {
    if (value) {
      setLoading({ type, value });
    } else {
      setLoading(undefined);
    }
  };

  useEffect(() => {
    if (loading) {
      const { value, type } = loading;

      const reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onload = () => {
        let result = reader.result;

        if (typeof result !== "string") {
          throw new Error("Invalid result! Recieved type: " + typeof result);
        }

        result = result.split("base64,")[1];

        if (type === "test") {
          setTest(result);
        } else if (type === "start") {
          setStart(result);
        }

        setLoading(undefined);
      };

      return () => reader.abort();
    }
  }, [loading]);

  const fetch = useAuthenticatedFetch();

  const submitGolf = () => {
    if (!isValid || submitting) {
      return;
    }



  };

  return (
    <Container>
      <Input onChange={setName} name="Title" />
      <TextArea onChange={setDescription} name="Description" />
      <FileSelector
        onChange={setLoadingFile("start")}
        accept=".schem"
        filter={filter}
        name="Start Schematic"
      />
      <FileSelector
        onChange={setLoadingFile("test")}
        accept=".schem"
        filter={filter}
        name="Test Schematic"
      />
      <Button onClick={submitGolf} disabled={!isValid}>Upload Golf</Button>
    </Container>
  );
};

const Page = () => {
  return (
    <Layout>
      <Head>
        <title>Submit - WorldEdit Golf</title>
      </Head>
      <Submit />
    </Layout>
  );
};

Page.getInitialProps = () => ({});

export default Page;
