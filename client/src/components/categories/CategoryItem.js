import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { followModule, unfollowModule } from '../../actions/module';

const CategoryItem = ({
  module: { _id, name, title, description, followers, uniAcronym, logo},
  // university,
  auth: { user },
  followModule,
  unfollowModule,
}) => {
  const [icon, setIcon] = useState(
    followers ? (followers.indexOf(user._id) !== -1 ? 'minus' : 'plus') : 'plus'
  );

  const onClick = () => {
    if (icon === 'plus') {
      setIcon('minus');
      followModule(_id, name);
    } else {
      setIcon('plus');
      unfollowModule(_id, name);
    }
  };

  return (
    <div className="ui card" style={{ display: 'flex' }}>
      <div className="ui slide masked reveal image">
        <div className="visible content">
          <img src={logo} style={{maxHeight: "20vh",minHeight: "20vh", minWidth: '100%', backgroundPosition: "center"}}/>
        </div>
        <div className="hidden content">
          <p className="module-padding">{`${description}`}</p>
        </div>
      </div>
      <div className="content">
        <Link to={`/${uniAcronym}/${name}`} className="header">
          {`${name}`}
        </Link>
        <div className="meta">
          <span className="date">{`${title}`}</span>
        </div>
      </div>
      <div className="extra content">
        <i className="users icon"></i>
        {`${followers.length}`} Followers
        <button className="invisible-button right floated">
          <i
            onClick={onClick}
            className={`${icon} red-text square outline icon`}
          />
        </button>
      </div>
    </div>
  );
};

CategoryItem.propTypes = {
  followModule: PropTypes.func.isRequired,
  unfollowModule: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { followModule, unfollowModule })(
  CategoryItem
);
