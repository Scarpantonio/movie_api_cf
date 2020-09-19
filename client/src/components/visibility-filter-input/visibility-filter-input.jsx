import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./styles-visibility-filter.scss";
import Form from "react-bootstrap/Form";

import { setFilter } from "../../actions/actions";

function VisibilityFilterInput(props) {
  return (
    <div class="fixed-bottom">
      <Form.Control
        className="barfilter"
        onChange={e => props.setFilter(e.target.value)}
        value={props.visibilityFilter}
        placeholder="filter movies"
      />
    </div>
  );
}

export default connect(null, { setFilter })(VisibilityFilterInput);
