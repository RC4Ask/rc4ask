import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import { updatePost } from '../../actions/post';

const EditPostFormModal = ({ updatePost, setShowing, post }) => {
  const [formData, setFormData] = useState({
    title: post.title,
    text: post.text,
  });

  const { title, text } = formData;

  const closeModalHandler = () => {
    setShowing(false);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const newPost = { post: formData };
    updatePost(newPost, post._id);
    closeModalHandler();
  };

  const actions = (
    <Fragment>
      <button type="submit" form="myform" className="ui button red-button">
        Update
      </button>
      <button onClick={closeModalHandler} className="ui button">
        Cancel
      </button>
    </Fragment>
  );

  const content = (
    <form id="myform" className="ui form" onSubmit={(e) => onSubmit(e)}>
      <div className="field">
        <label className="header">Category</label>
        <div className="ui input">
          {`${post.categoryAcronym}`} - {`${post.moduleName}`}
        </div>
      </div>
      <div className="field">
        <label className="header">Summary</label>
        <div className="ui input">
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => onChange(e)}
            placeholder="Write one sentence summary"
            required
          />
        </div>
      </div>
      <div className="field">
        <label className="">Content</label>
        <div className="ui input">
          <textarea
            name="text"
            value={text}
            onChange={(e) => onChange(e)}
            placeholder="Write details for the question"
            required
          ></textarea>
        </div>
      </div>
    </form>
  );

  return (
    <Modal
      onDismiss={closeModalHandler}
      title="Update Post"
      content={content}
      actions={actions}
    />
  );
};

EditPostFormModal.propTypes = {
  updatePost: PropTypes.func.isRequired,
};

export default connect(null, {
  updatePost,
})(EditPostFormModal);
