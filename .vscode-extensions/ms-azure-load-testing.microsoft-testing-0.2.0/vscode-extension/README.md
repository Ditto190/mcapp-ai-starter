# TSA bug filing

TSA bug filing file has been configured: tsaoptions.json. Official builds are required to have TSA bug filing enabled by default. [Learn more](https://aka.ms/OBTSA)

# Introduction

TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project.

# Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1. Installation process
2. Software dependencies
3. Latest releases
4. API references

# Build and Test

TODO: Describe and show how to build your code and run the tests.

# Contribute

TODO: Explain how other users and developers can contribute to make your code better.

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:

- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)

# Setting up service connections

In order to setup Github-ServiceConnection to access the templates for build pipeline, follow these steps:

- Go to Project Settings -> Service Connections for your project. 
- In order to create new connection, Click New Service Connection button and select Github. You can use Personal Access Token. Go to 'https://github.com/settings/tokens' to create your PAT and paste it here. Fill in the other details and setup the connection.
- In order to update an existing connection, if your PAT expires, you can go to 'https://github.com/settings/tokens' to regenerate your PAT. Paste it in the existing service connection by selecting update.
- Update the name of service connection in the pipeline so that your ADO pipeline can access the Github templates.


In order to setup ALTVSCodeReleaseSvc and access setup, follow the steps in the guide here - 'https://eng.ms/docs/cloud-ai-platform/devdiv/vs-services-dougam/vs-marketplace-doronm/visual-studio-marketplace/secure-publishing-to-vs-marketplace/secure-automated-publishing-as-microsoft'