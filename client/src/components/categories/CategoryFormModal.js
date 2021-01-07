import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ModalDropdown from '../ModalDropdown';
import { Dropdown } from 'semantic-ui-react';
import { addRequest } from '../../actions/request';

const CategoryFormModal = ({ setShowing, addRequest }) => {
  const categoryOptions = [
    { key: 'ie1', value: 'Ideas & Exposition 1', text: 'Ideas & Exposition 1' },
    { key: 'ie2', value: 'Ideas & Exposition 2', text: 'Ideas & Exposition 2' },
    { key: 'js', value: 'Junior Seminar', text: 'Junior Seminar' },
    { key: 'ss', value: 'Senior Seminar', text: 'Senior Seminar' },
  ];
  
  const [formData, setFormData] = useState({
    category: '',
    module: '',
  });
  const { category, module } = formData;

  const closeModalHandler = () => {
    setShowing(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addRequest(formData);
    closeModalHandler();
  };

  const content = (
    <form id="myform" className="ui form" onSubmit={(e) => onSubmit(e)}>
      <div className="field">
        <label className="header">Category</label>
        <Dropdown
          placeholder="Select Category"
          fluid
          search
          selection
          options={categoryOptions}
          onChange={(e, { value }) =>
            setFormData({ ...formData, category: value })
          }
          required
        />
      </div>
      <div className="field">
        <label className="header">Module Code</label>
        <div className="ui input">
          <input
            type="text"
            name="module"
            placeholder="Module Code"
            value={module}
            onChange={(e) =>
              setFormData({ ...formData, module: e.target.value })
            }
            required
          />
        </div>
      </div>
    </form>
  );

  const actions = (
    <Fragment>
      <button type="submit" form="myform" className="ui button red-button">
        Request
      </button>
      <button onClick={closeModalHandler} className="ui button">
        Cancel
      </button>
    </Fragment>
  );

  return (
    <ModalDropdown
      onDismiss={closeModalHandler}
      title="Request New Module"
      content={content}
      actions={actions}
    />
  );
};

CategoryFormModal.propTypes = {
  addRequest: PropTypes.func.isRequired,
};

export default connect(null, { addRequest })(CategoryFormModal);
