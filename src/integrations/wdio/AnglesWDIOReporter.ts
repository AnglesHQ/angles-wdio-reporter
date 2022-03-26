/* tslint:disable:no-console */
import WDIOReporter,{ RunnerStats, TestStats } from '@wdio/reporter'
import { Capabilities } from '@wdio/types';
import anglesReporter from 'angles-javascript-client';
import {Artifact} from "angles-javascript-client/dist/lib/models/Artifact";
import {Execution} from "angles-javascript-client/dist/lib/models/Execution";
import {extractPlatformFromCaps, ifSet} from "../utils/common-utils";

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
      await anglesReporter.setBaseUrl(this.baseUrl);
      this.capabilities = runnerStats.capabilities;
      await anglesReporter.setCurrentBuild(process.env.ANGLES_ID);
    }
  }

  async onTestStart(test: TestStats) {
    if (this.isEnabled && process.env.ANGLES_ID) {
      await anglesReporter.setCurrentBuild(process.env.ANGLES_ID);
      await anglesReporter.startTest(test.title, test.parent);
      const caps = this.capabilities as Capabilities.DesiredCapabilities;
      await anglesReporter.storePlatformDetails(extractPlatformFromCaps(caps));
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
      anglesReporter.saveTest()
        .then((execution: Execution) => {
          console.debug(`Saved execution ${execution.title} with id ${execution._id}`)
        })
        .catch((error) => {
          const { response } = error;
          let { message } = error;
          if (ifSet(response, 'data.message')) {
            message = response.data.message;
          }
          console.error(`Unable to save test in Angles due to : ${message}`);
          // TODO: find an error that will impact wdio.
          throw new Error(`Unable to save test in Angles due to : ${message}`);
        });
    }
  }

  onRunnerEnd() {
    if (this.isEnabled && process.env.ANGLES_ID) {
      console.info(`Angles Dashboard Results: ${this.reportingUrl}/build/?buildId=${process.env.ANGLES_ID}`);
      process.env.ANGLES_ID = undefined;
    }
  }
}
