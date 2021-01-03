import { Box, createStyles, makeStyles, Theme, Tooltip, Typography, withStyles } from "@material-ui/core";
import { CallElement } from "fso-ts-generator";
import { FunctionOverload, FunctionParameter } from "fso-ts-generator/dist/build/scripting";
import React from "react";
import { When } from "react-if";
import DocumentationType from "../DocumentationType";
import ElementDescription from "./ElementDescription";
import ElementName from "./ElementName";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paramWithDescription:      {
            textDecorationLine: "underline",
            textDecorationStyle: "dashed",
            textDecorationThickness: "1px",
            textDecorationColor: theme.palette.text.secondary,
            textUnderlineOffset: "5px",
        },
    }),
);

interface IFunctionTooltipProps {
    parameter: FunctionParameter;
}

const FunctionTooltipContent: React.FC<IFunctionTooltipProps> = React.forwardRef<HTMLSpanElement, IFunctionTooltipProps>(({ parameter }, ref) => {
    return (
        <Typography ref={ref} component="span" color="textPrimary">{parameter.description}</Typography>
    );
});

interface IFunctionParameterProps {
    parameter: FunctionParameter;
    startOptional: boolean;
    endOptional: boolean;
}

const FunctionParameterElement: React.FC<IFunctionParameterProps> = 
    React.forwardRef<HTMLSpanElement, IFunctionParameterProps>(({ parameter, startOptional, endOptional }, ref) => {

    const classes = useStyles();

    let nameElement = null;
    if (parameter.name.length > 0) {
        if (parameter.description.length > 0) {
            nameElement = (
                <Tooltip title={
                    <FunctionTooltipContent parameter={parameter} />
                }>
                    <Typography component="span" color="textPrimary" className={classes.paramWithDescription}>{parameter.name}</Typography>
                </Tooltip>
            )
        } else {
            nameElement = <Typography component="span" color="textPrimary">{parameter.name}</Typography>;
        }
    }
    return (
        <span ref={ref}>
            <When condition={startOptional}>
                <Typography style={{ marginLeft: "1px", marginRight: "1px" }} component="span"
                    color="textSecondary">[</Typography>
            </When>
            <When condition={parameter.name.length > 0}>
                {nameElement}
                <Typography style={{ marginLeft: "1px", marginRight: "1px" }} component="span"
                    color="textSecondary">: </Typography>
            </When>
            <DocumentationType type={parameter.type} />
            <When condition={parameter.default.length > 0}>
                <Typography style={{ marginLeft: "1px", marginRight: "1px" }} component="span"
                    color="textSecondary"> = </Typography>
                <Typography component="span" color="textPrimary">{parameter.default}</Typography>
            </When>
            <When condition={endOptional}>
                <Typography style={{ marginLeft: "1px", marginRight: "1px" }} component="span"
                    color="textSecondary">]</Typography>
            </When>
        </span>
    );
});

interface IOverloadProps {
    element: CallElement;
    specificOverload: FunctionOverload;
    showFullPath: boolean;
}

const FunctionOverloadElement: React.FC<IOverloadProps> = ({ element, specificOverload, showFullPath }) => {
    let parameters = null;
    if (specificOverload.length > 0) {
        const optionalStart = specificOverload.findIndex(param => param.optional);

        // Reduce does not like empty arrays so we check for the empty case here just to make sure
        parameters = specificOverload
            .map<React.ReactNode>((param, i) => (
                <FunctionParameterElement
                    parameter={param} key={param.name || i.toString()}
                    startOptional={i == optionalStart}
                    endOptional={optionalStart >= 0 && i == specificOverload.length - 1}
                />
            ))
            .reduce((prev, curr) => [prev, ", ", curr])
    }

    return (
        <Box>
            <DocumentationType type={element.returnType} />
            <ElementName element={element} showFullPath={showFullPath} />
            <Typography component="span" color="textSecondary">(</Typography>
            {parameters}
            <Typography component="span" color="textSecondary">)</Typography>
        </Box>
    );
};

interface IProps {
    element: CallElement;
    showFullPath: boolean;
}

const FunctionElementView: React.FC<IProps> = ({ element, showFullPath }) => {
    return (
        <>
            {element.parameters.map((overload, i) => <FunctionOverloadElement key={i} element={element} showFullPath={showFullPath} specificOverload={overload} />)}
            <ElementDescription element={element} />
            <Box marginLeft={1}>
                <Typography style={{ fontWeight: "bold", marginRight: "4px" }} variant="body2" component="span"
                    color="textSecondary">Returns:</Typography>
                <Typography variant="body2" component="span"
                    color="textPrimary">{element.returnDocumentation}</Typography>
            </Box>
        </>
    );
};

export default FunctionElementView;
