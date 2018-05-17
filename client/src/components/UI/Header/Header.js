import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

import classes from './Header.css';
import clockIcon from '../../../assets/img/clock-icon.svg';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

const header = props => {
    const styles = {
        root: {
            flexGrow: 1,
            height: '4.5rem',
        },
        title: {
            fontSize: '2.5rem',
            color: props.theme.palette.primary.contrastText,
        padding: '1rem 2rem 1rem .5rem',
        display: 'inline-block',
        margin: '0 auto 0 0',
        }
    }
    return (
    <AppBar color="primary" style={styles.root} position='static'>
        <Toolbar disableGutters>
            <IconButton>
                {/* <img src={clockIcon} className={classes.Logo} alt="TemporaLite" /> */}
            </IconButton>
            <Typography variant="title" style={styles.title}>    
                Temporalite
            </Typography>
        <div className={classes.NavMenuContainer}>
            <div className={classes.NavMenu}>
                <div className={classes.NavMenuItem}>
                    Workspaces
                </div>
                <div className={classes.NavMenuItem}>
                    Team
                </div>
                <div className={classes.NavMenuItem} onClick={() => props.logout()}>
                    Logout
                </div>
            </div>
        </div>
        </Toolbar>
    </AppBar>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(null, mapDispatchToProps)(withTheme()(header));