import Hash "mo:base/Hash";

import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor {
  type Page = {
    id: Nat;
    title: ?Text;
    content: ?Text;
  };

  stable var nextPageId: Nat = 0;
  let pages = HashMap.HashMap<Nat, Page>(10, Nat.equal, Nat.hash);

  public func createPage(title: ?Text) : async Nat {
    let id = nextPageId;
    nextPageId += 1;
    let newPage: Page = {
      id = id;
      title = title;
      content = null;
    };
    pages.put(id, newPage);
    id
  };

  public query func getPages() : async [Page] {
    Array.tabulate(pages.size(), func (i: Nat) : Page {
      switch (pages.get(i)) {
        case null { { id = i; title = null; content = null } };
        case (?page) { page };
      }
    })
  };

  public func updatePage(id: Nat, title: ?Text, content: ?Text) : async Result.Result<(), Text> {
    switch (pages.get(id)) {
      case null { #err("Page not found") };
      case (?page) {
        let updatedPage: Page = {
          id = id;
          title = title;
          content = content;
        };
        pages.put(id, updatedPage);
        #ok()
      };
    }
  };

  public func deletePage(id: Nat) : async Result.Result<(), Text> {
    switch (pages.remove(id)) {
      case null { #err("Page not found") };
      case (?_) { #ok() };
    }
  };

  system func preupgrade() {
    // No need to implement for this simple example
  };

  system func postupgrade() {
    // No need to implement for this simple example
  };
}
