import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProfileModal from '../ProfileModal';
import ReactAvatarEditor from 'react-avatar-editor';
import { changePicture } from '../../actions/profile';

const ChangeProfileModal = ({ setShowingPhoto, profile, changePicture }) => {
  const src = profile.avatar;
  const [state, setState] = useState({
    image: src,
    allowZoomOut: false,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 120,
    preview: null,
    width: 200,
    height: 200,
    editor: null,
  });

  const [formData, setFormData] = useState({
    data: '',
  });

  const handleNewImage = (e) => {
    const file = e.target.files[0];
    const { type } = file;
    if (type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg')) {
      setState({ ...state, image: file });
    }
  };

  const setEditorRef = (editor) => {
    state.editor = editor;
  };

  const onCrop = () => {
    const { editor } = state;
    if (editor) {
      const url = editor.getImageScaledToCanvas().toDataURL();
      setState({ ...state, image: url, scale: 1 });
      formData.data = url;
      // setFormData({ data: url });
    }
  };

  const handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    setState({ ...state, scale: scale });
  };

  const handlePositionChange = (position) => {
    setState({ ...state, position: position });
  };

  const closeModalHandler = () => {
    setShowingPhoto(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
    changePicture(formData);
    closeModalHandler();
    // console.log(newProfile);
  };

  const actions = (
    <Fragment>
      <button
        onClick={(e) => {
          onCrop();
          onSubmit(e);
        }}
        className="ui button red-button"
      >
        Save
      </button>
      <button onClick={closeModalHandler} className="ui button">
        Cancel
      </button>
    </Fragment>
  );

  const content = (
    <div align="center">
      <ReactAvatarEditor
        scale={parseFloat(state.scale)}
        crossOrigin="anonymous"
        width={state.width}
        height={state.height}
        position={state.position}
        ref={setEditorRef}
        onPositionChange={(position) => handlePositionChange(position)}
        rotate={parseFloat(state.rotate)}
        borderRadius={state.width / (100 / state.borderRadius)}
        image={state.image}
      />

      <div
        align="center"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <label htmlFor="file" className="ui icon button">
          <i className="file icon"></i>
          Choose File
        </label>
        <input
          name="newImage"
          accept="image/png, image/jpeg"
          type="file"
          id="file"
          style={{ display: 'none' }}
          onChange={(e) => handleNewImage(e)}
        />
        {/* </div>
      <div className="ui horizontal divider"></div>
      <div> */}
        <input
          className="ui slider range"
          name="scale"
          type="range"
          onChange={(e) => handleScale(e)}
          min={state.allowZoomOut ? '0.1' : '1'}
          max="2"
          step="0.01"
          defaultValue="1"
          style={{ color: '#00A8A8' }}
        />
      </div>
    </div>
  );

  return (
    <ProfileModal
      onDismiss={closeModalHandler}
      title="Profile Photo"
      content={content}
      actions={actions}
    />
  );
};

ChangeProfileModal.propTypes = {
  //   updateProfile: PropTypes.func.isRequired,
  changePicture: PropTypes.func.isRequired,
};

export default connect(null, { changePicture })(ChangeProfileModal);
