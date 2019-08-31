import {FunctionComponent} from "react";
import * as React from 'react';
import {NavEngineHub} from "../NavEngineHub/NavEngineHub";
import {BrandHeader} from "../BrandHeader/BrandHeader";
import {styled} from "../../components/style/styled";
import {rem} from "../../components/style/rem";
import {Footer} from "../Footer/Footer";

const PageContainer = styled.div`
  padding: 0 ${rem(152)};
`;

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Layout: FunctionComponent = (props) => (
    <LayoutContainer>
        <NavEngineHub/>
        <PageContainer>
            <BrandHeader />
            {props.children}
        </PageContainer>
        <Footer/>
    </LayoutContainer>
);
