/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ExpressionFunctionDefinition } from '@kbn/expressions-plugin';
import { getFunctionHelp } from '../../../i18n';

type Input = number | string;

interface Arguments {
  value: Input;
}

export function lte(): ExpressionFunctionDefinition<'lte', Input, Arguments, boolean> {
  const { help, args: argHelp } = getFunctionHelp().lte;

  return {
    name: 'lte',
    type: 'boolean',
    inputTypes: ['number', 'string'],
    help,
    args: {
      value: {
        aliases: ['_'],
        types: ['number', 'string'],
        required: true,
        help: argHelp.value,
      },
    },
    fn: (input, args) => {
      const { value } = args;

      if (typeof input !== typeof value) {
        return false;
      }

      return input <= value;
    },
  };
}
