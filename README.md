# angles-wdio-reporter

The angles-wdio-reporter contains the custom reporter which can be used to store your wdio test results in the Angles Dashboard. 

#### WebDriverIO
To integrate the Angles Dashboard with your webdriverIO test, we have set-up a customer reporter [AnglesWDIOReporter](/src/integrations/wdio/AnglesWDIOReporter.ts), which you can configure by adding the following custom reporter config to your **wdio.conf.ts** file. A full example of this can be found in our [webdriverio-example](https://github.com/AnglesHQ/webdriverio-example) project.

```
{
  reporters: [
    [
      AnglesWDIOReporter,
      {
        enabled: true,
        baseUrl: 'http://127.0.0.1:3000/rest/api/v1.0/',
        reportingUrl: 'http://127.0.0.1:3001',
        team: 'angles',
        environment: 'qa',
        component: 'wdio-example',
        phase: 'crossbrowser',
        artifacts: [
          {
            groupId: 'anglesHQ',
            artifactId: 'angles-ui',
            version: '1.0.0'
          }
        ]
      }
    ]
  ]
}
```

More integration examples to come.
