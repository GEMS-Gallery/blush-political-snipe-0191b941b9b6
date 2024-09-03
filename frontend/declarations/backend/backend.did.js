export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Page = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Opt(IDL.Text),
    'content' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'createPage' : IDL.Func([IDL.Opt(IDL.Text)], [IDL.Nat], []),
    'deletePage' : IDL.Func([IDL.Nat], [Result], []),
    'getPages' : IDL.Func([], [IDL.Vec(Page)], ['query']),
    'updatePage' : IDL.Func(
        [IDL.Nat, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
