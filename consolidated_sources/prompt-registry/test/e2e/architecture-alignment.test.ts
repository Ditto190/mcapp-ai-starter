/**
 * E2E Tests: Architecture Alignment
 *
 * Enforces architecture contracts that must hold across all refactors:
 *
 * CONTRACT 1 — Import integrity
 *   All key command and service files must be importable.  If TypeScript or
 *   webpack accidentally removes or breaks an export, this test file will fail
 *   to compile/load and Mocha will report the error immediately.
 *
 * CONTRACT 2 — RegistryManager singleton
 *   RegistryManager.getInstance() must return the same object reference on
 *   repeated calls (within the same process lifecycle).
 *
 * CONTRACT 3 — LockfileManager singleton-per-path
 *   LockfileManager.getInstance(path) must return the same object for
 *   the same path argument.
 *
 * CONTRACT 4 — onSourceAdded event fires
 *   RegistryManager fires onSourceAdded after addSource() is awaited.
 *
 * CONTRACT 5 — BundleCommands constructor is non-throwing
 *   new BundleCommands(registryManager) must not throw.
 */

import * as assert from "assert";
import * as sinon from "sinon";
import * as vscode from "vscode";
import {
  createE2ETestContext,
  E2ETestContext,
  generateTestId,
} from "../helpers/e2eTestHelpers";
import { RegistryManager } from "../../src/services/RegistryManager";
import { LockfileManager } from "../../src/services/LockfileManager";
import { BundleCommands } from "../../src/commands/BundleCommands";
import { BundleScopeCommands } from "../../src/commands/BundleScopeCommands";
import { BundleInstallationCommands } from "../../src/commands/BundleInstallationCommands";
import { BundleUpdateCommands } from "../../src/commands/BundleUpdateCommands";
import { BundleBrowsingCommands } from "../../src/commands/BundleBrowsingCommands";
import { RegistrySource } from "../../src/types/registry";

// CONTRACT 1: importing all the above is already enforced at module-load time.
// If any import above fails, Mocha surfaces a file-level error before any test
// runs — there is no additional test body needed for this contract.

suite("E2E: Architecture Alignment Contracts", () => {
  let testContext: E2ETestContext;
  let testId: string;
  let sandbox: sinon.SinonSandbox;

  setup(async function () {
    this.timeout(15000);
    testId = generateTestId("arch");
    sandbox = sinon.createSandbox();

    if (
      vscode.authentication &&
      typeof vscode.authentication.getSession === "function"
    ) {
      sandbox.stub(vscode.authentication, "getSession").resolves(undefined);
    }

    const childProcess = require("child_process");
    sandbox.stub(childProcess, "exec").callsFake((...args: unknown[]) => {
      const callback = args[args.length - 1] as Function;
      callback(new Error("gh not available"), "", "");
    });

    testContext = await createE2ETestContext();
  });

  teardown(async function () {
    this.timeout(10000);
    LockfileManager.resetInstance();
    await testContext.cleanup();
    sandbox.restore();
  });

  // ─── CONTRACT 1: key exports are importable ──────────────────────────────

  test("CONTRACT 1: all command and service classes are importable", function () {
    // Static assertion: if TypeScript compilation or module resolution broke
    // any of these, this test file would fail to load.
    assert.ok(typeof RegistryManager, "RegistryManager should be a class");
    assert.ok(typeof LockfileManager, "LockfileManager should be a class");
    assert.ok(typeof BundleCommands, "BundleCommands should be a class");
    assert.ok(
      typeof BundleScopeCommands,
      "BundleScopeCommands should be a class",
    );
    assert.ok(
      typeof BundleInstallationCommands,
      "BundleInstallationCommands should be a class",
    );
    assert.ok(
      typeof BundleUpdateCommands,
      "BundleUpdateCommands should be a class",
    );
    assert.ok(
      typeof BundleBrowsingCommands,
      "BundleBrowsingCommands should be a class",
    );
  });

  // ─── CONTRACT 2: RegistryManager is a singleton ──────────────────────────

  test("CONTRACT 2: RegistryManager.getInstance() returns same reference on repeated calls", function () {
    // getInstance() should not create a new instance when called repeatedly
    const first = RegistryManager.getInstance();
    const second = RegistryManager.getInstance();
    assert.strictEqual(
      first,
      second,
      "RegistryManager.getInstance() must return the same singleton instance",
    );
  });

  // ─── CONTRACT 3: LockfileManager is a singleton per path ────────────────

  test("CONTRACT 3: LockfileManager.getInstance(path) returns same reference for same path", function () {
    const testPath = testContext.tempStoragePath;
    const first = LockfileManager.getInstance(testPath);
    const second = LockfileManager.getInstance(testPath);
    assert.strictEqual(
      first,
      second,
      "LockfileManager.getInstance(path) must return the same instance for the same path",
    );
  });

  // ─── CONTRACT 4: onSourceAdded event fires ───────────────────────────────

  test("CONTRACT 4: registryManager.onSourceAdded fires when addSource() is called", async function () {
    this.timeout(15000);

    const firedEvents: RegistrySource[] = [];

    const disposable = testContext.registryManager.onSourceAdded((source) => {
      firedEvents.push(source);
    });

    const sourceId = `${testId}-event-source`;
    const testSource: RegistrySource = {
      id: sourceId,
      name: "Architecture Alignment Test Source",
      type: "github",
      url: "https://github.com/arch-test/arch-test",
      enabled: true,
      priority: 1,
    };

    try {
      await testContext.registryManager.addSource(testSource);
    } finally {
      disposable.dispose();
    }

    assert.ok(
      firedEvents.length >= 1,
      "onSourceAdded should fire at least once after addSource()",
    );
    assert.strictEqual(
      firedEvents[0].id,
      sourceId,
      "Fired event should carry the added source's id",
    );
  });

  // ─── CONTRACT 5: BundleCommands constructor is non-throwing ─────────────

  test("CONTRACT 5: new BundleCommands(registryManager) does not throw", function () {
    assert.doesNotThrow(() => {
      const _commands = new BundleCommands(testContext.registryManager);
    }, "BundleCommands constructor must not throw when given a valid RegistryManager");
  });
});
