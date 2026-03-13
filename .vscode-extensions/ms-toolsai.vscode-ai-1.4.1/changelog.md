## Version 1.4.1
-   Release date: October 20th, 2025
-   Fixed an issue where users could not load more than 5 Compute Instances

## Version 1.4.0
-   Release date: September 28th, 2025
-   Add support for Azure MFA authentication method.

## Version 1.2.1
-   Release date: July 15th, 2025
-   Fixed an issue when get templates during resource creation.

## Version 1.2.0
-   Release date: October 8th, 2024
-   Improvements to telemetry to diagnose issues with proxies.

## Version 1.0.0
-   Release date: August 5th, 2024
-   General Availability release.

## Version 0.50.0
-   Release date: July 22nd, 2024
-   Minor bug fixes

## Version 0.48.0
-   Release date: March 8th, 2024
-   Updates related to the latest Jupyter Extension API.

## Version 0.46.1
-   Release date: February 21st, 2024
-   Bug fix to ensure Azure ML extension activates correctly when used on vscode.dev.

## Version 0.46.0
-   Release date: February 12th, 2024
-   Changing Azure ML Remote extension to a dependency instead of extension pack for better extension management experience.

## Version 0.44.1
-   Release date: January 24th, 2024
-   Bug fixes related to authentication provider change in 0.44.0.
-   Updating to the latest Jupyter Extension API.

## Version 0.44.0
-   Release date: January 10th, 2024
-   Changing the authentication method from Azure Account extension to the built-in Microsoft Authentication provider for Visual Studio Code. Users may have to log in again to their accounts. Our apologies for the inconvenience.

## Version 0.42.0
-   Release date: December 15th, 2023
-   Bug fixes.

## Version 0.40.0
-   Release date: November 21st, 2023
-   Updated log-in panel using [Welcome Views](https://code.visualstudio.com/api/ux-guidelines/views#welcome-views) when not signed in to Azure
-   Bug fixes

## Version 0.38.0
-   Release date: October 18th, 2023
-   Bug fixes and improvements when picking an Azure ML Compute Instance for Jupyter Notebooks.
-   General bug fixes.

## Version 0.36.0
-   Release date: September 7th, 2023
-   Experience improvements in notebooks when connected to a compute instance.
-   Improvements to error messages.
-   Bug fixes.

## Version 0.34.0
-   Release date: August 9th, 2023
-   Adding a prompt to provide feedback when connecting to an Azure ML compute in VS Code for Web.
-   Improvements to the login and default workspace prompts in VS Code for Web connections.
-   Adding an informational prompt about autosave behavior in a desktop remote connection.
-   Adding resource group name in the description of workspace quick picks to avoid confusion between workspaces with identical names.
-   Improving behavior for tree refreshes.

## Version 0.32.2
-   Release date: May 1st, 2023
-   Connect to the same kernel session from Azure ML Studio when opening the active notebook in a remote compute instance connection.
-   Show a notification when the compute instance will shut down during a remote connection.
-   Improve the performance and reliability of Experiment and Run auto refresh.
-   Update the icons for Job status and loading in the extension.
-   Ensure that python script is saved before running a command job.
-   Changing compute instance capitalization for consistency.

## Version 0.30.3
-   Release date: April 14th, 2023
-   Bug fix for connecting to multiple Interactive Job sessions at the same time.

## Version 0.30.2
-   Release date: April 3rd, 2023
-   Bug fix for connecting to an Interactive Job in some cases.

## Version 0.30.0
-   Release date: March 28th, 2023
-   Improvements to Jupyter server selector and default workspace when connected to a Compute Instance or Interactive Job.
-   Bug fix to provide display name and detail when selecting Compute Instances in notebook server selector.

## Version 0.28.0
-   Release date: March 3rd, 2023
-   Fix for "Subscription not found" error when logging out
-   Fixing how the Azure ML Compute Instances option appears in the VS Code Jupyter Kernel Provider list
-   Avoid showing "Azure ML: Create Job" context menu item in Notebooks
-   Telemetry improvements

## Version 0.26.0

-   Release date: February 2nd, 2023
-   Improvements to YAML editing experience by providing completions for the VM Size property for computes (coming soon).
-   Supporting new types of YAML files including various AutoML jobs and MLTable.
-   Improving the speed of executing "Execute YAML" commands with the Azure CLI.

## Version 0.24.0

-   Release date: December 5th, 2022
-   Improvements to YAML editing experience, including local path completions and ARM id formats.
-   Improvement to behavior when not logged in to avoid log in prompt that blocks Notebook UI, Python file editing.
-   Telemetry improvements.

## Version 0.22.0

-   Release date: October 28th, 2022
-   Updates to support of AzureML data assets, including archive dataset containers.
-   Improved pagination for legacy experiments.
-   Enabling extension for use in VS Code for Web when installed on a remote server (e.g. connection to a Compute Instance or in Codespaces)

## Version 0.20.0

-   Release date: September 29th, 2022
-   Bug fixes
-   Improved activation and startup performance, extension is no longer activated on Python or Jyputer(ipynb) files.
-   New logs and outputs format for Jobs
-   Updated tree labels to change Datasets to Data and Experiments to Jobs

## Version 0.18.0

-   Release date: September 8th, 2022
-   Bug fixes, including Unknown error when retrieving subscriptions.
-   Reducing excessive refreshes of Azure Machine Learning resource caches and adding a command to manually refresh assets.
-   Telemetry updates

## Version 0.16.0

-   Release date: August 4th, 2022
-   Bug fixes
-   Telemetry updates

## Version 0.14.0

-   Release date: July 6th, 2022
-   Improving editing experience for paths in Azure Machine Learning CLI YAML config files.
-   The status of a Compute Instance will now refresh when connecting to the compute instance.

## Version 0.12.0

-   Release date: June 8th, 2022
-   Adding support for viewing deployments for an online or batch endpoint in the tree view and authoring deployment Azure Machine Learning CLI YAML config files.
-   Improving editing experience when referencing the latest version of an environment in YAML files.

## Version 0.10.0

-   Release date: May 5th, 2022
-   Adding prerelease nightly builds.
-   Rename Dataset to Data to support latest Azure Machine Learning CLI.
-   Fixing missing telemetry data.
-   Improving experience when opening a remote connection and the Azure account is different from the account in Azure Machine Learning Studio.
-   Changing behavior to avoid opening old windows when connecting to a Compute Instance from the Studio.
-   Improvements when canceling login.

## Version 0.8.2

-   Release date: April 8th, 2022
-   Fixing issue for workspaces that allow public access when behind a VNet.

## Version 0.8.1

-   Release date: April 4th, 2022
-   Fixing issue for multi-tenant users.

## Version 0.8.0

-   Release date: March 31st, 2022
-   Removing extra prompts to trust workspaces during remote connections.
-   Improving error messages and helping users know when to reload the window during remote connections.
-   Improving connection time by not waiting for Jupyter and Python extensions to load when this extension loads.
-   Removing Azure Machine Learning 1.0 CLI and API integration to better support Azure Machine Learning 2.0 CLI.
-   Bug fixes and improvements.

## Version 0.6.28

-   Release date: February 2nd, 2022
-   Support for latest version of Visual Studio Code.
-   Bug fixes and improvements.

## Version 0.6.27

-   Release date: November 8th, 2021
-   Support remote connection on new CI's

## Version 0.6.26

-   Release date: October 29th, 2021
-   Support for the latest preview version of the CLI extension for Azure Machine Learning
-   Improvements to Azure ML YAML config file editing experience

## Version 0.6.25

-   Release date: August 24th, 2021
-   Fix for schema loading issues in Azure ML YAML Config files
-   Extension size improvements
-   Bug fixes in interactive jobs

## Version 0.6.24

-   Release date: July 13th, 2021
-   Release status: Public preview
-   Interactive jobs support

## Version 0.6.23

-   Release date: May 20th, 2021
-   Release status: Public preview
-   Improvements to support Azure Machine Learning 2.0 CLI editing experience and commands.

## Version 0.6.22

-   Release date: April 2nd, 2021
-   Release status: Public preview
-   Bug fixes and improvements.

## Version 0.6.21

-   Release date: March 26th, 2021
-   Release status: Public preview
-   Improvements when creating vNext jobs using Azure ML CLI schemas. Users now receive suggestions and validation based on their selected workspace and resources.

## Version 0.6.20

-   Release date: February 11th, 2021
-   Release status: Public preview
-   Bug fixes and improvements

## Version 0.6.19

-   Release date: December 16th, 2020
-   Release status: Public preview
-   Experimental feature to help users create vNext jobs using Azure ML CLI schema
-   Bug fixes and improvements

## Version 0.6.18

-   Release date: December 2nd, 2020
-   Release status: Public preview
-   YAML language support including schema validation, completion etc.
-   Azure ML snippets in Python files
-   Base telemetry for remote connection to compute instances experience

## Version 0.6.17

-   Release date: November 25th, 2020
-   Release status: Public preview
-   Bug fixes and improvements

## Version 0.6.16

-   Release date: September 29th, 2020
-   Release status: Public preview
-   Users can now debug their experiment runs in Visual Studio Code when selecting 'local' as the compute.

## Version 0.6.15

-   Release date: September 22th, 2020
-   Release status: Public preview
-   Removed option to create enterprise workspaces, which are no longer supported by the service.

## Version 0.6.14

-   Release date: August 23th, 2020
-   Release status: Public preview
-   Users can now connect Jupyter notebooks to remote compute instances.
-   Users can create datasets from existing Azure blob data stores by selecting a path in a dropdown quickpick.

## Version 0.6.13

-   Release date: June 24th, 2020
-   Release status: Public preview
-   Tabular datasets can now be previewed by right-clicking on the node in the tree and selecting "Preview Dataset".
-   Compute instances can now be created, deleted, started, stopped in the extension. Users can learn how to connect to SSH-enabled compute instances when they create them.

## Version 0.6.12

-   Release date: May 28th, 2020
-   Release status: Public preview
-   Fixed bugs in dataset registration that prevented tabular datasets from being properly parsed into columns.
-   Fixed translation bugs.

## Version 0.6.11

-   Release date: April 30th, 2020
-   Release status: Public preview
-   Added support for managing datastores and datasets and specifying them during experiment runs.
-   Improved editor experience for viewing read-only data (like compute properties).
-   Allowing users to switch focus while still editing JSON files that confirm submissions.
-   Bug fixes

## Version 0.6.10

-   Release date: March 12th, 2020
-   Release status: Public preview
-   Added support for managing environments and specifying them during experiment runs.
-   Improved handling of dependent resources when deleting a workspace.
-   Bug fixes

## Version 0.6.9

-   Release date: February 18th, 2020
-   Release status: Public preview
-   Improved experience for creating computes and workspaces by allowing users to go back to previous steps to modify choices.
-   Fixed issue that prevented paginated results from showing properly.
-   Fixed issue that affected the VM size that users selected for newly created compute resources.

## Version 0.6.8

-   Release date: December 5th, 2019
-   Release status: Public preview
-   Added support for downloading and streaming logs from experiment runs.
-   Fixed issue that prevented the AML resources tree from showing all results for long lists of resources.

## Version 0.6.7

-   Release date: November 4th, 2019
-   Release status: Public preview
-   Now uploading project files via the snapshots API when the project directory is larger than 25 MB.
-   Added ability for users to select the tier (basic or enterprise) when creating a workspace.
-   Added progress bar when editing compute resources and getting compute properties.
-   Fixed a bug preventing users from running an experiment using the local compute.

## Version 0.6.6

-   Release date: September 25, 2019
-   Release status: Public preview
-   Run status is now dynamically updated for experiments
-   Fixed a bug that caused outputs from experiments to be unavailable.

## Version 0.6.5

-   Release date: September 20, 2019
-   Release status: Public preview
-   View Notebook VM's associated with a workspace
-   Bug fix to re-enable local Azure Experiment Runs

## Version 0.6.4

-   Release date: September 16, 2019
-   Release status: Public preview
-   Bug fix to address inability to create workspaces in various worldwide locations

## Version 0.6.3

-   Release date: September 11, 2019
-   Release status: Public preview
-   Internal refactoring and telemetry updates

## Version 0.6.2

-   Release date: August 24, 2019
-   Release status: Public preview
-   Bug fix to support running experiment against existing workspace

## Version 0.6.1

-   Release date: August 23, 2019
-   Release status: Public preview
-   Provide smart defaults for Azure ML resource names
-   Batch Azure ML resource creation to final experiment submit
-   Provide ability to view run status for Experiements and run configurations used
-   Removal of Flask server for communicating with Azure ML service

## Version 0.6.0

-   Quickly replaced with version 0.6.1. Version 0.6.0 still had some reliance on the Flask server.

## Version 0.5.0

-   Release date: April 25, 2019
-   Release status: Public preview
-   Streamline experiment submission steps (more to come)
-   Convert to using json rather than yaml for runconfig
-   Provide default runconfig templates for common ML framework usage
-   Bug fixes

## Version 0.4.5

-   Release date: March 13, 2019
-   Release status: Public preview
-   Update Azure ML runtime dependency
-   Many bug fixes and internal implementation improvements (more to come...)

## Version 0.4.0

-   Release date: December 13, 2018
-   Release status: Public preview
-   "Active Experiment" and "Last Run" configurations instead of "Attach Folder"
-   Fixed workflow for installing AzureML SDK for flask server use
-   Compute-centric runconfig management
-   Reduced workflow complexity
-   Bug fixes

## Version 0.3.2

-   Refocus extension to target Azure Machine Learning November 2018

## Version 0.3.1

-   Release date: October 16, 2018
-   Release status: Public Preview
-   Bug fix to allow tags to be specified when creating Azure docker images or model deployments.
-   Update Azure SDK dependency to fix inability to create a new runconfig file.

## Version 0.1.1

-   Release date: Sep 25, 2017
-   Release status: Public Preview

## What's new in this version

Initial Release
