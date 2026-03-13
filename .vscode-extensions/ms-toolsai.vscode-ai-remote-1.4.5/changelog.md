# Change Log

All notable changes to the "vscode-ai-remote" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## Version 1.4.5
- Release date: October 20th, 2025
- Status: General availability
- Fixed an issue where connecting to a job through public network would fail when the workspace with private endpoint enabled.

## Version 1.4.4
- Release date: September 28th, 2025
- Status: General availability
- Add support for Azure MFA authentication method.

## Version 1.4.3
- Release date: July 15th, 2025
- Status: General availability
- Fixed an issue where the web extension would not work when user try to switch to different folder in the remote connection.
- Add selection to allow user disable the message prompt when login to tenant.

## Version 1.4.2
- Release date: June 20th, 2025
- Status: General availability
- Fixed an issue where the web extension would not work with the latest version of Visual Studio Code.
- Enable ESM support for the extension.
- Remove `requests` package dependency to avoid vulnerability.

## Version 1.4.1
- Release date: February 13th, 2025
- Status: General availability
- Fixed an issue where enabling `use exec server` caused the AML extension web to fail to connect.

## Version 1.4.0
- Release date: February 11th, 2025
- Status: General availability
- Enhanced the remote connection setup process.
- Resolved a connection issue for computer instances under a VNet with an allowed IP list enabled.
- Fixed an issue with the Microsoft Authentication method set to `msal`.

## Version 1.2.0
- Release date: October 8th, 2024
- Status: General availability
- Telemetry improvements.

## Version 1.0.0
- Release date: August 5th, 2024
- Status: GA
- General Availability release.

## Version 0.50.0
- Release date: July 22nd, 2024
- Status: Public Preview
- Minor bug fixes.

## Version 0.48.0
- Release date: March 8th, 2024
- Status: Public Preview
- Speed improvements for remote connection setup process.

## Version 0.46.1
- Release date: February 21st, 2024
- Status: Public Preview
- Bug fixes.

## Version 0.46.0
- Release date: February 12th, 2024
- Status: Public Preview
- Improving reliability during a remote connection by retrying during transient connection issues.
- Reducing issues during remote connection setup by improving timeout logic.
- Improving experience when setting up a remote connection to an easier to understand modal dialog.

## Version 0.44.1
- Release date: February 1st, 2024
- Status: Public Preview
- Bug fixes and improvements during remote connection.

## Version 0.44.0
- Release date: January 10th, 2024
- Status: Public Preview
- Changing the authentication method from Azure Account extension to the built-in Microsoft Authentication provider for Visual Studio Code. Users may have to log in again to their accounts. Our apologies for the inconvenience.

## Version 0.42.0
- Release date: December 15th, 2023
- Status: Public Preview
- Bug fixes

## Version 0.40.0
- Release date: November 21st, 2023
- Status: Public Preview
- Bug fixes

## Version 0.36.0
- Release date: October 18th, 2023
- Status: Public Preview
- Telemetry improvements.

## Version 0.34.0
- Release date: September 7th, 2023
- Status: Public Preview
- Improvements to messages and errors shown during remote connections in some cases.

## Version 0.32.0
- Release date: August 9th, 2023
- Status: Public Preview
- Reducing extension size.
- Telemetry improvements.

## Version 0.30.0
- Release date: May 1st, 2023
- Status: Public Preview
- Connect to the same kernel session from Azure ML Studio when opening the active notebook in a remote compute instance connection.
- Auto activate Azure ML extension on remote connection to support websockets based shutdown notification.
- Update the range of ports used in remote desktop for VS Code server.
- Changing compute instance capitalization for consistency.

## Version 0.28.1

- Release date: April 6th, 2023
- Status: Public Preview
- Bug fixes.

## Version 0.28.0

- Release date: March 28th, 2023
- Status: Public Preview
- Bug fixes.

## Version 0.26.0

- Release date: March 3rd, 2023
- Status: Public Preview
- Improvements to history with remote connections to Azure ML computes.
- Telemetry improvements.

## Version 0.24.0

- Release date: February 2nd, 2023
- Status: Public Preview
- Bug fixes and telemetry improvements.

## Version 0.22.0

- Release date: December 7th, 2022
- Status: Public Preview
- Bug fixes and telemetry improvements.

## Version 0.20.0

- Release date: October 28th, 2022
- Status: Public Preview
- Better handling of 502 error responses during remote connection.
- Better selection of default python interpreter during some remote connections.

## Version 0.18.1

- Release date: September 30th, 2022
- Status: Public Preview
- Extension README updates
- Bug fixes.

## Version 0.18.0

- Release date: September 8th, 2022
- Status: Public Preview
- Improving error messages to avoid confusion when connecting to various compute targets.
- Bug fixes.

## Version 0.16.0

- Release date: August 4th, 2022
- Status: Public Preview
- Telemetry updates.
- Upgrade to finalized notebookEditor API.
- Bug fixes.

## Version 0.14.0

- Release date: July 6th, 2022
- Status: Public Preview
- Improving connection experience for long idle periods.

## Version 0.12.0

- Release date: May 5th, 2022
- Status: Public Preview
- Fixing issues with telemetry data.
- Adding nightly prerelease builds.
- Removing unused configuration setting for opening remote connection in new window.

## Version 0.10.0

- Release date: March 31st, 2022
- Status: Public Preview
- Removing extra prompts to to trust the workspace when connecting to Compute Instances.
- Changing extension to UI kind.
- Redesigning URI that opens remote connections to be more unique.

## Version 0.8.0

- Release date: March 7th, 2022
- Status: Public Preview
- Support for the latest version of Visual Studio Code.
- Bug fixes and improvements.

## Version 0.7.0

- Release date: February 2nd, 2022
- Status: Public Preview
- Support for the latest version of Visual Studio Code.
- Bug fixes and improvements.

## Version 0.6.0

- Release date: December 1st, 2021
- Status: Public Preview
- Improvements for connecting to Compute Instances to reduce timeouts.

## Version 0.5.0

- Release date: October 29th, 2021
- Status: Public Preview
- Improvements for re-authenticating during remote sessions

## Version 0.4.0

- Release date: July 13th, 2021
- Status: Public Preview
- Interactive jobs support

## Version 0.3.0

- Release date: May 20th, 2021
- Status: Public Preview
- Bug fixes and improvements

## Version 0.2.0

- Release date: April 2nd, 2021
- Status: Public Preview
- Bug fixes and improvements

## Version 0.1.0

- Release date: February 11th, 2021
- Status: Public Preview
- Initial release
