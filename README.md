# Custom Keyboard Shortcuts Component

Component demonstrates the use of [lightning:backgroundUtilityItem](https://developer.salesforce.com/docs/component-library/bundle/lightning:backgroundUtilityItem) to implement declaratively defined keyboard shortcuts through the components attributes. Currently allows the user to assign keyboard shortcuts to run [Flows](https://help.salesforce.com/articleView?id=vpm_admin_flow_overview.htm&type=5) and navigate to Home tab. Read [more about this component in this blog](https://andyinthecloud.com/2018/12/16/custom-keyboard-shortcuts-with-lightning-background-utilities/).

1. Install [package](https://github.com/afawcett/kbshortcututil#package-versions) (admins) or deploy the component to your org via [sfdx force:source:deploy](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_force_source.htm) (devs).
2. Edit the desired application under **App Manager** under **Setup**
3. Select **Utility Items** under **APP SETTINGS**
4. Click **Add Utility Item** and select the **Keyboard Shortcuts** component
5. Configure the component as shown in the example below and click **Save**
6. You may need to refresh the page a couple of times or login / logout after first adding the component.

![example](https://raw.githubusercontent.com/afawcett/kbshortcututil/master/images/kbsexample.png)

**NOTE:** You can configure up to 9 shortcuts. If you need more add another instance of the component to the utlity bar.

Supported Keyboard Shortcut Actions
------------------------------------

The following actions are currently supported.

| Action | Description |
| ------ | ----------- |
| **flowui:flowname** | Where **flowname** is the name of a Flow to show in a modal popup |
| **flowauto:flowname** | Where **flowname** is the name of an Automation Flow to run in the background |
| **navigate:home** | Navigates to the Home tab |

Advanced Flow Usage
-------------------

By setting Flow output variables you can do the following:-
- Send popup toast messages to the display when they key is pressed
- Navigate to list views, records and other aspects of the UI when the key is pressed
- Refresh the page after some processing in the Flow has completed
- Run another automation or UI flow

Create the Flow output varialbles with the following names to accomplish the above.

| Variable Name | Variable Value |
| ------------- | ----------- |
| kbs_runFlow | For example **flowui:MyUIFlow** or **flowauto:MyAutoFlow** |
| kbs_event | Name of one of the [Lightning Experience naivigation events](https://developer.salesforce.com/docs/component-library/bundle/force:navigateToSObject/documentation), for example set the value to **e.force:navigateToSObject** |
| kbs_param_xxxx | Where **xxxx** is the name of a related parameter to the above event, For example create a variable called **kbs_param_recordId** and set its value to a record Id. |

To display a popup message set **kbs_event** equal to **e.force:showToast** and **kbs_param_message** equal to your message.

![exampleconfig](https://raw.githubusercontent.com/afawcett/kbshortcututil/master/images/flowsendmessage.png)

Package Versions
----------------

If you are an admin this might be a better option to install the component.

**NOTE:** This is an unlocked package, meaning you can see the contents of it in the installed org.

- [Version v0.2 - Production](https://login.salesforce.com/packaging/installPackage.apexp?p0=04t6A000002wBcVQAU) / [Sandbox](https://test.salesforce.com/packaging/installPackage.apexp?p0=04t6A000002wBcVQAU). Initial release.
