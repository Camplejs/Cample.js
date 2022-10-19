import { Route } from './../../src/route/route';
import { component } from './../component/component-examples';
export const route = new Route("#page","{{component}}",{component},"/");
export const route1 = new Route(undefined,undefined,{},"/");
