import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ModalDropdown from '../ModalDropdown';
import { Dropdown } from 'semantic-ui-react';
import { addRequest } from '../../actions/request';

const CategoryFormModal = ({ setShowing, addRequest }) => {
  const countryOptions = [
    { key: 'au', value: 'australia', flag: 'au', text: 'Australia' },
    { key: 'ca', value: 'canada', flag: 'ca', text: 'Canada' },
    { key: 'cn', value: 'china', flag: 'cn', text: 'China' },
    { key: 'dk', value: 'denmark', flag: 'dk', text: 'Denmark' },
    { key: 'fi', value: 'finland', flag: 'fi', text: 'Finland' },
    { key: 'de', value: 'germany', flag: 'de', text: 'Germany' },
    { key: 'hk', value: 'hongkong', flag: 'hk', text: 'Hong Kong' },
    { key: 'in', value: 'india', flag: 'in', text: 'India' },
    { key: 'id', value: 'indonesia', flag: 'id', text: 'Indonesia' },
    { key: 'it', value: 'italy', flag: 'it', text: 'Italy' },
    { key: 'jp', value: 'japan', flag: 'jp', text: 'Japan' },
    { key: 'my', value: 'malaysia', flag: 'my', text: 'Malaysia' },
    { key: 'nl', value: 'netherlands', flag: 'nl', text: 'Netherlands' },
    { key: 'nz', value: 'newzealand', flag: 'nz', text: 'New Zealand' },
    { key: 'ph', value: 'philippines', flag: 'ph', text: 'Philippines' },
    { key: 'sg', value: 'singapore', flag: 'sg', text: 'Singapore' },
    { key: 'za', value: 'southafrica', flag: 'za', text: 'South Africa' },
    { key: 'es', value: 'spain', flag: 'es', text: 'Spain' },
    { key: 'ch', value: 'switzerland', flag: 'ch', text: 'Switzerland' },
    { key: 'tw', value: 'taiwan', flag: 'tw', text: 'Taiwan' },
    { key: 'th', value: 'thailand', flag: 'th', text: 'Thailand' },
    { key: 'us', value: 'unitedstates', flag: 'us', text: 'United States' },
    { key: 'vn', value: 'vietnam', flag: 'vn', text: 'Vietnam' },
  ];
  const [country, setCountry] = useState(null);
  const [uniList, setUniList] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    module: '',
  });
  const { category, module } = formData;

  const closeModalHandler = () => {
    setShowing(false);
  };

  useEffect(() => {
    if (country) {
      var countryCode = country.toLowerCase();
      const path = `assets/university/${country}.json`;
      axios.get(path).then((response) => setUniList(response.data));
    }
  }, [country]);

  const uniqueUni = _.uniqBy(uniList, 'name');
  const uniOptions = uniqueUni.map((uni) => ({
    ...uni,
    text: uni.name,
    key: uni.name,
    value: uni.name,
  }));

  const onSubmit = (e) => {
    e.preventDefault();
    addRequest(formData);
    closeModalHandler();
  };

  const content = (
    <form id="myform" className="ui form" onSubmit={(e) => onSubmit(e)}>
      <div className="field">
        <label className="header">Country</label>
        <Dropdown
          placeholder="Select Country"
          fluid
          search
          selection
          options={countryOptions}
          onChange={(e, { value }) => {
            setCountry(value);
            setUniList([]);
            setFormData({ ...formData, category: '' });
          }}
          required
        />
      </div>
      <div className="field">
        <label className="header">Category</label>
        {/* <select name="category" className="ui selection dropdown">
          <option value="">Select a University</option>
          <option value="CS2040S">National University of Singapore</option>
          <option value="CS2030">Nanyang Technological University</option>
        </select> */}
        <Dropdown
          placeholder="Select Category"
          fluid
          search
          selection
          options={uniOptions}
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
