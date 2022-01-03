export class SubExtrinsic {
  extrinsic_index: string;
  block_num: number;
  block_timestamp: number;
  extrinsic_length?: string;
  version_info?: string;
  call_code: string;
  call_module_function: string;
  call_module: string;
  params: string;
  account_id: string;
  signature: string;
  nonce: number;
  era: string;
  extrinsic_hash: string;
  is_signed: number;
  success: number;
  fee: number;
  constructor(
    extrinsic_index: string,
    block_num: number,
    block_timestamp: number,
    extrinsic_length: string,
    version_info: string,
    call_code: string,
    call_module_function: string,
    call_module: string,
    params: string,
    account_id: string,
    signature: string,
    nonce: number,
    era: string,
    extrinsic_hash: string,
    is_signed: number,
    success: number,
    fee: number,
  ) {
    this.extrinsic_index = extrinsic_index;
    this.block_num = block_num;
    this.block_timestamp = block_timestamp;
    this.extrinsic_length = extrinsic_length;
    this.version_info = version_info;
    this.call_code = call_code;
    this.call_module_function = call_module_function;
    this.call_module = call_module;
    this.params = params;
    this.account_id = account_id;
    this.signature = signature;
    this.nonce = nonce;
    this.era = era;
    this.extrinsic_hash = extrinsic_hash;
    this.is_signed = is_signed;
    this.success = success;
    this.fee = fee;
  }
}

export class SubEvent {
  event_index: string;
  block_num: number;
  extrinsic_idx: number;
  type: string;
  module_id: string;
  event_id: string;
  params: string;
  extrinsic_hash: string;
  event_idx: number;
  constructor(
    event_index: string,
    block_num: number,
    extrinsic_idx: number,
    type: string,
    module_id: string,
    event_id: string,
    params: string,
    extrinsic_hash: string,
    event_idx: number,
  ) {
    this.event_index = event_index;
    this.block_num = block_num;
    this.extrinsic_idx = extrinsic_idx;
    this.type = type;
    this.module_id = module_id;
    this.event_id = event_id;
    this.params = params;
    this.extrinsic_hash = extrinsic_hash;
    this.event_idx = event_idx;
  }
}

export class SubBlock {
  block_num: number;
  block_timestamp: number;
  hash: string;
  parent_hash: string;
  state_root: string;
  extrinsics_root: string;
  logs: string;
  extrinsics: string;
  event_count: number;
  extrinsics_count: number;
  event: string;
  spec_version: number;
  validator: string;
  codec_error: number;
  finalized: number;
  constructor(
    block_num: number,
    block_timestamp: number,
    hash: string,
    parent_hash: string,
    state_root: string,
    extrinsics_root: string,
    logs: string,
    extrinsics: string,
    event_count: number,
    extrinsics_count: number,
    event: string,
    spec_version: number,
    validator: string,
    codec_error: number,
    finalized: number,
  ) {
    this.block_num = block_num;
    this.block_timestamp = block_timestamp;
    this.hash = hash;
    this.parent_hash = parent_hash;
    this.state_root = state_root;
    this.extrinsics_root = extrinsics_root;
    this.logs = logs;
    this.extrinsics = extrinsics;
    this.event_count = event_count;
    this.extrinsics_count = extrinsics_count;
    this.event = event;
    this.spec_version = spec_version;
    this.validator = validator;
    this.codec_error = codec_error;
    this.finalized = finalized;
  }
}

export class ChainData {
  block: SubBlock;
  extrinsics: Array<SubExtrinsic>;
  events: Array<SubEvent>;
}

export class PointData {
  validator: string;
  point: number;
  era: number;
  ratio: number;
  timestamp: number;
}

export class Transfer {
  module?: string;
  method?: string;
  amount?: string;
  from?: string;
  to?: string;
  signature?: string;
  nonce?: number;
  tip?: number;
  isSigned?: boolean;
  constructor(
    module: string,
    method: string,
    amount: string,
    from: string,
    to: string,
    signature: string,
    nonce: number,
    tip: number,
    isSigned: boolean,
  ) {
    this.module = module;
    this.method = method;
    this.amount = amount;
    this.from = from;
    this.to = to;
    this.signature = signature;
    this.nonce = nonce;
    this.tip = tip;
    this.isSigned = isSigned;
  }
}
