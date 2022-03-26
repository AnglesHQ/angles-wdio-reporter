import {Capabilities} from "@wdio/types";
import {Platform} from "angles-javascript-client/dist/lib/models/Platform";

export const ifSet = (object: any , path: string) => {
  return path.split('.').reduce((obj, part) => obj && obj[part], object)
}

export const extractPlatformFromCaps = (caps: Capabilities.DesiredCapabilities) => {
  const { platformName, platform, version, platformVersion, browserName, browserVersion, deviceName } = caps;
  const { testobject_device } = caps as any;
  const testPlatform: Platform = new Platform();
  if (platformName) {
    testPlatform.platformName = platformName;
  } else if (platform) {
    testPlatform.platformName = platform;
  }
  if (platformVersion) { testPlatform.platformVersion = platformVersion; }
  if (browserName) { testPlatform.browserName = browserName; }
  if (browserVersion) {
    testPlatform.browserVersion = browserVersion;
  } else if (version) {
    testPlatform.browserVersion = version;
  }
  if (testobject_device) {
    testPlatform.deviceName = testobject_device;
  } else if (deviceName) {
    testPlatform.deviceName = deviceName;
  }
  return testPlatform;
}
