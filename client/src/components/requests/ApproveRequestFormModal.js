import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import { addUniModule, addModule } from '../../actions/module';

const ApproveRequestFormModal = ({
  setFormShowing,
  request,
  addUniModule,
  addModule,
}) => {
  const [cat, setCat] = useState(null);
  const [formData, setFormData] = useState({
    category: {
      name: request.category,
    },
    module: {
      name: request.module,
      title: '',
      description: '',
      category: '',
      logo: '',
    },
    request: request._id,
  });
  
  const { category, module } = formData;

  useEffect(() => {
    axios.get(`/categories/name/${category.name}`).then(({ data }) => {
      setFormData({
        ...formData,
        module: {
          ...module,
          category: data._id,
        },
      });
      setCat(data ? data : null);
    });
  }, []);


  const onSubmit = (e) => {
    e.preventDefault();
    if (cat) {
      const newModule = { module: module, request: request._id };
      addModule(newModule, request._id);
      // console.log(newModule);
    } else {
      addUniModule(formData, request._id);
      // console.log(formData);
    }
  };

  const closeModalHandler = () => {
    setFormShowing(false);
  };

  const actions = (
    <Fragment>
      <button type="submit" form="myform" className="ui button red-button">
        Add Module
      </button>
      <button onClick={closeModalHandler} className="ui button">
        Cancel
      </button>
    </Fragment>
  );



  const content = (
    <Fragment>
      <div className="field">
        <label className="header">Category</label>
        <div className="ui input">
          <input
            disabled={true}
            type="text"
            name="category"
            placeholder="Category"
            value={category.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: { ...module, name: e.target.value },
              })
            }
            required
          />
        </div>
      </div>
      <div className="field">
        <label className="header">Module Code</label>
        <div className="ui input">
          <input
            type="text"
            name="moduleName"
            placeholder="Module Code"
            value={module.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                module: { ...module, name: e.target.value },
              })
            }
            required
          />
        </div>
      </div>
      <div className="field">
        <label className="header">Module Name</label>
        <div className="ui input">
          <input
            type="text"
            name="title"
            placeholder="Module Name"
            value={module.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                module: { ...module, title: e.target.value },
              })
            }
            required
          />
        </div>
      </div>
      <div className="field">
        <label className="header">Description</label>
        <div className="ui input">
          <textarea
            type="text"
            name="description"
            placeholder="Description"
            value={module.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                module: { ...module, description: e.target.value },
              })
            }
            required
          />
        </div>
      </div>
      <div className="field">
        <label className="header">Logo</label>
        <div className="ui input">
          <input
            type="text"
            name="logo"
            placeholder="Logo URL"
            value={module.logo}
            onChange={(e) =>
              setFormData({
                ...formData,
                module: { ...module, logo: e.target.value },
              })
            }
            required
          />
        </div>
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      <div>
        <Modal
          onDismiss={closeModalHandler}
          title={'Module Details'}
          content={
            <form id="myform" className="ui form" onSubmit={(e) => onSubmit(e)}>
              {content}
            </form>
          }
          actions={actions}
        />
      </div>
    </Fragment>
  );
};

ApproveRequestFormModal.propTypes = {
  addUniModule: PropTypes.func.isRequired,
  addModule: PropTypes.func.isRequired,
};

export default connect(null, { addUniModule, addModule })(
  ApproveRequestFormModal
);
