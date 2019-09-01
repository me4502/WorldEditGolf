import {FunctionComponent} from "react";
import * as React from 'react';
import {NavEngineHub} from "../NavEngineHub/NavEngineHub";
import {AuthProvider, useIsLoggedIn} from '../../components/Auth';
import {BrandHeader} from "../BrandHeader/BrandHeader";
import {styled} from "../../components/style/styled";
import {rem} from "../../components/style/rem";
import { BrandFooter } from "../BrandFooter/BrandFooter";

const PageContainer = styled.div`
  padding: 0 2rem;
  max-width: 1000px;
  width: 100%;
  margin: auto;
  flex: 1;
`;

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const LayoutInner: FunctionComponent = ({children, ...rest}) => {
    const isAuthenticated = useIsLoggedIn();
    return (
        <LayoutContainer {...rest}>
            <NavEngineHub isAuthenticated={isAuthenticated} />
            <PageContainer>
                <BrandHeader />
                {children}
            </PageContainer>
            <BrandFooter />
        </LayoutContainer>
    );
};

export const Layout: FunctionComponent = ({children, ...rest}) => {
    return (
        <AuthProvider>
            <LayoutInner {...rest}>
                {children}
            </LayoutInner>
        </AuthProvider>
    );
};
