import React from 'react';
import { Transition, CSSTransition, TransitionGroup } from 'react-transition-group';

export const getChildren = ({ child, animation: parentAnimation }) => {
  if (!child) return null;

  const childAnimation = child.props.animation || {};

  if (!childAnimation) return child;

  const animation = parentAnimation ? { ...parentAnimation, ...childAnimation } : childAnimation;
  animation.timeout = animation.timeout || 600;

  const { classNames } = animation;

  if (classNames) {
    const containerClassName = typeof classNames === 'string' ? classNames : undefined;
    const { container = <div className={containerClassName} /> } = animation;
    const animatedChild = React.cloneElement(child, { animation });
    return (
      <CSSTransition {...animation} key={child.key}>
        {container ? React.cloneElement(container, {}, animatedChild) : animatedChild}
      </CSSTransition>
    );
  }

  return (
    <Transition {...animation} key={child.key}>
      {status => React.cloneElement(child, { animation: { ...animation, status } })}
    </Transition>
  );
};
export const getContainer = ({ animation }) => (
  <TransitionGroup component={null} timeout={300} {...(animation || {})} />
);
