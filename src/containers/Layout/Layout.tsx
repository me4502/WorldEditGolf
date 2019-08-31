import {FunctionComponent} from "react";
import * as React from 'react';
import {NavEngineHub} from "../NavEngineHub/NavEngineHub";

export const Layout: FunctionComponent = (props) => (
    <div>
        <NavEngineHub/>
        {props.children}
    </div>
);
