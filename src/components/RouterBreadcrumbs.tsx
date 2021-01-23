import { Breadcrumbs, createStyles, Link, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { useLocation, Link as RouterLink, matchPath } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    breadcrumbs: {
        marginTop: theme.spacing(1.0),
    },
}));

const RouterBreadcrumbs: React.FC<{}> = () => {
    const location = useLocation();
    const styles = useStyles();

    const docMatch = matchPath<{ id: string }>(location.pathname, "/doc/:id");

    let crumbComponents;
    if (docMatch !== null) {
        let niceName = docMatch.params.id;
        if (niceName == "local") {
            niceName = "Loaded Documentation"
        }

        crumbComponents = [
            (
                <Typography color="textPrimary">
                    Documentation
                </Typography>
            ),
            (
                <Typography color="textPrimary">
                    {niceName}
                </Typography>
            ),
        ];
    } else {
        // Generic case
        const pathnames = location.pathname.split("/").filter(x => !!x);
        crumbComponents = pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;

            if (last) {
                return (
                    <Typography color="textPrimary" key={to}>
                        {value}
                    </Typography>
                )
            } else {
                return (
                    <Link color="inherit" component={RouterLink} to={to} key={to}>
                        {value}
                    </Link>
                );
            }
        });
    }

    return (
        <Breadcrumbs aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <Link color="inherit" component={RouterLink} to="/">
                Start
            </Link>
            {crumbComponents}
        </Breadcrumbs>
    );
}

export default RouterBreadcrumbs;
