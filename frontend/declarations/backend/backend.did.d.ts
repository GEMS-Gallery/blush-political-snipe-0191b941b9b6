import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'id' : bigint, 'name' : string }
export interface Page {
  'id' : bigint,
  'categoryId' : [] | [bigint],
  'title' : [] | [string],
  'content' : [] | [string],
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'createCategory' : ActorMethod<[string], bigint>,
  'createPage' : ActorMethod<[[] | [string], [] | [bigint]], bigint>,
  'deleteCategory' : ActorMethod<[bigint], Result>,
  'deletePage' : ActorMethod<[bigint], Result>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getPages' : ActorMethod<[], Array<Page>>,
  'updateCategory' : ActorMethod<[bigint, string], Result>,
  'updatePage' : ActorMethod<
    [bigint, [] | [string], [] | [string], [] | [bigint]],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
