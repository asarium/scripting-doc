import {createHashHistory} from "history";
import {configure, spy} from "mobx";
import "mobx-react-lite/batchingForReactDom";
import * as React from "react";
import ReactDOM from "react-dom";
import {Router} from "react-router-dom";
import "typeface-roboto";
import "./index.scss";
import ReactApp from "./ReactApp";
import {StoresProvider} from "./state/useStores";

configure({enforceActions: "observed"});

const history = createHashHistory();

const ReactRoot: React.FC = () => {
    return <Router history={history}>
        <StoresProvider>
            <ReactApp/>
        </StoresProvider>
    </Router>;
};

ReactDOM.render(<ReactRoot/>
    , document.getElementById("react-root"));
