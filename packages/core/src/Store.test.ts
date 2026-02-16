import { describe, expect, it, vi } from "vitest";

import { Store, type StoreListener } from "./Store";

describe(`Store`, () => {
  it(`initializes with given initial value`, () => {
    const someStore = Store(`Hello`);

    expect(someStore()).toBe(`Hello`);
  });

  it(`updates value with using "set" function`, () => {
    const someStore = Store(`Hello`);
    someStore.set(`World`);

    expect(someStore()).toBe(`World`);
  });

  it(`notifies about updates`, () => {
    const callback = vi.fn<StoreListener<string>>();
    const someStore = Store(`Hello`);
    someStore.subscribe(callback);
    someStore.set(`World`);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(`World`, `Hello`);
  });

  it(`does notify about updates if value is changed if compared with "===" operator`, () => {
    const callback = vi.fn<StoreListener<object>>();
    const someStore = Store({});
    someStore.subscribe(callback);
    someStore.set({});

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it(`does not notify about updates if value is not changed if compared with "===" operator`, () => {
    const callback = vi.fn<StoreListener<string>>();
    const someStore = Store(`Hello`);
    someStore.subscribe(callback);
    someStore.set(`Hello`);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it(`notifies multiple subscribers`, () => {
    const callback1 = vi.fn<StoreListener<string>>();
    const callback2 = vi.fn<StoreListener<string>>();
    const someStore = Store(`Hello`);
    someStore.subscribe(callback1);
    someStore.subscribe(callback2);
    someStore.set(`World`);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledWith(`World`, `Hello`);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith(`World`, `Hello`);
  });

  it(`unsubscribes correctly`, () => {
    const callback = vi.fn<StoreListener<string>>();
    const someStore = Store(`Hello`);
    const unsubscribe = someStore.subscribe(callback);
    unsubscribe();
    someStore.set(`World`);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  describe(`Derived stores`, () => {
    describe(`map`, () => {
      it(`creates derived store that extracts value from source`, () => {
        const userStore = Store({ email: `user@example.com`, id: 1, name: `Alice` });
        const emailStore = userStore.map(user => user.email);

        expect(emailStore()).toBe(`user@example.com`);
      });

      it(`notifies listeners only when extracted value changes`, () => {
        const onEmailChange = vi.fn<StoreListener<string>>();
        const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });
        const emailStore = userStore.map(user => user.email);
        emailStore.subscribe(onEmailChange);

        userStore.set({ email: `alice@example.com`, id: 1, name: `Alice Smith` });

        expect(onEmailChange).toHaveBeenCalledTimes(0);

        userStore.set({ email: `alice.smith@example.com`, id: 1, name: `Alice Smith` });

        expect(onEmailChange).toHaveBeenCalledTimes(1);
        expect(onEmailChange).toHaveBeenCalledWith(`alice.smith@example.com`, `alice@example.com`);
      });

      it(`supports chaining multiple map transformations`, () => {
        const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });
        const emailStore = userStore.map(user => user.email);
        const domainStore = emailStore.map(email => email.split(`@`)[1] ?? ``);

        expect(domainStore()).toBe(`example.com`);

        userStore.set({ email: `alice@company.com`, id: 1, name: `Alice` });

        expect(domainStore()).toBe(`company.com`);
      });
    });

    describe(`filter`, () => {
      it(`uses strict equality (===) by default to compare values`, () => {
        const onNameChange = vi.fn<StoreListener<string>>();
        const userStore = Store({ id: 1, name: `Alice` });
        const nameStore = userStore.map(user => user.name);
        nameStore.subscribe(onNameChange);

        userStore.set({ id: 1, name: `Alice` });

        expect(onNameChange).toHaveBeenCalledTimes(0);

        userStore.set({ id: 1, name: `ALICE` });

        expect(onNameChange).toHaveBeenCalledTimes(1);
      });

      it(`allows custom comparison function to ignore case differences`, () => {
        const onNameChange = vi.fn<StoreListener<string>>();
        const userStore = Store({ id: 1, name: `Alice` });
        const nameStore = userStore.map(user => user.name).filter((a, b) => a.toLowerCase() === b.toLowerCase());
        nameStore.subscribe(onNameChange);

        userStore.set({ id: 1, name: `ALICE` });

        expect(onNameChange).toHaveBeenCalledTimes(0);

        userStore.set({ id: 1, name: `Bob` });

        expect(onNameChange).toHaveBeenCalledTimes(1);
        expect(onNameChange).toHaveBeenCalledWith(`Bob`, `Alice`);
      });

      it(`allows custom comparison function for object equality`, () => {
        const onUserChange = vi.fn<StoreListener<{ id: number; name: string }>>();
        const userStore = Store({ id: 1, metadata: `old`, name: `Alice` });

        const userDataStore = userStore
          .map(user => ({ id: user.id, name: user.name }))
          .filter((a, b) => a.id === b.id && a.name === b.name);
        userDataStore.subscribe(onUserChange);

        userStore.set({ id: 1, metadata: `new`, name: `Alice` });

        expect(onUserChange).toHaveBeenCalledTimes(0);

        userStore.set({ id: 1, metadata: `new`, name: `Bob` });

        expect(onUserChange).toHaveBeenCalledTimes(1);
      });
    });

    describe(`map and filter combinations`, () => {
      it(`applies filter after map transformation to prevent unnecessary updates`, () => {
        const onEmailChange = vi.fn<StoreListener<string>>();
        const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });
        const emailStore = userStore.map(user => user.email.toLowerCase()).filter((a, b) => a === b);
        emailStore.subscribe(onEmailChange);

        userStore.set({ email: `ALICE@EXAMPLE.COM`, id: 1, name: `Alice` });

        expect(onEmailChange).toHaveBeenCalledTimes(0);

        userStore.set({ email: `bob@example.com`, id: 1, name: `Bob` });

        expect(onEmailChange).toHaveBeenCalledTimes(1);
        expect(onEmailChange).toHaveBeenCalledWith(`bob@example.com`, `alice@example.com`);
      });

      it(`supports chain of map -> filter -> map transformations`, () => {
        const onDomainChange = vi.fn<StoreListener<string>>();
        const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });
        const emailStore = userStore.map(user => user.email);
        const normalizedEmailStore = emailStore.map(email => email.toLowerCase()).filter((a, b) => a === b);
        const domainStore = normalizedEmailStore.map(email => email.split(`@`)[1] ?? ``);
        domainStore.subscribe(onDomainChange);

        userStore.set({ email: `ALICE@EXAMPLE.COM`, id: 1, name: `Alice` });

        expect(onDomainChange).toHaveBeenCalledTimes(0);

        userStore.set({ email: `alice@company.com`, id: 1, name: `Alice` });

        expect(onDomainChange).toHaveBeenCalledTimes(1);
        expect(onDomainChange).toHaveBeenCalledWith(`company.com`, `example.com`);
      });

      it(`applies custom filter to transformed values from multiple map operations`, () => {
        const onFullNameChange = vi.fn<StoreListener<string>>();
        const userStore = Store({ email: `alice@example.com`, firstName: `Alice`, id: 1, lastName: `Smith` });

        const fullNameStore = userStore
          .map(user => `${user.firstName} ${user.lastName}`)
          .filter((a, b) => a.toLowerCase() === b.toLowerCase());
        fullNameStore.subscribe(onFullNameChange);

        userStore.set({ email: `alice@example.com`, firstName: `ALICE`, id: 1, lastName: `SMITH` });

        expect(onFullNameChange).toHaveBeenCalledTimes(0);

        userStore.set({ email: `alice@example.com`, firstName: `Bob`, id: 1, lastName: `Smith` });

        expect(onFullNameChange).toHaveBeenCalledTimes(1);
        expect(onFullNameChange).toHaveBeenCalledWith(`Bob Smith`, `Alice Smith`);
      });

      it(`filters object properties after map transformation`, () => {
        const onUserDataChange = vi.fn<StoreListener<{ email: string; name: string }>>();
        const userStore = Store({ email: `alice@example.com`, id: 1, metadata: `old`, name: `Alice` });

        const userDataStore = userStore
          .map(user => ({ email: user.email, name: user.name }))
          .filter((a, b) => a.email === b.email && a.name === b.name);
        userDataStore.subscribe(onUserDataChange);

        userStore.set({ email: `alice@example.com`, id: 1, metadata: `new`, name: `Alice` });

        expect(onUserDataChange).toHaveBeenCalledTimes(0);

        userStore.set({ email: `alice@example.com`, id: 1, metadata: `new`, name: `Alice Smith` });

        expect(onUserDataChange).toHaveBeenCalledTimes(1);
        expect(onUserDataChange).toHaveBeenCalledWith(
          { email: `alice@example.com`, name: `Alice Smith` },
          { email: `alice@example.com`, name: `Alice` },
        );
      });
    });

    describe(`subscription lifecycle`, () => {
      it(`does not subscribe to source until derived store has listeners`, () => {
        const onUserChange = vi.fn<StoreListener<{ id: number; name: string }>>();
        const userStore = Store({ id: 1, name: `Alice` });
        userStore.subscribe(onUserChange);

        userStore.map(user => user.name);

        userStore.set({ id: 1, name: `Bob` });

        expect(onUserChange).toHaveBeenCalledTimes(1);
      });

      it(`subscribes to source when derived store gets first listener`, () => {
        const onUserChange = vi.fn<StoreListener<{ id: number; name: string }>>();
        const onNameChange = vi.fn<StoreListener<string>>();
        const userStore = Store({ id: 1, name: `Alice` });
        userStore.subscribe(onUserChange);

        const nameStore = userStore.map(user => user.name);
        nameStore.subscribe(onNameChange);

        userStore.set({ id: 1, name: `Bob` });

        expect(onNameChange).toHaveBeenCalledTimes(1);
        expect(onUserChange).toHaveBeenCalledTimes(1);
      });

      it(`unsubscribes from source only when last listener is removed`, () => {
        const onUserChange = vi.fn<StoreListener<{ id: number; name: string }>>();
        const userStore = Store({ id: 1, name: `Alice` });
        userStore.subscribe(onUserChange);

        const nameStore = userStore.map(user => user.name);
        const onNameChange1 = vi.fn<StoreListener<string>>();
        const onNameChange2 = vi.fn<StoreListener<string>>();
        const unsubscribe1 = nameStore.subscribe(onNameChange1);
        const unsubscribe2 = nameStore.subscribe(onNameChange2);

        userStore.set({ id: 1, name: `Bob` });

        expect(onNameChange1).toHaveBeenCalledTimes(1);
        expect(onNameChange2).toHaveBeenCalledTimes(1);

        unsubscribe1();
        userStore.set({ id: 1, name: `Charlie` });

        expect(onNameChange1).toHaveBeenCalledTimes(1);
        expect(onNameChange2).toHaveBeenCalledTimes(2);

        unsubscribe2();
        userStore.set({ id: 1, name: `David` });

        expect(onNameChange1).toHaveBeenCalledTimes(1);
        expect(onNameChange2).toHaveBeenCalledTimes(2);
        expect(onUserChange).toHaveBeenCalledTimes(3);
      });
    });

    describe(`subscription chains`, () => {
      it(`propagates changes through chain of derived stores`, () => {
        const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });
        const emailStore = userStore.map(user => user.email);
        const domainStore = emailStore.map(email => email.split(`@`)[1] ?? ``);
        const onEmailChange = vi.fn<StoreListener<string>>();
        const onDomainChange = vi.fn<StoreListener<string>>();
        emailStore.subscribe(onEmailChange);
        domainStore.subscribe(onDomainChange);

        userStore.set({ email: `alice@company.com`, id: 1, name: `Alice` });

        expect(onEmailChange).toHaveBeenCalledTimes(1);
        expect(onEmailChange).toHaveBeenCalledWith(`alice@company.com`, `alice@example.com`);
        expect(onDomainChange).toHaveBeenCalledTimes(1);
        expect(onDomainChange).toHaveBeenCalledWith(`company.com`, `example.com`);
      });

      it(`unsubscribes from chain when intermediate store loses all listeners`, () => {
        const onUserChange = vi.fn<StoreListener<{ email: string; id: number; name: string }>>();
        const userStore = Store({ email: `alice@example.com`, id: 1, name: `Alice` });
        userStore.subscribe(onUserChange);

        const emailStore = userStore.map(user => user.email);
        const domainStore = emailStore.map(email => email.split(`@`)[1] ?? ``);
        const onEmailChange = vi.fn<StoreListener<string>>();
        const onDomainChange = vi.fn<StoreListener<string>>();
        const unsubscribeEmail = emailStore.subscribe(onEmailChange);
        const unsubscribeDomain = domainStore.subscribe(onDomainChange);

        userStore.set({ email: `alice@company.com`, id: 1, name: `Alice` });

        expect(onEmailChange).toHaveBeenCalledTimes(1);
        expect(onDomainChange).toHaveBeenCalledTimes(1);

        unsubscribeEmail();
        unsubscribeDomain();

        userStore.set({ email: `alice@test.com`, id: 1, name: `Alice` });

        expect(onEmailChange).toHaveBeenCalledTimes(1);
        expect(onDomainChange).toHaveBeenCalledTimes(1);
        expect(onUserChange).toHaveBeenCalledTimes(2);
      });
    });
  });
});
