import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
} from '@material-ui/core';

import getRandomColor from '../../../services/randomColor';
import CategoryListControls from '../../CategoryManager/CategoryList/CategoryListControls';
import CategoryList from '../../CategoryManager/CategoryList/CategoryList';
import { checkIfCategoryExists, addCategory } from '../../../store/actions';

class CategoryManager extends Component {
  state = {
    input: '',
    color: '',
    anchorEl: null,
  }

  componentDidMount() {
    if (this.state.color === '') {
      this.initColor();
    }
  }

  initColor = () => {
    this.setState({
      color: getRandomColor(),
    });
  }

  handleInput = (event) => {
    this.setState({
      input: event.target.value,
    });
  }

  handleOpen = event =>
    this.setState({
      anchorEl: event.currentTarget,
    });

  handleClose = () =>
    this.setState({
      anchorEl: null,
    });

  handleChangeComplete = (color, _) => {
    this.setState({ color: color.hex, anchorEl: null });
  }

  resetInput = () => {
    this.setState({
      input: '',
      color: getRandomColor(),
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.props.checkIfCategoryExists(this.state.input)) {
      return;
    }
    this.props.addCategory({
      name: this.state.input,
      color: this.state.color,
    });
    this.resetInput();
  }

  render() {
    const {
      open,
      handleClose,
      categories,
    } = this.props;
    const {
      input,
      color,
      anchorEl,
    } = this.state;
    return (
      <Dialog
        style={{ fontSize: '2.5rem', padding: '2rem' }}
        maxWidth="md"
        fullWidth
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Manage Workspace Categories</DialogTitle>
        <div style={{ width: '80%', padding: '2rem', margin: '0 auto' }}>
          <CategoryListControls
            input={input}
            handleInput={this.handleInput}
            handleSubmit={this.handleSubmit}
            color={color}
            anchorEl={anchorEl}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            handleChangeComplete={this.handleChangeComplete}
          />
          <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <CategoryList
              categories={categories}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  checkIfCategoryExists: cat => dispatch(checkIfCategoryExists(cat)),
  addCategory: category => dispatch(addCategory(category)),
});

const mapStateToProps = state => ({
  categories: state.workspace.category_set,
});

CategoryManager.propTypes = {
  categories: PropTypes.array.isRequired,
  checkIfCategoryExists: PropTypes.func.isRequired,
  addCategory: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryManager);
