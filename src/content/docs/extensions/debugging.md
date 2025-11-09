---
title: Debugging & Logging
---

1. Install your extension using the path to your local git repo rather than the public URL.
2. Commit your changes in the local repo.
3. Update the extension in Ulauncher's preferences to pull in the changes from your local repo.
4. To get verbose log output, stop Ulauncher and start it in a terminal `ulauncher -v`.
5. Once you are done with your changes, stop Ulaunchar and start it normally again
6. Push your changes to your public remote (GitHub, GitLab or other) if you want to make them available to others.

## Set up Logger

Here's all you need to do to enable logging for your extension:

```py
import logging

# create an instance of logger at a module level
logger = logging.getLogger(__name__)

# then use these methods in your classes or functions:
logger.error('...')
logger.warn('...')
logger.info('...')
logger.debug('...')
```
