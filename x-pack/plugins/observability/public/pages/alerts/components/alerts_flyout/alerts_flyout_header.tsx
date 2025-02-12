/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { ALERT_RULE_NAME } from '@kbn/rule-data-utils';
import { get } from 'lodash';
import { EuiSpacer, EuiTitle } from '@elastic/eui';
import { ExperimentalBadge } from '../../../../components/shared/experimental_badge';
import { FlyoutProps } from './types';

// eslint-disable-next-line import/no-default-export
export default function AlertsFlyoutHeader({ alert }: FlyoutProps) {
  return (
    <>
      <ExperimentalBadge />
      <EuiSpacer size="s" />
      <EuiTitle size="m" data-test-subj="alertsFlyoutTitle">
        <h2>{get(alert, ALERT_RULE_NAME)}</h2>
      </EuiTitle>
    </>
  );
}
