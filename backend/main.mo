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
    categoryId: ?Nat;
  };

  type Category = {
    id: Nat;
    name: Text;
  };

  stable var nextPageId: Nat = 0;
  stable var nextCategoryId: Nat = 0;
  let pages = HashMap.HashMap<Nat, Page>(10, Nat.equal, Nat.hash);
  let categories = HashMap.HashMap<Nat, Category>(10, Nat.equal, Nat.hash);

  public func createCategory(name: Text) : async Nat {
    let id = nextCategoryId;
    nextCategoryId += 1;
    let newCategory: Category = {
      id = id;
      name = name;
    };
    categories.put(id, newCategory);
    id
  };

  public query func getCategories() : async [Category] {
    Array.tabulate(categories.size(), func (i: Nat) : Category {
      switch (categories.get(i)) {
        case null { { id = i; name = "" } };
        case (?category) { category };
      }
    })
  };

  public func updateCategory(id: Nat, name: Text) : async Result.Result<(), Text> {
    switch (categories.get(id)) {
      case null { #err("Category not found") };
      case (?category) {
        let updatedCategory: Category = {
          id = id;
          name = name;
        };
        categories.put(id, updatedCategory);
        #ok()
      };
    }
  };

  public func deleteCategory(id: Nat) : async Result.Result<(), Text> {
    switch (categories.remove(id)) {
      case null { #err("Category not found") };
      case (?_) { #ok() };
    }
  };

  public func createPage(title: ?Text, categoryId: ?Nat) : async Nat {
    let id = nextPageId;
    nextPageId += 1;
    let newPage: Page = {
      id = id;
      title = title;
      content = null;
      categoryId = categoryId;
    };
    pages.put(id, newPage);
    id
  };

  public query func getPages() : async [Page] {
    Array.tabulate(pages.size(), func (i: Nat) : Page {
      switch (pages.get(i)) {
        case null { { id = i; title = null; content = null; categoryId = null } };
        case (?page) { page };
      }
    })
  };

  public func updatePage(id: Nat, title: ?Text, content: ?Text, categoryId: ?Nat) : async Result.Result<(), Text> {
    switch (pages.get(id)) {
      case null { #err("Page not found") };
      case (?page) {
        let updatedPage: Page = {
          id = id;
          title = title;
          content = content;
          categoryId = categoryId;
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
