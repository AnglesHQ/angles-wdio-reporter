/* tslint:disable:no-console */
import anglesReporter from "angles-javascript-client";
import { Artifact } from "angles-javascript-client/dist/lib/models/Artifact";
import { Reporters, Options } from '@wdio/types'

export class AnglesWDIOService {

  anglesEnabled: boolean;
  reportingUrl: string;

  async onPrepare(config: Options.Testrunner) {
    let reporterConfig:any = {};
    const reporters: Reporters.ReporterEntry[] = config.reporters;
    reporters.forEach((reporter:any) => {
      if (reporter[0].name === "AnglesWDIOReporter") {
        reporterConfig = reporter[1]
      }
    })

    const {
      enabled,
      buildName,
      team,
      environment,
      component,
      phase,
      artifacts,
      baseUrl,
      reportingUrl
    } = reporterConfig;
    this.reportingUrl = reportingUrl;
    this.anglesEnabled = enabled;
    if (enabled) {
      anglesReporter.setBaseUrl(baseUrl);
      return anglesReporter.startBuild(
        buildName,
        team,
        environment,
        component,
        phase,
      ).then((build) => {
        process.env.ANGLES_ID = build._id;
        console.log(`Created build with id ${process.env.ANGLES_ID} in Angles`);
        if (artifacts) {
          const artifactArray:Artifact[] = [];
          artifacts.forEach((artifact:Artifact) => {
            const { groupId, artifactId, version } = artifact;
            artifactArray.push(new Artifact(groupId, artifactId, version))
          })
          anglesReporter.addArtifacts(artifactArray).then((buildWithArtifacts) => {
            console.log(`Stored artifacts for build ${buildWithArtifacts._id}`);
          });
        }
      });
    }
  }

  onComplete() {
    if (this.anglesEnabled){
      console.log(`The test results can be found here: ${this.reportingUrl}/build/?buildId=${process.env.ANGLES_ID}`)
      process.env.ANGLES_ID = undefined;
    }

  }
}
