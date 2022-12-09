import Joi from 'joi';

import {
  validate,
  chainValidation,
  type ValidateReturn,
} from '@sovryn/onboard-common';

import type { SelectAccountOptions } from './types';

const basePath = Joi.object({
  label: Joi.string().required(),
  value: Joi.string().required(),
});

const basePaths = Joi.array().items(basePath);

const chains = Joi.array().items(chainValidation);

const asset = Joi.object({
  label: Joi.string().required(),
  address: Joi.string(),
});

const assets = Joi.array().items(asset);

const selectAccountOptions = Joi.object({
  basePaths: basePaths,
  assets: assets,
  chains: chains,
  scanAccounts: Joi.function().arity(1).required(),
  supportsCustomPath: Joi.bool(),
});

export const validateSelectAccountOptions = (
  data: SelectAccountOptions,
): ValidateReturn => {
  return validate(selectAccountOptions, data);
};
