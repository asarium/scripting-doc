import {Box} from "@material-ui/core";
import * as React from "react";

interface IProps {
    title: string;
}

const WrappingView: React.FC<IProps> = ({title, children}) => {
    return (
        <div style={{width: "100%"}}>
            <h3>{title}</h3>
            <Box
                display="flex"
                flexWrap="wrap"
                p={1}
                css={{width: "100%"}}
            >
                {children}
            </Box>
        </div>
    );
};

export default WrappingView;
