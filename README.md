# react-router-transition-switch

## In short

This library is exposing 2 animated components extending their homonymes in react-router:
- Switch
- Route

And a set of configurations to use the technology that suits you the best:
- react-router-transition
- react-motion (coming soon)
- your very own one ?

The current recommended transition approach for `react-router` is
```js
import {Route, Switch} from 'react-router-dom'
import { Transition, CSSTransition } from 'react-transition-group';

/* you'll need this CSS somewhere
.fade-enter {
  opacity: 0;
  z-index: 1;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 250ms ease-in;
}
*/

<Route render={({ location }) => (
  <TransitionGroup>
    <CSSTransition key={location.key} classNames="fade" timeout={300}>
      <Switch key={location.key} location={location}>
        <Route path="/red" component={Red}/>
        <Route path="/green" component={Green} />
        <Route path="/blue" component={Blue} />
      </Switch>
    </CSSTransition>
  </TransitionGroup>
)}/>
```

This has several problems:
1. All `<Switch>`es transition on every `location` change the same way rather than the specific one reflecting the last change url change
2. You have to pass a `location` to the `<Switch>` for it to work
3. You have the very same transition for every route in a switch

`react-router-animated-transition` simplifies the above example to
```js
import {Route} from 'react-router-dom'
import { Switch, Route } from 'react-router-transition-switch'

/* you'll need this CSS somewhere
.fade-enter {
  opacity: 0;
  z-index: 1;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity 250ms ease-in;
}
*/

<Switch animation={{ classNames: 'fade' }}>
  <Route path="/red" component={Red}/>
  <Route path="/green" component={Green} />
  <Route path="/blue" component={Blue} />
</Switch>
```

## Switch:

it surcharges the render of react router switch to custom the container and child render

```js
class AnimatedSwitch extends Switch {
  render() {
    const child = super.render();
    const { configuration, animation, ...props } = this.props;

    return React.cloneElement(configuration.getContainer({ child, animation, props }), {
      children: configuration.getChildren({ child, animation, props }),
    });
  }
}
```
#### New Porperties
- animation: a custom conf object that will allow you to describe your transition
- configuration: cf configurations later

## Route:

it surcharge the render of react router route to transmit the props animation

```js
class AnimatedRoute extends Route {
  render() {
    const child = super.render();

    return child ? React.cloneElement(child, { animation: this.props.animation }) : null;
  }
}
```

#### New Porperties
- animation: a custom conf object that will allow you to describe your transition


## Configurations

A configuration is an object with two function as properties:
- getContainer: return the container of the Switch
- getChildren: return the children of a Switch

Both those functions receive as an argument an object with three fields:
- child: the child that would have been render by a switch of react-router
- animation: the animation props passed to the switch
- props: the other props passed to the switch


#### Dumb Example
```js
{
  getContainer: () => <React.Fragment />;
  getChildren: ({ child, props, animation }) => React.cloneElement(
    child,
    { parentsProps: props, animation }
  );
}
```

## With React Transition Group

### Switch

The container is rendered as a Transition group, and the animations conf are passed as props:

```js
<Switch ... animation={animation}/>
```

```js
export const getContainer = ({ animation }) => (
  <TransitionGroup component={null} timeout={300} {...animation} />
);
```

It will also filter its children as a switch from react-router would have.

### Route

```js
<Switch ... animation={switchAnimation}/>
  <Route ... animation={routeAnimation} />
</Switch>
```
Let's calls `CHILD` what would have render a route from `react-router`.
The route are rendered as Transtions according to `animation( ~= { ...parentAnimation, ...routeAnimation })`:
- if routeAnimation is null it will behave as it would with `react-router` and render `CHILD`
- if `animation` has a falsy field `classNames`, it will Render:
```js
    <Transition {...animation}>
      {status => React.cloneElement(CHILD, { animation: { ...animation, status } })}
    </Transition>
```
- if `animation` has a non falsy field classNames route. For convenient use by default we'll add `container = <div className={animation.classNames} />` (you can customize it with the container field of animation):
```js
    <CSSTransition {...animation}>
      {container ? React.cloneElement(container, {}, CHILD) : container}
    </CSSTransition>
```

#### PS: this is a simplification of the process, you must understand the real cloned element is the route that preserves the animation props


## THANKS FOR READING !

this is a first try, feel free to bring me better ideas :D
