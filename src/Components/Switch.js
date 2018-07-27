import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import * as defaultConfiguration from './Configurations/ReactTransitionGroup';

class AnimatedSwitch extends Switch {
  render() {
    const child = super.render();
    const { configuration, animation, ...props } = this.props;

    return React.cloneElement(configuration.getContainer({ child, animation, props }), {
      children: configuration.getChildren({ child, animation, props }),
    });
  }
}

AnimatedSwitch.propTypes = {
  ...Switch.propTypes,
  animation: PropTypes.object,
  configuration: PropTypes.object,
};

AnimatedSwitch.defaultProps = {
  configuration: defaultConfiguration,
};

const keyPopulatedElement = (element, index) => {
  if (!React.isValidElement(element) || element.key) return element;
  return React.cloneElement(element, { key: `__animated_key_${index}` });
};

const KeyedAnimatedSwitch = ({ children, ...props }) => (
  <AnimatedSwitch {...props}>{React.Children.map(children, keyPopulatedElement)}</AnimatedSwitch>
);

KeyedAnimatedSwitch.propTypes = {
  children: PropTypes.node,
};

export default KeyedAnimatedSwitch;
