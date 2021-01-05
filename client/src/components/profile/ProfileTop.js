import React, { Fragment, useState } from 'react';
import Badge from '@material-ui/core/Badge';
import { Link } from 'react-router-dom';
import ChangeProfileModal from './ChangeProfileModal';

const ProfileTop = ({ user, profile, setShowingHeader }) => {
  const [isShowingPhoto, setShowingPhoto] = useState(false);
  return (
    <Fragment>
      <div className="ui segment">
        <div className="ui grid" style={{ backgroundColor: '#00A8A8' }}>
          <div
            className="sixteen wide column center-text white-text"
            style={{ padding: '2rem' }}
          >
            <div>
              {user._id === profile.user ? (
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={
                    <button
                      onClick={() => setShowingPhoto(true)}
                      className="circular ui icon button"
                    >
                      <i className="icon camera"></i>
                    </button>
                  }
                >
                  <img
                    className="ui small circular centered image"
                    style={{ position: 'relative' }}
                    src={profile.avatar}
                    alt=""
                  />
                </Badge>
              ) : (
                <img
                  className="ui small circular centered image"
                  style={{ position: 'relative' }}
                  src={profile.avatar}
                  alt=""
                />
              )}
            </div>
            <div className="splitscreen">
              <h4 className="hide-buttonA large">
                {`${profile.name} `}
                {user._id === profile.user && (
                  <button
                    onClick={() => setShowingHeader(true)}
                    className="invisible-button hide-buttonB"
                  >
                    <i
                      className="ui tiny white icon edit outline"
                      style={{ color: 'white' }}
                    ></i>
                  </button>
                )}
              </h4>
            </div>
            {profile.status && profile.status != '0' && (
              <div className="lead">{`${profile.status}`}</div>
            )}
            <div className="icons">
              {profile.social && profile.social.website && (
                <a
                  href={`${profile.social.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="white-link"
                >
                  <i className="big globe icon"></i>
                </a>
              )}
              {profile.social && profile.social.twitter && (
                <a
                  href={`${profile.social.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="white-link"
                >
                  <i className="big twitter icon"></i>
                </a>
              )}
              {profile.social && profile.social.facebook && (
                <a
                  href={`${profile.social.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="white-link"
                >
                  <i className="big facebook icon"></i>
                </a>
              )}
              {profile.social && profile.social.linkedin && (
                <a
                  href={`${profile.social.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="white-link"
                >
                  <i className="big linkedin icon"></i>
                </a>
              )}
              {profile.social && profile.social.youtube && (
                <a
                  href={profile.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="white-link"
                >
                  <i className="big youtube icon"></i>
                </a>
              )}
              {profile.social && profile.social.instagram && (
                <a
                  href={`${profile.social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="white-link"
                >
                  <i className="big instagram icon"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {isShowingPhoto && (
        <ChangeProfileModal
          setShowingPhoto={setShowingPhoto}
          profile={profile}
        />
      )}
    </Fragment>
  );
};

export default ProfileTop;
