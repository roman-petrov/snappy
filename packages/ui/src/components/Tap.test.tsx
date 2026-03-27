import type { ReactElement } from "react";

import { fireEvent, render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { Tap } from "./Tap";

const renderTap = (ui: ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);
const navigate = vi.fn();
const { bridgeState, hapticImpact } = vi.hoisted(() => ({ bridgeState: { available: false }, hapticImpact: vi.fn() }));

vi.mock(import(`../hooks/useGo`), () => ({ useGo: () => navigate }));
vi.mock(import(`../core/AndroidBridge`), () => ({
  AndroidBridge: {
    get available() {
      return bridgeState.available;
    },
    hapticImpact,
    setBarStyle: vi.fn(),
  },
}));

describe(`tap`, () => {
  it(`navigates on link click for spa path`, () => {
    navigate.mockReset();
    bridgeState.available = false;
    const { container } = renderTap(<Tap link="/dashboard">Open</Tap>);

    fireEvent.click(within(container).getByRole(`link`));

    expect(navigate).toHaveBeenCalledWith(`/dashboard`);
  });

  it(`does not navigate on disabled link click`, () => {
    navigate.mockReset();
    bridgeState.available = false;
    const { container } = renderTap(
      <Tap disabled link="/dashboard">
        Open
      </Tap>,
    );

    fireEvent.click(within(container).getByRole(`link`));

    expect(navigate).not.toHaveBeenCalled();
  });

  it(`renders as button when link is not set`, () => {
    const { container } = renderTap(<Tap>Click</Tap>);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="_root_fa81c3"
          type="button"
        >
          Click
        </button>
      </div>
    `);
  });

  it(`renders as link when link is set and bridge is not available`, () => {
    bridgeState.available = false;
    const { container } = renderTap(<Tap link="/foo">Go</Tap>);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          class="_root_fa81c3"
          href="/foo"
          role="link"
        >
          Go
        </a>
      </div>
    `);
  });

  it(`renders as link with href when link is external object`, () => {
    bridgeState.available = false;
    const { container } = renderTap(<Tap link={{ href: `https://example.com` }}>External</Tap>);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          class="_root_fa81c3"
          href="https://example.com"
          role="link"
        >
          External
        </a>
      </div>
    `);
  });

  it(`passes rel and target for external link`, () => {
    bridgeState.available = false;
    const { container } = renderTap(
      <Tap link={{ href: `https://x.com`, rel: `noopener`, target: `_blank` }}>Link</Tap>,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          class="_root_fa81c3"
          href="https://x.com"
          rel="noopener"
          role="link"
          target="_blank"
        >
          Link
        </a>
      </div>
    `);
  });

  it(`renders hash link with href and does not call navigate on click`, () => {
    navigate.mockReset();
    bridgeState.available = false;
    const { container } = renderTap(<Tap link="#features">Section</Tap>);

    expect(container.querySelector(`a`)?.getAttribute(`href`)).toBe(`#features`);

    fireEvent.click(within(container).getByRole(`link`));

    expect(navigate).not.toHaveBeenCalled();
  });

  it(`does not call navigate on external link click`, () => {
    navigate.mockReset();
    bridgeState.available = false;
    const { container } = renderTap(<Tap link={{ href: `https://example.com` }}>External</Tap>);

    fireEvent.click(within(container).getByRole(`link`));

    expect(navigate).not.toHaveBeenCalled();
  });

  it(`calls both navigate and onClick when link is spa path and onClick is provided`, () => {
    navigate.mockReset();
    const onClick = vi.fn();
    bridgeState.available = false;
    const { container } = renderTap(
      <Tap link="/settings" onClick={onClick}>
        Settings
      </Tap>,
    );

    fireEvent.click(within(container).getByRole(`link`));

    expect(navigate).toHaveBeenCalledWith(`/settings`);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it(`renders as button when bridge is available and link is spa path`, () => {
    bridgeState.available = true;
    const { container } = renderTap(<Tap link="/foo">Go</Tap>);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="_root_fa81c3"
          type="button"
        >
          Go
        </button>
      </div>
    `);
  });

  it(`calls navigate on button click when bridge is available and link is spa path`, () => {
    navigate.mockReset();
    bridgeState.available = true;
    const { container } = renderTap(<Tap link="/foo">Go</Tap>);

    fireEvent.click(within(container).getByRole(`button`));

    expect(navigate).toHaveBeenCalledWith(`/foo`);
  });

  it(`passes ariaBusy through`, () => {
    const { container } = renderTap(<Tap ariaBusy>Loading</Tap>);

    expect(container.querySelector(`button`)?.getAttribute(`aria-busy`)).toBe(`true`);
  });

  it(`applies disabled to button`, () => {
    const { container } = renderTap(<Tap disabled>Click</Tap>);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="_root_fa81c3"
          disabled=""
          type="button"
        >
          Click
        </button>
      </div>
    `);
  });

  it(`applies aria-disabled to link when disabled`, () => {
    bridgeState.available = false;
    const { container } = renderTap(
      <Tap disabled link="/x">
        Link
      </Tap>,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          aria-disabled="true"
          class="_root_fa81c3"
          href="/x"
          role="link"
        >
          Link
        </a>
      </div>
    `);
  });

  it(`calls onClick on button click`, () => {
    const onClick = vi.fn();
    const { container } = renderTap(<Tap onClick={onClick}>Click</Tap>);

    fireEvent.click(within(container).getByRole(`button`));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="_root_fa81c3"
          type="button"
        >
          Click
        </button>
      </div>
    `);
  });

  it(`calls hapticImpact when vibrate is provided`, () => {
    bridgeState.available = true;
    hapticImpact.mockReset();
    const onClick = vi.fn();

    const { container } = renderTap(
      <Tap onClick={onClick} vibrate="confirm">
        Click
      </Tap>,
    );

    fireEvent.click(within(container).getByRole(`button`));

    expect(hapticImpact).toHaveBeenCalledWith(`confirm`);
    expect(hapticImpact).toHaveBeenCalledTimes(1);
  });

  it(`passes tip to aria and title`, () => {
    const { container } = renderTap(
      <Tap ariaPressed tip="Close dialog">
        X
      </Tap>,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          aria-label="Close dialog"
          aria-pressed="true"
          class="_root_fa81c3"
          title="Close dialog"
          type="button"
        >
          X
        </button>
      </div>
    `);
  });

  it(`omits aria-label and title when tip is not set`, () => {
    const { container } = renderTap(<Tap>X</Tap>);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="_root_fa81c3"
          type="button"
        >
          X
        </button>
      </div>
    `);
  });

  it(`applies custom className`, () => {
    const { container } = renderTap(<Tap cn="extra">Click</Tap>);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="_root_fa81c3 extra"
          type="button"
        >
          Click
        </button>
      </div>
    `);
  });

  it(`uses submit type when submit is true`, () => {
    const { container } = renderTap(<Tap submit>Send</Tap>);

    expect(container.querySelector(`button`)?.getAttribute(`type`)).toBe(`submit`);
  });
});
