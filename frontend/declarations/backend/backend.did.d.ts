import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Page {
  'id' : bigint,
  'title' : [] | [string],
  'content' : [] | [string],
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'createPage' : ActorMethod<[[] | [string]], bigint>,
  'deletePage' : ActorMethod<[bigint], Result>,
  'getPages' : ActorMethod<[], Array<Page>>,
  'updatePage' : ActorMethod<[bigint, [] | [string], [] | [string]], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
