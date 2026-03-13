# Microsoft Foundry for Visual Studio Code

With the **Microsoft Foundry for Visual Studio Code extension** you can easily deploy Large Language Models, develop AI applications, develop with Agents, and more with [Microsoft Foundry](https://azure.microsoft.com/products/ai-foundry/) from the Visual Studio Code interface.

With Microsoft Foundry, you can:

- Deploy language models from Microsoft, OpenAI, Meta, DeepSeek, and more using the model catalog
- Test deployed models in a model playground
- Start building with deployed models by right-clicking on the model to get the sample code
- Create, deploy, and test agents with Azure AI Agent Service

With this extension installed, you can accomplish much of this workflow directly from Visual Studio Code.

## Get Started

To get the most out of the extension, please set your Microsoft Foundry Project by using the command palette (Ctrl + Shift + P by default), with the command "Microsoft Foundry: Select Default Project".

The following steps will help you get started with the Microsoft Foundry extension:

1. Click on the Azure Icon on the VS Code Navbar.
2. Under the "Resources" section, select your Azure Subscription and Resource Group.
3. Click on "Microsoft Foundry" and open your project, you should see both Agents and Models.
4. Now you can start interacting with your agents and models.

For a full list of features available in the extension, use the Command Palette and search "Microsoft Foundry".

## Dependencies

The Microsoft Foundry extension for Visual Studio Code has an dependency on the follow Visual Studio Code extensions:

- [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)
- [AI Toolkit for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-windows-ai-studio.windows-ai-studio)

## Learn more

- [Microsoft Foundry VS Code extension Documentation](https://aka.ms/azureaifoundry/vscode/docs)

## Troubleshooting

### ACR Permission Error During Hosted Agent Deployment

When deploying a hosted agent, the extension creates an Azure Container Registry (ACR) and assigns roles so your project can pull container images. If you lack permission to assign roles, you'll see an authorization error.

We are actively working with Foundry service team for a better user experience. Currently, there're 2 workarounds:

#### Option 1: Pre-assign ACR Roles (Recommended)

Ask your admin to pre-create the ACR and assign these roles directly:

| Role                                         | Assign To                  | Purpose               |
| -------------------------------------------- | -------------------------- | --------------------- |
| Container Registry Repository Reader         | Project's managed identity | Read container images |
| Container Registry Repository Catalog Lister | Project's managed identity | List repositories     |
| Container Registry Repository Writer         | Your user account          | Push container images |

1. Create an ACR in the same resource group as your Foundry project
2. Find the project's managed identity (System-assigned identity on the AI Foundry project resource)
3. On the ACR, go to **Access Control (IAM)** > **Add** > **Add role assignment**
4. Assign the roles above to the appropriate principals

#### Option 2: Grant Role Assignment Permission (Not Recommended)

Alternatively, ask your admin to grant you **User Access Administrator** or **Owner** role on the ACR or resource group. This lets the extension auto-assign roles but gives you over-privileged permissions, thus not recommended.

## Support

Support for this extension is provided on our [GitHub Issue Tracker](https://github.com/microsoft/ai-foundry-for-vscode/issues). You can submit a bug report, a feature suggestion or participate in discussions.

You can also send any bugs or concerns privately to us at [vscai-support@microsoft.com](mailto:vscai-support@microsoft.com)

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct]. For more information see the [Code of Conduct FAQ].

## Privacy Statement

The [Microsoft Enterprise and Developer Privacy Statement] describes the privacy statement of this software.

[Microsoft Enterprise and Developer Privacy Statement]: https://go.microsoft.com/fwlink/?LinkID=521839
[Microsoft Open Source Code of Conduct]: https://opensource.microsoft.com/codeofconduct/
[Code of Conduct FAQ]: https://opensource.microsoft.com/codeofconduct/faq/
[opencode@microsoft.com]: mailto:opencode@microsoft.com
