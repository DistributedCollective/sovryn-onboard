import Joi from "joi";

import {
  type ChainId,
  type DecimalChainId,
  type WalletInit,
  type WalletModule,
  type ValidateReturn,
  chainNamespaceValidation,
  chainIdValidation,
  chainValidation,
  validate,
} from "@sovryn/onboard-common";

import type { InitOptions, WalletState } from "./types.js";

const unknownObject = Joi.object().unknown();

const connectedChain = Joi.object({
  namespace: chainNamespaceValidation.required(),
  id: chainIdValidation.required(),
});

const account = Joi.object({
  address: Joi.string().required(),
});

const chains = Joi.array().items(chainValidation);
const accounts = Joi.array().items(account);

const wallet = Joi.object({
  label: Joi.string(),
  icon: Joi.string(),
  provider: unknownObject,
  instance: unknownObject,
  accounts,
  chains: Joi.array().items(connectedChain),
})
  .required()
  .error(new Error("wallet must be defined"));

const wallets = Joi.array().items(wallet);

const walletModule = Joi.object({
  label: Joi.string().required(),
  getInfo: Joi.function().arity(1).required(),
  getInterface: Joi.function().arity(1).required(),
});

const walletInit = Joi.array().items(Joi.function()).required();

const initOptions = Joi.object({
  wallets: walletInit,
  chains: chains.required(),
});

const setChainOptions = Joi.object({
  chainId: chainIdValidation.required(),
  chainNamespace: chainNamespaceValidation,
  wallet: Joi.string(),
});

export function validateWallet(
  data: WalletState | Partial<WalletState>
): ValidateReturn {
  return validate(wallet, data);
}

export function validateInitOptions(data: InitOptions): ValidateReturn {
  return validate(initOptions, data);
}

export function validateWalletModule(data: WalletModule): ValidateReturn {
  return validate(walletModule, data);
}

export function validateString(str: string, label?: string): ValidateReturn {
  return validate(
    Joi.string()
      .required()
      .label(label || "value"),
    str
  );
}

export function validateSetChainOptions(data: {
  chainId: ChainId | DecimalChainId;
  chainNamespace?: string;
  wallet?: WalletState["label"];
}): ValidateReturn {
  return validate(setChainOptions, data);
}

export function validateWalletInit(data: WalletInit[]): ValidateReturn {
  return validate(walletInit, data);
}
