/* tslint:disable:no-console */
import WDIOReporter,{ RunnerStats, TestStats } from '@wdio/reporter'
import { Capabilities } from '@wdio/types';
import anglesReporter from 'angles-javascript-client';
import {Artifact} from "angles-javascript-client/dist/lib/models/Artifact";
import {Platform} from "angles-javascript-client/dist/lib/models/Platform";

export class AnglesWDIOReporter extends WDIOReporter {

  isEnabled: boolean;
  baseUrl: string;
  reportingUrl: string;
  buildName: string;
  team: string;
  environment: string;
  component: string;
  phase: string;
  artifacts: Artifact[];
  capabilities: Capabilities.RemoteCapability;

  constructor(options: any) {
    super(options)
    this.isEnabled = options.enabled || true;
    this.baseUrl = options.baseUrl || 'http://127.0.0.1:3000/rest/api/v1.0/';
    this.reportingUrl = options.reportingUrl || 'http://127.0.0.1:3001';
    this.buildName = options.buildName || 'Test Automation Run';
    this.team = options.team || 'angles';
    this.environment = options.environment || 'qa';
    this.component = options.component || 'wdio-example';
    this.phase = options.phase || undefined;
    this.artifacts = options.artifacts || undefined;
    anglesReporter.setBaseUrl(this.baseUrl);
  }

  async onRunnerStart(runnerStats:RunnerStats) {
    if (this.isEnabled && process.env.ANGLES_ID) {
      anglesReporter.setBaseUrl(this.baseUrl);
      this.capabilities = runnerStats.capabilities;
      await anglesReporter.setCurrentBuild(process.env.ANGLES_ID);
    }
  }

  async onTestStart(test: TestStats) {
    if (this.isEnabled && process.env.ANGLES_ID) {
      await anglesReporter.setCurrentBuild(process.env.ANGLES_ID);
      anglesReporter.startTest(test.title, test.parent);
      const caps = this.capabilities as Capabilities.DesiredCapabilities
      const { platformName, platformVersion, browserName, browserVersion, deviceName } = caps;
      const platform: Platform = new Platform();
      platform.platformName = platformName;
      platform.platformVersion = platformVersion;
      platform.browserName = browserName;
      platform.browserVersion = browserVersion;
      platform.deviceName = deviceName;
      anglesReporter.storePlatformDetails(platform)
    }
  }

  async onTestPass(test: TestStats) {
    if (this.isEnabled && process.env.ANGLES_ID) {
      anglesReporter.pass(`Test ${test.title} has passed`, 'Test Passed', 'Test Passed', '');
    }
  }

  async onTestFail(test: TestStats) {
    if (this.isEnabled && process.env.ANGLES_ID) {
      anglesReporter.fail(`Test ${test.title} has failed`, 'Test Passed', 'Test Failed', '');
    }
  }

  async onTestSkip(test: TestStats) {
    if (this.isEnabled && process.env.ANGLES_ID) {
      anglesReporter.info(`Test ${test.title} has skipped`);
    }
  }

  async onTestEnd() {
    if (this.isEnabled && process.env.ANGLES_ID) {
      await anglesReporter.saveTest();
    }
  }

  onRunnerEnd() {
    if (this.isEnabled && process.env.ANGLES_ID) {
      console.info(`Angles Dashboard Results: ${this.reportingUrl}/build/?buildId=${process.env.ANGLES_ID}`);
      process.env.ANGLES_ID = undefined;
    }
  }
}
