Group Control
=============

Restrict available assignees based on user ids, tags, groups and organizations.

### Settings

#### - Configuration

This should be a valid JSON object that look like this:

```json
{
  "hide":{
    "user_ids": [1, 2, 4],
    "group_ids": [1, 2, 4]
  },
  
  "hidden_from":{
    "user_ids": [1, 2, 4],
    "user_tags": ["light", "restricted"],
    "group_ids": [1, 2, 4],
    "organization_ids": [1, 2, 4]
  }
}
```
