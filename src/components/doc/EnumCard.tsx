import {CardHeader, Collapse, createStyles, IconButton, Theme} from "@material-ui/core";
import React from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme: Theme) => createStyles({
        root:       {
            width:  270,
            margin: 5,
        },
        title:      {
            fontSize: 12,
        },
        pos:        {
            marginBottom: 12,
            fontSize:     10,
        },
        expand:     {
            transform:  "rotate(0deg)",
            marginLeft: "auto",
            transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: "rotate(180deg)",
        },
    }),
);

interface IProps {
    name: string;
    value: number;
}

const EnumCard: React.FC<IProps> = ({name, value}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.root}>
            <CardHeader
                action={
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon/>
                    </IconButton>
                }
                title={name}
                titleTypographyProps={{className: classes.title}}
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit mountOnEnter>
                <CardContent>
                    <Typography className={classes.pos} color="textSecondary">
                        Numerical value
                    </Typography>
                    <Typography variant="body2" component="p">
                        {value}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default EnumCard;
