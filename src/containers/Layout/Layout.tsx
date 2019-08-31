import {FunctionComponent} from "react";
import * as React from 'react';
import {NavEngineHub} from "../NavEngineHub/NavEngineHub";
import {BrandHeader} from "../BrandHeader/BrandHeader";
import {styled} from "../../components/style/styled";
import {rem} from "../../components/style/rem";

const PageContainer = styled.div`
  padding: 0 ${rem(152)};
`;

export const Layout: FunctionComponent = (props) => (
    <div>
        <NavEngineHub/>
        <PageContainer>
            <BrandHeader />
            {props.children}
        </PageContainer>
    </div>
);
