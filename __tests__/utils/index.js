import { get } from 'lodash';

export { default as factory } from './factory';
export { userModel, businessModel } from './models';

export const expectToBePlainObject = obj => {
  expect(get('constructor.name', obj)).toBe('Object');
};
