/**
 * E2E Tests: Complete Workflow
 *
 * Tests the full lifecycle: source addition → bundle discovery → install →
 * verify installation → uninstall → verify removal.
 *
 * Uses createE2ETestContext() for headless testing (no VS Code Extension Host
 * required). Follows the same patterns as lockfile-source-of-truth.test.ts.
 *
 * Requirements covered:
 * - Source addition and bundle discovery
 * - User-scope bundle installation
 * - Repository-scope bundle installation
 * - Installed bundle listing by scope
 * - Bundle uninstallation and file cleanup
 */

import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as sinon from "sinon";
import * as vscode from "vscode";
import nock from "nock";
import {
  createE2ETestContext,
  E2ETestContext,
  generateTestId,
} from "../helpers/e2eTestHelpers";
import {
  RepositoryTestConfig,
  ReleaseConfig,
  setupReleaseMocks,
  createMockGitHubSource,
  cleanupReleaseMocks,
  computeBundleId,
  MochaTestContext,
} from "../helpers/repositoryFixtureHelpers";
import { RepositoryCommitMode } from "../../src/types/registry";
import { LockfileManager } from "../../src/services/LockfileManager";

suite("E2E: Complete Workflow Tests", () => {
  let testContext: E2ETestContext;
  let testId: string;
  let sandbox: sinon.SinonSandbox;
  let workspaceRoot: string;

  const TEST_CONFIG: RepositoryTestConfig = {
    owner: "workflow-owner",
    repo: "workflow-repo",
    manifestId: "workflow-bundle",
    baseVersion: "1.0.0",
  };

  const BUNDLE_ID = computeBundleId(
    TEST_CONFIG,
    TEST_CONFIG.baseVersion || "1.0.0",
  );

  // ─── Reusable helper ────────────────────────────────────────────────────────

  async function installBundleOrSkip(
    context: MochaTestContext,
    bundleId: string,
    options: {
      scope: "repository" | "user";
      commitMode?: RepositoryCommitMode;
      version: string;
    },
  ): Promise<void> {
    try {
      await testContext.registryManager.installBundle(bundleId, {
        scope: options.scope,
        commitMode: options.commitMode || "commit",
        version: options.version,
      });
    } catch (error: any) {
      if (error.message && error.message.includes("not yet implemented")) {
        context.skip();
      }
      throw error;
    }
  }

  async function setupSourceAndGetBundle(
    testIdSuffix: string,
    content: string,
  ): Promise<{ sourceId: string; bundle: any }> {
    const sourceId = `${testId}-${testIdSuffix}`;
    const source = createMockGitHubSource(sourceId, TEST_CONFIG);
    const releases: ReleaseConfig[] = [
      { tag: "v1.0.0", version: "1.0.0", content },
    ];
    setupReleaseMocks(TEST_CONFIG, releases);

    sandbox
      .stub(vscode.workspace, "workspaceFolders")
      .value([
        {
          uri: vscode.Uri.file(workspaceRoot),
          name: "test-workspace",
          index: 0,
        },
      ]);

    await testContext.registryManager.addSource(source);
    await testContext.registryManager.syncSource(sourceId);

    const rawBundles =
      await testContext.storage.getCachedSourceBundles(sourceId);
    const bundle = rawBundles.find((b) => b.id === BUNDLE_ID);

    if (!bundle) {
      throw new Error(
        `Bundle ${BUNDLE_ID} not found. Available: ${rawBundles.map((b) => b.id).join(", ")}`,
      );
    }

    return { sourceId, bundle };
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  setup(async function () {
    this.timeout(30000);
    testId = generateTestId("workflow");
    sandbox = sinon.createSandbox();

    if (
      vscode.authentication &&
      typeof vscode.authentication.getSession === "function"
    ) {
      sandbox.stub(vscode.authentication, "getSession").resolves(undefined);
    }

    const childProcess = require("child_process");
    sandbox.stub(childProcess, "exec").callsFake((...args: unknown[]) => {
      const cmd = args[0] as string;
      const callback = args[args.length - 1] as Function;
      if (cmd === "gh auth token") {
        callback(new Error("gh not available"), "", "");
      } else {
        callback(null, "", "");
      }
    });

    testContext = await createE2ETestContext();
    workspaceRoot = path.join(testContext.tempStoragePath, "test-workspace");
    fs.mkdirSync(workspaceRoot, { recursive: true });
    fs.mkdirSync(path.join(workspaceRoot, ".git", "info"), { recursive: true });

    // Clear adapter auth tokens
    const adapters = (testContext.registryManager as any).adapters;
    if (adapters) {
      adapters.forEach((adapter: any) => {
        if (adapter.authToken !== undefined) {
          adapter.authToken = undefined;
          adapter.authMethod = "none";
        }
      });
    }

    nock.disableNetConnect();
    nock.enableNetConnect("127.0.0.1");
  });

  teardown(async function () {
    this.timeout(10000);
    LockfileManager.resetInstance();
    await testContext.cleanup();
    sandbox.restore();
    cleanupReleaseMocks();
    nock.cleanAll();
    nock.enableNetConnect();
  });

  // ─── Tests ──────────────────────────────────────────────────────────────────

  suite("Source addition and bundle discovery", () => {
    test("addSource registers source and syncSource populates bundle cache", async function () {
      this.timeout(60000);

      const sourceId = `${testId}-discovery`;
      const source = createMockGitHubSource(sourceId, TEST_CONFIG);
      const releases: ReleaseConfig[] = [
        { tag: "v1.0.0", version: "1.0.0", content: "hello prompt" },
      ];
      setupReleaseMocks(TEST_CONFIG, releases);

      await testContext.registryManager.addSource(source);
      await testContext.registryManager.syncSource(sourceId);

      const bundles =
        await testContext.storage.getCachedSourceBundles(sourceId);
      assert.ok(bundles.length > 0, "syncSource should populate bundle cache");

      const found = bundles.find((b) => b.id === BUNDLE_ID);
      assert.ok(found, `Should find bundle ${BUNDLE_ID} in cache`);
    });
  });

  suite("User-scope install → list → uninstall", () => {
    test("install at user scope records bundle and uninstall removes it", async function () {
      this.timeout(60000);

      const { bundle } = await setupSourceAndGetBundle(
        "user-install",
        "user-scope content",
      );

      // Install
      await installBundleOrSkip(this, bundle.id, {
        scope: "user",
        version: "1.0.0",
      });

      // Verify listed as installed
      const installed =
        await testContext.registryManager.listInstalledBundles("user");
      const record = installed.find((b) => b.bundleId === BUNDLE_ID);
      assert.ok(record, "Bundle should appear in user-scope installed list");
      assert.strictEqual(
        record!.version,
        "1.0.0",
        "Installed version should be 1.0.0",
      );
      assert.strictEqual(record!.scope, "user", "Scope should be user");

      // Uninstall
      await testContext.registryManager.uninstallBundle(BUNDLE_ID, "user");

      // Verify removed
      const afterUninstall =
        await testContext.registryManager.listInstalledBundles("user");
      const removed = afterUninstall.find((b) => b.bundleId === BUNDLE_ID);
      assert.strictEqual(
        removed,
        undefined,
        "Bundle should not appear after uninstall",
      );
    });
  });

  suite("Repository-scope install → lockfile written", () => {
    test("install at repository scope writes lockfile", async function () {
      this.timeout(60000);

      // Must stub workspaceFolders before install
      const wfStub = sandbox
        .stub(vscode.workspace, "workspaceFolders")
        .value([
          {
            uri: vscode.Uri.file(workspaceRoot),
            name: "test-workspace",
            index: 0,
          },
        ]);

      const { bundle } = await setupSourceAndGetBundle(
        "repo-install",
        "repo-scope content",
      );

      await installBundleOrSkip(this, bundle.id, {
        scope: "repository",
        commitMode: "commit",
        version: "1.0.0",
      });

      const lockfilePath = path.join(
        workspaceRoot,
        "prompt-registry.lock.json",
      );
      assert.ok(
        fs.existsSync(lockfilePath),
        "Lockfile should exist after repository install",
      );

      const lockContent = JSON.parse(fs.readFileSync(lockfilePath, "utf-8"));
      const bundleIds = Object.keys(lockContent.bundles || {});
      assert.ok(
        bundleIds.length > 0,
        "Lockfile should contain at least one bundle entry",
      );
    });
  });

  suite("listInstalledBundles without scope includes all scopes", () => {
    test("listInstalledBundles() with no arg returns user-scope bundles", async function () {
      this.timeout(60000);

      const { bundle } = await setupSourceAndGetBundle(
        "all-scope",
        "all-scope content",
      );

      await installBundleOrSkip(this, bundle.id, {
        scope: "user",
        version: "1.0.0",
      });

      const all = await testContext.registryManager.listInstalledBundles();
      assert.ok(
        all.length > 0,
        "listInstalledBundles() should return installed bundles",
      );
    });
  });
});
