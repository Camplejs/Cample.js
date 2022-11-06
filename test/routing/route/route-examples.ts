import { Route } from './../../../src/routing/route/route';
import { component } from './../../components/component/component-examples';
export const route = new Route("#page","{{component}}",{component},"/");
export const route1 = new Route(undefined,undefined,{},"/");
