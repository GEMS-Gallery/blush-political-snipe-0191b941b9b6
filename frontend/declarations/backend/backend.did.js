export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Category = IDL.Record({ 'id' : IDL.Nat, 'name' : IDL.Text });
  const Page = IDL.Record({
    'id' : IDL.Nat,
    'categoryId' : IDL.Opt(IDL.Nat),
    'title' : IDL.Opt(IDL.Text),
    'content' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'createCategory' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'createPage' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat)],
        [IDL.Nat],
        [],
      ),
    'deleteCategory' : IDL.Func([IDL.Nat], [Result], []),
    'deletePage' : IDL.Func([IDL.Nat], [Result], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getPages' : IDL.Func([], [IDL.Vec(Page)], ['query']),
    'updateCategory' : IDL.Func([IDL.Nat, IDL.Text], [Result], []),
    'updatePage' : IDL.Func(
        [IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
