import * as React from "react";
import WrappingView from "../WrappingView";
import StringCard from "./StringCard";

interface IProps {
    title: string;
    strings: string[];
}

const StringListView: React.FC<IProps> = ({title, strings}) => {
    return (
        <WrappingView title={title}>
            {strings.map((value, i) => {
                return <StringCard value={value} key={i}/>;
            })}
        </WrappingView>
    );
};

export default StringListView;
