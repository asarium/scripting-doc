import {CardHeader, createStyles, Theme} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((_theme: Theme) => createStyles({
        root:  {
            width:  270,
            margin: 5,
        },
        title: {
            fontSize: 12,
        },
    }),
);

interface IProps {
    value: string;
}

const StringCard: React.FC<IProps> = ({value}) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardHeader
                title={value}
                titleTypographyProps={{className: classes.title}}
            />
        </Card>
    );
};

export default StringCard;
