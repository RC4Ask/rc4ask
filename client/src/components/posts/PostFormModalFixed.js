import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import { addPost } from '../../actions/post';

const PostFormModalFixed = ({
  addPost,
  setShowing,
  auth: { user, loading },
  module: { name, _id, categoryAcronym },
}) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    author: `${user._id}`,
    module: `${_id}`,
  });

  const { title, text, author, module } = formData;

  const closeModalHandler = () => {
    setShowing(false);
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const newPost = { post: formData };
    addPost(newPost);
    closeModalHandler();
    // console.log(newPost);
  };

  const actions = (
    <Fragment>
      <button type="submit" form="myform" className="ui button red-button">
        Post
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
          {`${categoryAcronym}`} - {`${name}`}
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
    !loading &&
    user &&
    module && (
      <Modal
        onDismiss={closeModalHandler}
        title="Create a Post"
        content={content}
        actions={actions}
      />
    )
  );
};

PostFormModalFixed.propTypes = {
  module: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  addPost,
})(PostFormModalFixed);
