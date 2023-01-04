### 1. Why is my git pre-commit hook not executable by default?

- Because files are not executable by default; they must be set to be executable.

```
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

### 2. [Production Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html)

- Don’t use deprecated or vulnerable versions of Express
- Use TLS
- Use Helmet
- Use cookies securely
- Prevent brute-force attacks against authorization
- Ensure your dependencies are secure
- Avoid other known vulnerabilities
- Additional considerations

### 3. Workflow 

- Make sure you follow the Gitflow workflow 
- Make sure the commit messages are meaningful and well describe the task completed 
- NEVER PUSH ON THE MAIN OR DEVELOP BRANCH :danger:
- Ask for questions when tasks are not clear enough
- Be present in all the meetings
- Raise a PR when a feature branch is ready 
- NEVER MERGE BEFORE A REVIEW AND APPROVAL  :danger:
- Always merge from DEV branch before starting a  sprint
