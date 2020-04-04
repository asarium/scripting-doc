import * as React from "react";
import WrappingView from "../WrappingView";
import EnumCard from "./EnumCard";

interface IProps {
    enums: {
        [name: string]: number;
    };
}

function mapEnums<T>(enums: {
    [name: string]: number;
}, mapper: (name: string, value: number) => T) {
    const result: T[] = [];
    for (const key in enums) {
        if (enums.hasOwnProperty(key)) {
            result.push(mapper(key, enums[key]));
        }
    }
    return result;
}

const EnumsView: React.FC<IProps> = ({enums}) => {
    return (
        <WrappingView title={"Enums"}>
            {mapEnums(enums, (name, value) => {
                return <EnumCard name={name} value={value} key={name}/>;
            })}
        </WrappingView>
    );
};

export default EnumsView;
