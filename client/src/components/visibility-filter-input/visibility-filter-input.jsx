import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./styles-visibility-filter.scss";
import Form from "react-bootstrap/Form";

import { setFilter } from "../../actions/actions";

function VisibilityFilterInput(props) {
  return (
    <div className="fixed-bottom">
      <Form.Control
        className="barfilter"
        onChange={e => props.setFilter(e.target.value)}
        value={props.visibilityFilter}
        placeholder="filter movies"
      />
    </div>
  );
}

// Here mapStateToProps is null, because we are indicating where the reducer is going to take or send its value. and in this asi is from value={props.visibilityFilter}
export default connect(null, { setFilter })(VisibilityFilterInput);
