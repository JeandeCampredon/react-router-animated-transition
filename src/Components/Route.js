import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';

class AnimatedRoute extends Route {
  render() {
    const child = super.render();

    return child ? React.cloneElement(child, { animation: this.props.animation }) : null;
  }
}

AnimatedRoute.defaultProps = {
  animation: {},
};
AnimatedRoute.propTypes = {
  ...Route.propTypes,
  animation: PropTypes.object,
};

export default AnimatedRoute;
