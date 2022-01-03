// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RegisteredTypes } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

export const definitions: RegisteredTypes = {
  types: {
    // Bridge constants
    ChainId: 'u8',
    ResourceId: '[u8; 32]',
    DepositNonce: 'u64',
    RoundSnapshot: 'Vec<AccountId>',
    Supports: 'Vec<AccountId>',
    ProposalVotes: {
      votes_for: 'Vec<AccountId>',
      votes_against: 'Vec<AccountId>',
      status: 'enum',
    },
    ValidatorPrefsWithBlocked: {
      commission: 'Compact<Perbill>',
      cmix_root: 'Hash',
      blocked: 'bool',
    },
    ValidatorPrefs: {
      commission: 'Compact<Perbill>',
      blocked: 'bool',
      cmix_root: 'Hash',
    },
    InflationFixedParams: {
      min_inflation: 'Compact<Perbill>',
      ideal_stake: 'Compact<Perbill>',
      falloff: 'Compact<Perbill>',
    },
    IdealInterestPoint: {
      block: 'BlockNumber',
      interest: 'Compact<Perbill>',
    },
    CustodyInfo: {
      allocation: 'Compact<Balance>',
      vested: 'Compact<Balance>',
      custody: 'AccountId',
      reserve: 'AccountId',
      proxied: 'bool',
    },
    SoftwareHashes: {
      server: 'Hash',
      fatbin: 'Hash',
      libpow: 'Hash',
      gateway: 'Hash',
      scheduling: 'Hash',
      wrapper: 'Hash',
      udb: 'Hash',
      notifications: 'Hash',
      extra: 'Option<Vec<Hash>>',
    },
    CountryCode: '[u8; 2]',
    GeoBin: 'u8',
    PointsMultiplier: 'u16',
    RewardPoints: {
      success: 'u32',
      failure: 'u32',
      block: 'u32',
    },
    Performance: {
      period: 'u64',
      points: 'RewardPoints',
      countries: 'Vec<(CountryCode, GeoBin)>',
      multipliers: 'Vec<(GeoBin, PointsMultiplier)>',
    },
    Timeouts: {
      precomputation: 'u64',
      realtime: 'u64',
      advertisement: 'u64',
    },
    Scheduling: {
      team_size: 'u8',
      batch_size: 'u32',
      min_delay: 'u64',
      pool_threshold: 'Permill',
    },
    UserRegistration: {
      max: 'u32',
      period: 'u64',
    },
    Variables: {
      performance: 'Performance',
      timeouts: 'Timeouts',
      scheduling: 'Scheduling',
      registration: 'UserRegistration',
    },
    Address: 'AccountId',
    Keys: 'SessionKeys',
    BlockNumber: 'u32',
    ProxyType: {
      _enum: ['Any', 'NonTransfer', 'Governance', 'Staking', 'Voting'],
    },
    Reasons: {
      _enum: ['Fee', 'Misc', 'all'],
    },
    Weight: 'u32',
    LookupSource: 'MultiAddress',
    AccountInfo: 'AccountInfoWithTripleRefCount',
    Timepoint: {
      height: 'BlockNumber',
      index: 'u32',
    },
    Multisig: {
      when: 'Timepoint',
      deposit: 'Balance',
      depositor: 'AccountId',
      approvals: 'Vec<AccountId>',
    },
    // BalanceLock: {
    //   id: 'LockIdentifier',
    //   amount: 'Balance',
    //   reasons: 'Reasons',
    // },
    AuthorityId: 'AccountId',
    // Moment: 'u64',
    // Balance: 'u64',
  },
};
