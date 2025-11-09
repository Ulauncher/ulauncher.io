---
title: Overview
---

## What is an Extension

Ulauncher extensions are **Python 3** programs that run as separate processes along with the app.

When you run Ulauncher it starts all available extensions so they are ready to react to user events.
All extensions are terminated when Ulauncher app is closed or crashed.

## What Extensions can do?

Extensions have the same capabilities as any other program --
they can access your directories, make network requests, etc.
Basically they get the same rights as a user that runs Ulauncher.

Extension API v2 (current) enables extension developers to write **custom handlers for keywords**.

![Custom keyword](../../../assets/ulauncher-timer-create-17m-rice.png)
*`ti` is a keyword, the rest of the query is an argument in this case.*

With Extension API it is possible to capture event when user enters "ti\<Space>" into the input
and then render any results below the input box.

Extensions can define preferences in `manifest.json` that can be overridden by a user
from Ulauncher Preferences window.

It is also possible to capture item click (enter) event and run a custom function to respond to that event.

## What Extensions can not do?

They cannot modify behaviour or look of Ulauncher app.
They can only be used to handle an input that starts with a keyword, which extension developers define in a manifest file.

## Ulauncher ⇄ Extension Communication Layer

Ulauncher communicates to extensions using stream Unix sockets.

For developer convenience there is an abstraction layer over the socket interface
that reduces amount of boilerplate code in extensions.

![API Message flow](../../../assets/extendsion-api-message-flow.png)
*Message flow*
