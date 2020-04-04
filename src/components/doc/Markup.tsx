import {Typography} from "@material-ui/core";
import parse from "html-react-parser";
import React from "react";
import sanitizeHtml from "sanitize-html";

interface IProps {
    content: string;
}

const Markup: React.FC<IProps> = ({content}) => {
    const sanitized = sanitizeHtml(content, {
        allowedTags:       ["i", "b", "strong", "em", "br", "ul", "li"],
        allowedAttributes: {},
    });

    return (
        <Typography variant="body2" component="span">
            {parse(sanitized)}
        </Typography>
    );
};

export default Markup;
