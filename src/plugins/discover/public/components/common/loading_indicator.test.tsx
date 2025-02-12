/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import { LoadingIndicator } from './loading_indicator';
import React from 'react';
import { mount } from 'enzyme';

describe('Loading indicator', () => {
  it('default renders correctly', () => {
    const component = mount(<LoadingIndicator />);
    expect(component).toMatchSnapshot();
  });
  it('elastic renders correctly', () => {
    const component = mount(<LoadingIndicator type="elastic" />);
    expect(component).toMatchSnapshot();
  });
});
