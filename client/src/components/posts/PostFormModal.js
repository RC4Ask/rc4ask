import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Modal from '../Modal';
import { getFollowedModules } from '../../actions/module';
import { addPost } from '../../actions/post';
// import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ReactHtmlParser from 'react-html-parser';

const PostFormModal = ({
  addPost,
  setShowing,
  setSelectedModule,
  getFollowedModules,
  module: { followedModules, loading },
  user,
}) => {
  useEffect(() => {
    getFollowedModules();
  }, [getFollowedModules]);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    author: `${user._id}`,
    module: '',
  });

  const { title, text, author, module } = formData;

  const closeModalHandler = () => {
    setShowing(false);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // const handleTextEditor = (e, editor) => {
  //   console.log(editor.getData());
  //   setFormData({ ...formData, text: ReactHtmlParser(editor.getData()) });
  // }

  const onSubmit = (e) => {
    e.preventDefault();
    const newPost = { post: formData };
    addPost(newPost);
    setSelectedModule(formData.module);
    closeModalHandler();
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
        <select
          name="module"
          value={module}
          onChange={(e) => onChange(e)}
          className="ui selection dropdown"
          required
        >
          <option value="">Select Post Category</option>
          {followedModules.length > 0 &&
            followedModules.map((university) =>
              university.modules.map((module) => (
                <option
                  key={module._id}
                  value={`${module._id}`}
                >{`${university.acronym} - ${module.name}`}</option>
              ))
            )}
        </select>
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
          {/* <CKEditor 
            editor={ClassicEditor}
            onChange={handleTextEditor}
          /> */}
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
    followedModules &&
    user && (
      <Modal
        onDismiss={closeModalHandler}
        title="Create a Post"
        content={content}
        actions={actions}
      />
    )
  );
};

PostFormModal.propTypes = {
  module: PropTypes.object.isRequired,
  getFollowedModules: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  module: state.module,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getFollowedModules,
  addPost,
})(PostFormModal);
